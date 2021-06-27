/*imports--------------------*/
import { Nav, Main, Footer } from "./components";
import * as state from "./store";
import Navigo from "navigo";
import { capitalize } from "lodash";
import { auth, db } from "./firebase";

//-----------------------------------router fxn-----------------------------------------------------
const router = new Navigo(window.location.origin);

router
  .on({
    ":page": params => render(state[capitalize(params.page)]),
    "/": () => render(state.Home)
  })
  .resolve();

//------------------------------------Render fxn----------------------------------------------------
function render(st = state.Home) {
  document.querySelector("#root").innerHTML = `
  ${Nav(state.Links)}
  ${Main(st)}
  ${Footer()}
  `;

  router.updatePageLinks();
  eventListenerBundler(st);
}

//---------------------------------Event Listener Bundler-------------------------------------------
function eventListenerBundler(st) {
  listenForLogin(st);
    listenForSignup(st);
}

//----------signup-form-------------/
function listenForSignup(st) {
  if (st.view === "Signup") {
    document.querySelector("#signup-form").addEventListener("submit", event => {
      event.preventDefault();
      //convert html elements to Array
      let inputList = Array.from(event.target.elements);
      //remove submit button so it's not included
      inputList.pop();
      const inputs = inputList.map(input => input.value);
      let email = inputs[0];
      let password = inputs[1];
      //create user in firebase
      auth.createUserWithEmailAndPassword(email, password).then(response => {
        //add user to state and database
        addUserToStateAndDB(
          email,
          password
        );
      render(state.Welcome);
      });
      router.navigate("/Welcome")
    });
  }
}

//--------add user to state and db-----------/
function addUserToStateAndDB(
  email,
  password
) {
  state.User.email = email;
  state.User.loggedIn = true;

  db.collection("users").add({
    email: email,
    signedIn: true,
    loggedIn: true
  });
}


//-----------------------------------------login----------------------------------------------------
function listenForLogin(st) {
  if (st.view === "Login") {
    document.querySelector("#login-form").addEventListener("submit", event => {
      event.preventDefault();
      //convert html elements to Array
      let inputList = Array.from(event.target.elements);
      //remove the login button so it's not included
      inputList.pop();
      const inputs = inputList.map(input => input.value);
      let email = inputs[0];
      let password = inputs[1];
      auth.signInWithEmailAndPassword(email, password).then(() => {
        getUserFromDb(email)
          .then(() => render(state.Welcome), router.navigate("/Welcome"))
      });
    });
  }
}

//------------------------------------//
function getUserFromDb(email) {
  return db
    .collection("users")
    .get()
    .then(snapshot =>
      snapshot.docs.forEach(doc => {
        if (email === doc.data().email) {
          let id = doc.id;
          db.collection("users")
            .doc(id)
            .update({ signedIn: true });
          let user = doc.data();
          state.User.email = user.email;
          state.User.loggedIn = true;
        }
      })
    );
}
