// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import {
  NextOrObserver,
  User,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { getFirestore } from "firebase/firestore";
import { FavoriteGameInterface } from '../types/FavoriteGameInterface';

const firebaseConfig = {
  apiKey: "AIzaSyArV8NKqyNQuF3pSPkil7CD-g252QnD78E",
  authDomain: "gmlb2-617b0.firebaseapp.com",
  projectId: "gmlb2-617b0",
  storageBucket: "gmlb2-617b0.appspot.com",
  messagingSenderId: "874732249679",
  appId: "1:874732249679:web:dc0e40a1811b14267ec03a",
  measurementId: "G-YW57ERW81R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

export const addUser = async (user: User) => {
  const userRef = collection(db, "users");

  await setDoc(doc(userRef, user.uid), {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    favoriteGames: [],
  });
}

export const updateDisplayName = async (user: User, displayName: string) => {
  try {
    await updateProfile(user, {
      displayName: displayName,
    });
    console.log("Profile updated successfully");
  } catch (error) {
    console.error("Error updating profile: ", error);
  }
};

export const updateUser = async (
  user: User,
  displayName: string | null,
  photoURL: string | null,
  favoriteGames: FavoriteGameInterface[] | null,
) => {
  const userRef = doc(db, "users", user.uid);

  await updateDoc(userRef, {
    displayName,
    photoURL,
    favoriteGames,
  });
}

export const updateUserPhoto = async (
  user: User,
  photoURL: string | null,
) => {
  const userRef = doc(db, "users", user.uid);

  await updateDoc(userRef, {
    photoURL,
  });
}

export const updateUserStorage = async (
  user: User,
  displayName: string | null,
) => {
  const userRef = doc(db, "users", user.uid);

  await updateDoc(userRef, {
    displayName,
  });
}

export const getUser = async (uid: string) => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data();
  } else {
    console.log("No such user!");
  }
}

export const signInUser = async (
  email: string,
  password: string
) => {
  if (!email && !password) return;

  return await signInWithEmailAndPassword(auth, email, password)
}

export const signUpUser = async (
  email: string,
  password: string
) => {
  if (!email && !password) return;

  return await createUserWithEmailAndPassword(auth, email, password)
}

export const userStateListener = (callback: NextOrObserver<User>) => {
  return onAuthStateChanged(auth, callback)
}

export const SignOutUser = async () => await signOut(auth);

export const Upload = async (file: File, currentUser: User) => {
  const fileRef = ref(storage, 'profile/' + currentUser.uid + '/profile.jpg');

  return await uploadBytes(fileRef, file);
}

export const checkIfGameExists = async (gameSlug: string) => {
  const gameRef = doc(db, "games", gameSlug);
  const gameSnapshot = await getDoc(gameRef);

  console.log(gameSnapshot.exists());
  return gameSnapshot.exists();
}

export const addGame = async (gameSlug: string) => {
  const gameRef = collection(db, "games");

  const notExists = await checkIfGameExists(gameSlug);

  if (!notExists && gameSlug) {
    await setDoc(doc(gameRef, gameSlug), {
      comments: [],
    });
  }
}

export const addComment = async (
  gameSlug: string,
  commentText: string,
  nickname: string,
  avatarURL: string,
  userId: string,
) => {
  const gameRef = doc(db, "games", gameSlug);
  const gameSnapshot = await getDoc(gameRef);

  if (gameSnapshot.exists()) {
    const gameData = gameSnapshot.data();
    const { comments } = gameData as Document & { comments: string[] } || {};
    const newComment = {
      commentId: comments.length + 1,
      userId,
      commentText,
      avatarURL,
      nickname,
    }
    const newComments = [...comments, newComment];

    await updateDoc(gameRef, {
      comments: newComments,
    });
  }
};

export const addFavoriteGame = async (user: User, game: FavoriteGameInterface) => {
  const userRef = doc(db, "users", user.uid);
  const userData = await getUser(user.uid);
  const { favoriteGames } = userData as Document & { favoriteGames: FavoriteGameInterface[] } || {};
  const newFavoriteGames = [...favoriteGames, game];
  console.log(newFavoriteGames);

  await updateDoc(userRef, {
    favoriteGames: newFavoriteGames,
  });
}

export const removeFavoriteGame = async (user: User, game: FavoriteGameInterface) => {
  const userRef = doc(db, "users", user.uid);

  // Get the current document
  const docSnap = await getDoc(userRef);

  if (docSnap.exists()) {
    // Get the current favoriteGames array
    const favoriteGames = docSnap.data().favoriteGames;

    // Create a new array without the game to remove
    const newFavoriteGames = favoriteGames.filter((favGame: { slug: string; }) => favGame.slug !== game.slug);

    // Update the document
    await updateDoc(userRef, {
      favoriteGames: newFavoriteGames,
    });
  }
}

export const getGameDetails = async (uid: string) => {
  const gamesRef = doc(db, "games", uid);
  const gamesSnap = await getDoc(gamesRef);

  if (gamesSnap.exists()) {
    return gamesSnap.data();
  } else {
    console.log("No such user!");
  }
}
