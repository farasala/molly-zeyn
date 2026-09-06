'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export type AccountResult = { ok: boolean; message?: string };

/**
 * Renames the signed-in user. The `profiles_self_write` policy limits this to
 * their own row, and `role` is not touched here — a student cannot promote
 * themselves by editing their name.
 */
export async function renameSelf(formData: FormData): Promise<AccountResult> {
  const fullName = String(formData.get('fullName') ?? '').trim();
  if (fullName.length < 2) {
    return { ok: false, message: 'Names need at least two letters.' };
  }
  if (fullName.length > 80) {
    return { ok: false, message: 'That name is too long. Keep it under 80 characters.' };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: 'Your session has expired. Log in and try again.' };

  const { error } = await supabase
    .from('profiles')
    .update({ full_name: fullName })
    .eq('id', user.id);

  if (error) return { ok: false, message: 'The name could not be saved. Try again.' };

  revalidatePath('/', 'layout');
  return { ok: true };
}
