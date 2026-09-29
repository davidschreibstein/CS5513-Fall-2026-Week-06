// Import the firebase app instance
import { db } from './firebase'; // load from firebase.js in same dir
import { collection, getDocs, query, where, documentId } from 'firebase/firestore';

export async function getSortedPostsData() {
    const myCollectionRef = collection(db, "posts");
    const querySnapshot = await getDocs(myCollectionRef);
    const jsonObj = querySnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}))
    jsonObj.sort(function (a, b) {
        return a.title.localeCompare(b.title);
      });
    
      // Keep only the fields the listing needs; id must be a string for URLs
      return jsonObj.map((item) => {
        return {
          id: item.id.toString(),
          title: item.title,
          date: item.date,
          tags: item.tags || [], // Fallback to [] if a post has no tags
        };
      });
    }

export async function getAllPostIds() {
    const myCollectionRef = collection(db, "posts");
    const querySnapshot = await getDocs(myCollectionRef);
    const jsonObj = querySnapshot.docs.map((doc) => ({id: doc.id}))
    return jsonObj.map((item) => {
        return {
          params: {
            id: item.id.toString(),
          },
        };
      });
}

export async function getPostData(id) {
    const myCollectionRef = collection(db, "posts");
    const searchQuery = query(
        myCollectionRef,
        where(
            documentId(), 
            "==", 
            id
        )
    );
    const querySnapshot = await getDocs(searchQuery);
    const jsonObj = querySnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
    if (jsonObj.length === 0) {
        return {
            id: id,
            title: 'Not found',
            date: '',
            contentHtml: 'Not found',
        };
    }
else{
    return jsonObj[0];
}
}