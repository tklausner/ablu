import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "./firebase";
import { collection, addDoc, getDocs, updateDoc, query, where, doc, getDoc } from "firebase/firestore";


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function create_user(user) {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      _id: user.last,
      first: user.first,
      last: user.last,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export async function getUsers() {
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data()}`);
  });
}

export async function getUserBids(last) {
  let q = query(collection(db, "users"), where("last", "==", last));
  try {
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs[0].data().bids
  } catch (e) {
    console.error("Error getting document: ", e);
  }
}

export async function getTiles() {
  const querySnapshot = await getDocs(collection(db, "tiles"));
  let tiles = new Map()
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data().id}`);
    tiles[doc.data().id] = doc.data().bids
  });
  return tiles
}

export async function createTiles() {
  for (let i = 0; i < 100; i++) {
    try {
      const docRef = await addDoc(collection(db, "tiles"), {
        id: i,
        bids: []
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
}

export async function getTile(id) {
  let q = query(collection(db, "tiles"), where("id", "==", id));
  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data().id}`);
      return {
        _id: doc.id,
        id: doc.data().id,
        bids: doc.data().bids
      }
    });
  } catch (e) {
    console.error("Error getting document: ", e);
  }
}

export async function queryID(id) {
  let q = query(collection(db, "tiles"), where("id", "==", id));
  let _id = ""
  try {
    const docs = await getDocs(q);
    docs.forEach((doc) => {
      console.log(`${doc.id} = ${doc.data().id}`);
      _id = doc.id
    });
  } catch (e) {
    console.error("Error getting document: ", e);
  }
  return _id
}


export async function updateTile(id, newBid) {
  // get tile data
  let _id = await queryID(id)
  let docRef = doc(db, "tiles", _id);
  const querySnapshot = await getDoc(docRef);
  console.log(querySnapshot.data())

  let bids = querySnapshot.data().bids;

  // update tile
  bids.push(newBid);
  console.log(bids);

  try {
    await updateDoc(docRef, "bids", bids);
    console.log("Updated document")
  } catch (e) {
    console.error("Error getting document: ", e);
  }
}

