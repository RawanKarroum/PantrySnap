import { collection, getDocs, query, setDoc, deleteDoc, doc, DocumentData, QueryDocumentSnapshot, where } from 'firebase/firestore';
import { db } from '../config/Firebase';

interface Category {
  id: string;
  name: string;
  userId: string;
}

export const fetchCategories = async (userId: string): Promise<Category[]> => {
  const items = query(collection(db, 'categories'), where('userId', '==', userId));
  const docs = await getDocs(items);
  const categoryList = docs.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      userId: data.userId, 
    } as Category;
  });
  return categoryList;
};

export const addCategory = async (newCategory: string, userId: string): Promise<void> => {
  const categoryDoc = doc(collection(db, 'categories'));
  await setDoc(categoryDoc, { name: newCategory, userId: userId });
};

export const deleteCategory = async (id: string): Promise<void> => {
  const categoryDoc = doc(db, 'categories', id);
  await deleteDoc(categoryDoc);
};
