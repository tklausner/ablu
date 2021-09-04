import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "./firebase";
import { collection, addDoc, getDocs, updateDoc, query, where, doc } from "firebase/firestore";


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

export async function getTiles() {
  const querySnapshot = await getDocs(collection(db, "tiles"));
  let tiles = []
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data().id}`);
    tiles.push({
      id: doc.data().id,
      bids: doc.data().bids
    })
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
        id: doc.data().id,
        bids: doc.data().bids
      }
    });
  } catch (e) {
    console.error("Error getting document: ", e);
  }
}

async function queryID(id) {
  let q = query(collection(db, "tiles"), where("id", "==", id));
  const docs = await getDocs(q);
  docs.forEach((doc) => {
    return doc.id
  });
}


export async function updateTile(id, bid) {
  let _id = queryID(id);
  try {
    await updateDoc(collection(db, "tiles/" + _id), {
      bids: ["hi"]
    });


  } catch (e) {
    console.error("Error updating document: ", e);
  }

}
