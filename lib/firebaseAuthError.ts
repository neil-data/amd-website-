export function getFirebaseAuthErrorMessage(error: unknown): string {
  if (!error || typeof error !== 'object') {
    return 'Authentication failed. Please try again.';
  }

  const code = 'code' in error ? String(error.code) : '';

  if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
    return 'Invalid email or password.';
  }

  if (code === 'auth/email-already-in-use') {
    return 'This email is already in use. Try logging in instead.';
  }

  if (code === 'auth/invalid-email') {
    return 'Please enter a valid email address.';
  }

  if (code === 'auth/weak-password') {
    return 'Password should be at least 6 characters.';
  }

  if (code === 'auth/operation-not-allowed') {
    return 'Email/password auth is disabled in Firebase Console. Enable it in Authentication > Sign-in method.';
  }

  if (code === 'auth/too-many-requests') {
    return 'Too many attempts. Please wait and try again.';
  }

  if (code === 'auth/unauthorized-domain') {
    return 'This domain is not authorized in Firebase. Add localhost in Firebase Authentication > Settings > Authorized domains.';
  }

  if (code === 'auth/invalid-api-key' || code === 'auth/configuration-not-found') {
    return 'Firebase config is invalid or incomplete. Verify your Firebase project keys and Authentication setup.';
  }

  if (code === 'auth/network-request-failed') {
    return 'Network error while contacting Firebase. Check your internet connection and try again.';
  }

  return 'Authentication failed. Please try again.';
}
