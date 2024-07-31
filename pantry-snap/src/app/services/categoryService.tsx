import { collection, getDocs, query, setDoc, deleteDoc, doc, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '../config/Firebase';

interface Category {
  id: string;
  name: string;
}

export const fetchCategories = async (): Promise<Category[]> => {
  const items = query(collection(db, 'categories'));
  const docs = await getDocs(items);
  const categoryList = docs.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
    } as Category;
  });
  return categoryList;
};

export const addCategory = async (newCategory: string): Promise<void> => {
  const categoryDoc = doc(db, 'categories', newCategory);
  await setDoc(categoryDoc, { name: newCategory });
};

export const deleteCategory = async (id: string): Promise<void> => {
  const categoryDoc = doc(db, 'categories', id);
  await deleteDoc(categoryDoc);
};
