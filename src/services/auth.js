import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  reload
} from "firebase/auth";
import { auth } from "./firebase";

/**
 * Translates Firebase auth error codes into clear, user-friendly messages.
 * @param {Error} error - Firebase error object containing a `code` property.
 * @returns {string} Human-readable explanation suitable for UI display.
 */
export function formatAuthError(error) {
  if (!error) return "An unexpected authentication error occurred.";
  const code = error.code || "";

  switch (code) {
    case "auth/email-already-in-use":
      return "This email is already registered. Please log in or use another email.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password is too weak. Please use at least 6 characters.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Incorrect email or password. Please verify your details.";
    case "auth/user-disabled":
      return "This account has been disabled. Please contact support.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please wait a few moments before trying again.";
    case "auth/popup-closed-by-user":
      return "The Google sign-in window was closed before finishing.";
    case "auth/popup-blocked":
      return "Sign-in popup was blocked by your browser. Please allow popups for this site.";
    case "auth/network-request-failed":
      return "Network connection issue. Please check your internet connection.";
    case "auth/operation-not-allowed":
      return "This sign-in provider is currently disabled in Firebase Console.";
    default:
      return error.message || "An authentication error occurred.";
  }
}

/**
 * Registers a new user with email and password, updates display name, and sends email verification.
 * @param {string} name - User's display name.
 * @param {string} email - User's email address.
 * @param {string} password - User's account password.
 * @returns {Promise<import("firebase/auth").User>} The created Firebase User.
 */
export async function registerWithEmail(name, email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (name && name.trim()) {
      await updateProfile(user, { displayName: name.trim() });
    }

    // Send email verification to the registered address
    try {
      await sendEmailVerification(user);
    } catch (verifErr) {
      console.warn("Could not send verification email immediately:", verifErr);
    }

    return user;
  } catch (err) {
    err.friendlyMessage = formatAuthError(err);
    throw err;
  }
}

/**
 * Sends or resends an email verification to the specified user or current user.
 * @param {import("firebase/auth").User} [user] - Optional user instance. Defaults to auth.currentUser.
 * @returns {Promise<void>}
 */
export async function sendVerificationEmail(user = null) {
  const targetUser = user || auth.currentUser;
  if (!targetUser) {
    const err = new Error("No authenticated user found to send verification email to.");
    err.code = "auth/no-current-user";
    err.friendlyMessage = "Please sign in first before requesting a verification email.";
    throw err;
  }

  try {
    await sendEmailVerification(targetUser);
  } catch (err) {
    err.friendlyMessage = formatAuthError(err);
    throw err;
  }
}

/**
 * Signs in an existing user using email and password.
 * @param {string} email - Account email.
 * @param {string} password - Account password.
 * @returns {Promise<import("firebase/auth").User>}
 */
export async function signInWithEmail(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (err) {
    err.friendlyMessage = formatAuthError(err);
    throw err;
  }
}

/**
 * Initiates Google OAuth popup sign-in using Firebase GoogleAuthProvider.
 * @returns {Promise<import("firebase/auth").User>}
 */
export async function signInWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    const userCredential = await signInWithPopup(auth, provider);
    return userCredential.user;
  } catch (err) {
    err.friendlyMessage = formatAuthError(err);
    throw err;
  }
}

/**
 * Signs out the currently authenticated user.
 * @returns {Promise<void>}
 */
export async function signOutUser() {
  try {
    await signOut(auth);
  } catch (err) {
    err.friendlyMessage = formatAuthError(err);
    throw err;
  }
}

/**
 * Sends a password-reset email to the given email address.
 * @param {string} email - Account email address.
 * @returns {Promise<void>}
 */
export async function sendPasswordReset(email) {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (err) {
    err.friendlyMessage = formatAuthError(err);
    throw err;
  }
}

/**
 * Subscribes to Firebase Authentication state changes.
 * Returns an unsubscribe cleanup function to prevent duplicate listeners.
 * @param {(user: import("firebase/auth").User | null) => void} callback - Listener receiving current User or null.
 * @param {(error: Error) => void} [errorCallback] - Optional error handler.
 * @returns {import("firebase/auth").Unsubscribe} Cleanup function to unsubscribe the listener.
 */
export function subscribeToAuthState(callback, errorCallback) {
  return onAuthStateChanged(auth, callback, errorCallback);
}

/**
 * Returns the currently signed-in Firebase User or null.
 * @returns {import("firebase/auth").User | null}
 */
export function getCurrentUser() {
  return auth.currentUser;
}

/**
 * Reloads the user's profile to refresh fields like emailVerified.
 * @param {import("firebase/auth").User} [user] - Optional user instance. Defaults to auth.currentUser.
 * @returns {Promise<import("firebase/auth").User | null>} The reloaded user.
 */
export async function reloadUser(user = null) {
  const targetUser = user || auth.currentUser;
  if (!targetUser) return null;
  try {
    await reload(targetUser);
    return auth.currentUser;
  } catch (err) {
    err.friendlyMessage = formatAuthError(err);
    throw err;
  }
}

/**
 * Checks whether an authenticated user satisfies email verification requirements.
 * Google OAuth sign-in bypasses manual email verification.
 * @param {import("firebase/auth").User | null} user
 * @returns {boolean}
 */
export function isUserVerified(user) {
  if (!user) return false;
  const isGoogle = user.providerData?.some((p) => p.providerId === "google.com");
  if (isGoogle) return true;
  return Boolean(user.emailVerified);
}
