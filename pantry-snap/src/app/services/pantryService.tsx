import { collection, getDocs, query, setDoc, updateDoc, deleteDoc, doc, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '../config/Firebase';

interface PantryItem {
  id: string;
  name: string;
  quantity: number;
}

export const fetchPantryItems = async (): Promise<PantryItem[]> => {
  const items = query(collection(db, 'pantry'));
  const docs = await getDocs(items);
  const pantryList = docs.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      quantity: data.quantity,
    } as PantryItem;
  });
  return pantryList;
};

export const addPantryItem = async (newItem: string, newQuantity: number): Promise<void> => {
  const itemDoc = doc(db, 'pantry', newItem);
  await setDoc(itemDoc, { name: newItem, quantity: newQuantity });
};

export const editPantryItem = async (id: string, newName: string, newQuantity: number): Promise<void> => {
  const itemDoc = doc(db, 'pantry', id);
  await updateDoc(itemDoc, { name: newName, quantity: newQuantity });
};

export const deletePantryItem = async (id: string): Promise<void> => {
  const itemDoc = doc(db, 'pantry', id);
  await deleteDoc(itemDoc);
};
