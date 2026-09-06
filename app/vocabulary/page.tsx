import type { Metadata } from 'next';
import { AppHeader } from '@/components/AppHeader';
import { VocabularyBank } from '@/components/VocabularyBank';
import { EMPTY_ACCESS, getStudentAccess } from '@/lib/access';
import { requireAccount } from '@/lib/auth';
import { getVocabularyBank } from '@/lib/vocabulary';

export const metadata: Metadata = { title: 'Words · English Studio' };

const LEVEL_ID = 'elementary';

export default async function VocabularyPage() {
  const account = await requireAccount();
  if (account.kind === 'no-profile') return null;

  const isTeacher = account.user.profile.role === 'teacher';
  const access = isTeacher ? EMPTY_ACCESS : await getStudentAccess(LEVEL_ID);
  const words = await getVocabularyBank(LEVEL_ID, isTeacher, access);

  return (
    <div className="shell">
      <AppHeader user={account.user} />

      <div className="page">
        <header className="page-head">
          <p className="page-eyebrow">Elementary · A1–A2</p>
          <h1 className="page-title">Words</h1>
          <p className="page-lead">
            {isTeacher
              ? 'Every word in the course, with its meaning, an example and the recording.'
              : 'Every word from the lessons you have opened. Mark the ones you are sure of and filter down to what is left.'}
          </p>
        </header>

        <VocabularyBank words={words} />
      </div>
    </div>
  );
}
