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
    // console.log(`${doc.id} => ${doc.data().last}`);
  });
  return querySnapshot.docs;
}

export async function getGameState(id) {
  const { data } = await get(where("id", "==", id), "games");
  return data;
}

export async function getUser(last) {
  const { data } = await get(where("last", "==", last), "users");
  return data;
}

export async function getTiles() {
  const querySnapshot = await getDocs(collection(db, "tiles"));
  let tiles = new Map();
  querySnapshot.forEach((doc) => {
    tiles.set(doc.data().id, doc.data().bids)
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
  const { data } = await get(where("id", "==", id), "tiles");
  return data;
}

async function get(filter, path) {
  let q = query(collection(db, path), filter);
  let _id = ""
  let data = null
  try {
    const querySnapshot = await getDocs(q);
    _id = querySnapshot.docs[0].id
    data = querySnapshot.docs[0].data()
  } catch (e) {
    console.error("Error getting document: ", e);
  }
  return { _id: _id, data: data }
}

export async function updateTile(id, newBid) {
  // get tile data
  const { _id, data } = await get(where("id", "==", id), "tiles")

  let bids = data.bids;
  let docRef = doc(db, "tiles", _id);

  // update tile
  bids.push(newBid);
  console.log(bids);

  try {
    await updateDoc(docRef, "bids", bids);
    console.log("Updated tile document")
  } catch (e) {
    console.error("Error getting document: ", e);
  }
}

export async function updatePlayer(last, bidID) {
  // get player data
  const { _id, data } = await get(where("last", "==", last), "users");

  let bids = data.bids;
  let docRef = doc(db, "users", _id);

  // update tile
  bids[bidID] = true

  try {
    await updateDoc(docRef, {
      "bids": bids,
      "balance": data.balance - 1
    });
    console.log("Updated player document")
  } catch (e) {
    console.error("Error getting document: ", e);
  }
}

export async function updateGameState(stateID, pot, lub, memKey, memVal) {
  // get player data
  const { _id, data } = await get(where("id", "==", stateID), "games");
  let docRef = doc(db, "games", _id);

  let memMap = data.memMap;
  memMap[memKey] = memVal;

  try {
    await updateDoc(docRef, {
      "pot": pot,
      "lub": lub,
      "memMap": memMap,
    });
    console.log("Updated game state document")
  } catch (e) {
    console.error("Error getting document: ", e);
  }
}

export async function resetGame(stateID) {
  const { _id } = await get(where("id", "==", stateID), "games");

  let docRef = doc(db, "games", _id);

  try {
    await updateDoc(docRef, {
      "pot": 0,
      "lub": -1,
      "heap": []
    });
    console.log("Reset game state")
  } catch (e) {
    console.error("Error getting document: ", e);
  }
}
