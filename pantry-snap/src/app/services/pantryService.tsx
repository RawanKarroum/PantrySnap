import { collection, getDocs, query, setDoc, updateDoc, deleteDoc, doc, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '../config/Firebase';

interface PantryItem {
  id: string;
  name: string;
  quantity: number;
  category: string; 
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
      category: data.category, 
    } as PantryItem;
  });
  return pantryList;
};

export const addPantryItem = async (newItem: string, newQuantity: number, category: string): Promise<void> => {
  const itemDoc = doc(db, 'pantry', newItem);
  await setDoc(itemDoc, { name: newItem, quantity: newQuantity, category: category }); 
};

export const editPantryItem = async (id: string, newName: string, newQuantity: number, newCategory: string): Promise<void> => {
  const itemDoc = doc(db, 'pantry', id);
  await updateDoc(itemDoc, { name: newName, quantity: newQuantity, category: newCategory }); 
};

export const deletePantryItem = async (id: string): Promise<void> => {
  const itemDoc = doc(db, 'pantry', id);
  await deleteDoc(itemDoc);
};
