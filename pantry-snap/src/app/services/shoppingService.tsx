// src/services/shoppingService.ts
import { collection, getDocs, query, setDoc, updateDoc, deleteDoc, doc, DocumentData, QueryDocumentSnapshot, where } from 'firebase/firestore';
import { db } from '../config/Firebase';

interface ShoppingListItem {
  id: string;
  name: string;
  quantity: number;
  category: string; 
}

export const fetchShoppingListItems = async (userId: string): Promise<ShoppingListItem[]> => {
  const items = query(collection(db, 'shopping-list'), where('userId', '==', userId));
  const docs = await getDocs(items);
  const shoppingList = docs.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      quantity: data.quantity,
      category: data.category,
    } as ShoppingListItem;
  });
  return shoppingList;
};

export const addShoppingListItem = async (newItem: string, newQuantity: number, category: string, userId: string): Promise<void> => {
  const itemDoc = doc(db, 'shopping-list', newItem); 
  await setDoc(itemDoc, { name: newItem, quantity: newQuantity, category: category, userId: userId });
};

export const editShoppingListItem = async (id: string, newName: string, newQuantity: number, newCategory: string, userId: string): Promise<void> => {
  const itemDoc = doc(db, 'shopping-list', id);
  await updateDoc(itemDoc, { name: newName, quantity: newQuantity, category: newCategory, userId: userId });
};

export const deleteShoppingListItem = async (id: string, userId: string): Promise<void> => {
  const itemDoc = doc(db, 'shopping-list', id);
  await deleteDoc(itemDoc);
};
