/** Student or teacher — the only two roles the schema allows. */
export type Role = 'student' | 'teacher';

/**
 * Shape passed between the auth form and its server actions.
 * Kept out of the 'use server' file: those may only export async functions.
 */
export type AuthState = {
  status: 'idle' | 'error' | 'notice';
  message: string;
  fullName: string;
  email: string;
  role: Role;
};

export const emptyAuthState: AuthState = {
  status: 'idle',
  message: '',
  fullName: '',
  email: '',
  role: 'student',
};
