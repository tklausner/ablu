import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { getUser, createUser } from "./util"

const auth = getAuth();

export async function login(email, password) {
  let authenticated = false;

  await signInWithEmailAndPassword(auth, email, password)
    .then(async (res) => {
      console.log("LOGGED IN")
      let user = await getUser("email", email);
      console.log("USER ", user)
      authenticated = true;
    })
    .catch(async (e) => {
      console.log(e);
      // let newUser = await createUser(email, password);
      console.log("Invalid Password")
      authenticated = false;
    });
  return authenticated;
}

export async function signup(email, password) {
  let authenticated = false;
  await createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      authenticated = true;
      console.log("user created");
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      authenticated = false;
      console.log("user failed to create new account");
      // ..
    });
  return authenticated;
}



