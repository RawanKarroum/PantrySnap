import { collection, getDocs, query, setDoc, updateDoc, deleteDoc, doc, DocumentData, QueryDocumentSnapshot, where } from 'firebase/firestore';
import { db } from '../config/Firebase';

interface PantryItem {
  id: string;
  name: string;
  quantity: number;
  category: string; 
}

export const fetchPantryItems = async (userId: string): Promise<PantryItem[]> => {
  const items = query(collection(db, 'pantry'), where('userId', '==', userId));
  const docs = await getDocs(items);
  const pantryList = docs.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      quantity: data.quantity,
      category: data.category,
    } as PantryItem;
  });
  return pantryList;
};

export const addPantryItem = async (newItem: string, newQuantity: number, category: string, userId: string): Promise<void> => {
  const itemDoc = doc(collection(db, 'pantry'));
  await setDoc(itemDoc, { name: newItem, quantity: newQuantity, category: category, userId: userId });
};

export const editPantryItem = async (id: string, newName: string, newQuantity: number, newCategory: string, userId: string): Promise<void> => {
  const itemDoc = doc(db, 'pantry', id);
  await updateDoc(itemDoc, { name: newName, quantity: newQuantity, category: newCategory, userId: userId });
};

export const deletePantryItem = async (id: string, userId: string): Promise<void> => {
  const itemDoc = doc(db, 'pantry', id);
  await deleteDoc(itemDoc);
};
