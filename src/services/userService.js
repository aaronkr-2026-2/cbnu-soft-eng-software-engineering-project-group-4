import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "./firebase";

/**
 * Translates Firestore error codes into human-readable messages.
 * @param {Error} error - Firestore error object.
 * @returns {string} User-friendly message.
 */
export function formatFirestoreError(error) {
  if (!error) return "An unexpected database error occurred.";
  const code = error.code || "";

  switch (code) {
    case "permission-denied":
      return "Access denied. You only have permission to view and edit your own profile.";
    case "unavailable":
      return "Database is temporarily unavailable. Please check your internet connection.";
    case "not-found":
      return "The requested profile document was not found.";
    case "already-exists":
      return "The document already exists.";
    case "resource-exhausted":
      return "Service quota exceeded. Please try again later.";
    default:
      return error.message || "A database error occurred.";
  }
}

/**
 * Fetches the user profile document from Firestore (`/users/{uid}`).
 * @param {string} uid - The Firebase Authentication User UID.
 * @returns {Promise<object | null>} The profile data object, or null if no profile exists.
 */
export async function getUserProfile(uid) {
  if (!uid || typeof uid !== "string") {
    const err = new Error("Invalid or missing user UID for profile lookup.");
    err.code = "invalid-uid";
    err.friendlyMessage = "User identifier is missing.";
    throw err;
  }

  try {
    const userDocRef = doc(db, "users", uid);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (err) {
    err.friendlyMessage = formatFirestoreError(err);
    console.error("Error reading user profile:", err);
    throw err;
  }
}

/**
 * Creates a basic user profile document in Firestore (`/users/{user.uid}`) ONLY if it does not already exist.
 * Preserves all existing fields and learning progress if the profile already exists.
 * @param {import("firebase/auth").User | { uid: string, displayName?: string, email?: string }} user - User object.
 * @returns {Promise<object>} The existing or newly created user profile.
 */
export async function createUserProfileIfMissing(user) {
  if (!user || !user.uid) {
    const err = new Error("Invalid or missing user object for profile creation.");
    err.code = "invalid-user";
    err.friendlyMessage = "Cannot create profile without a valid user ID.";
    throw err;
  }

  try {
    const userDocRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userDocRef);

    // If profile already exists, return existing data without overwriting anything
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }

    // Initialize clean, basic profile fields
    const initialProfile = {
      uid: user.uid,
      displayName: user.displayName?.trim() || user.email?.split("@")[0] || "Student",
      email: user.email || "",
      createdAt: serverTimestamp(),
      onboardingCompleted: false
    };

    await setDoc(userDocRef, initialProfile);
    return initialProfile;
  } catch (err) {
    err.friendlyMessage = formatFirestoreError(err);
    console.error("Error creating user profile:", err);
    throw err;
  }
}

/**
 * Updates an existing user's profile document (`/users/{uid}`).
 * Prevents callers from overwriting or modifying the immutable `uid` field.
 * @param {string} uid - The Firebase Authentication User UID.
 * @param {object} updates - Key-value pairs to update on the profile document.
 * @returns {Promise<void>}
 */
export async function updateUserProfile(uid, updates) {
  if (!uid || typeof uid !== "string") {
    const err = new Error("Invalid or missing user UID for profile update.");
    err.code = "invalid-uid";
    err.friendlyMessage = "User identifier is missing.";
    throw err;
  }

  if (!updates || typeof updates !== "object" || Object.keys(updates).length === 0) {
    return;
  }

  try {
    // Strip `uid` field to guarantee caller cannot tamper with document ownership
    const safeUpdates = { ...updates };
    delete safeUpdates.uid;

    safeUpdates.updatedAt = serverTimestamp();

    const userDocRef = doc(db, "users", uid);
    await updateDoc(userDocRef, safeUpdates);
  } catch (err) {
    err.friendlyMessage = formatFirestoreError(err);
    console.error("Error updating user profile:", err);
    throw err;
  }
}
