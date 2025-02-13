import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { app } from "./firebase";

export const db = getFirestore(app);

export const saveUserToFirestore = async (user: any) => {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(userRef);

  if (!docSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      createdAt: new Date().toISOString(),
    });
  }
};
