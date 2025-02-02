import { signOut } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, db } from "@/firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { collection, Timestamp, doc, getDocs, setDoc, query, where } from "firebase/firestore";

export const register = async (name, email, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  const userDoc = {
    name: name,
    email: email,
    createdAt: Timestamp.now()
  }

  const docRef = doc(collection(db, "users"), user.uid);
  await setDoc(docRef, userDoc)

  try {
    await AsyncStorage.setItem("user", JSON.stringify(userDoc));
    console.log("User data stored locally:", userDoc);
  } catch (storageError) {
    console.error("Error storing user data locally:", storageError);
  }
}

export const login = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  const usersCollection = collection(db, "users");
  const q = query(usersCollection, where("email", "==", user.email));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const userData = querySnapshot.docs[0].data();
    console.log("User Data from Firestore:", userData);
    await AsyncStorage.setItem("user", JSON.stringify(userData));
  } else {
    console.log("No user found in Firestore with this email.");
  }
}

export const isUserLoggedIn = async () => {
  try {
    const user = await AsyncStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error checking user login status:", error);
    return null;
  }
};

export const getUser = async () => {
  const user = await AsyncStorage.getItem("user");
  return JSON.parse(user);
};

export const logoutUser = async () => {
  try {
    await AsyncStorage.removeItem("user");

    await signOut(auth);

    console.log("User successfully logged out.");
  } catch (error) {
    console.error("Error logging out the user:", error);
  }
};

export const isAdmin = async () => {
  const user = await getUser();
  return user.isAdmin;
};
