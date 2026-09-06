'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

const LEVEL_ID = 'elementary';

/**
 * Marks a word known, or takes the mark off again.
 *
 * The word is written as a plain string, which is why `known_words` needs no
 * migration when units 3-12 are filled in.
 */
export async function toggleKnownWord(word: string, known: boolean): Promise<{ ok: boolean }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false };

  const { error } = known
    ? await supabase
        .from('known_words')
        .insert({ user_id: user.id, level_id: LEVEL_ID, word })
    : await supabase
        .from('known_words')
        .delete()
        .eq('user_id', user.id)
        .eq('level_id', LEVEL_ID)
        .eq('word', word);

  // Marking a word already marked is not a failure.
  if (error && !error.message.toLowerCase().includes('duplicate')) return { ok: false };

  revalidatePath('/vocabulary');
  revalidatePath('/progress');
  revalidatePath('/dashboard');
  return { ok: true };
}
