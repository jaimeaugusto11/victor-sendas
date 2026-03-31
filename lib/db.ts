import { 
  collection, 
  query, 
  where, 
  getDocs, 
  updateDoc, 
  doc, 
  serverTimestamp,
  addDoc,
  deleteDoc
} from "firebase/firestore";
import { db } from "./firebase";

export interface Guest {
  id: string;
  phone: string;
  name: string;
  status: 'pending' | 'attending' | 'declined';
  confirmedAt?: any;
}

export const checkGuestByPhone = async (phone: string): Promise<Guest | null> => {
  const q = query(collection(db, "guests"), where("phone", "==", phone));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) return null;
  
  const guestDoc = querySnapshot.docs[0];
  return { id: guestDoc.id, ...guestDoc.data() } as Guest;
};

export const updateRSVP = async (id: string, status: 'attending' | 'declined', message?: string) => {
  const guestRef = doc(db, "guests", id);
  await updateDoc(guestRef, {
    status,
    confirmedAt: serverTimestamp(),
    message: message || ""
  });
};

export const getAllGuests = async () => {
    const q = collection(db, "guests");
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Guest));
};

export const addGuest = async (name: string, phone: string) => {
    return await addDoc(collection(db, "guests"), {
        name,
        phone,
        status: 'pending'
    });
};

export const deleteGuest = async (id: string) => {
    const guestRef = doc(db, "guests", id);
    await deleteDoc(guestRef);
};
