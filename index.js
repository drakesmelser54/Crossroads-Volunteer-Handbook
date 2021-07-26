/* eslint-disable prettier/prettier */
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
    ":page": (params) => render(state[capitalize(params.page)]),
    "/": () => render(state.Home),
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
  storyComplete(st);
  logoutListener(st);
}

//----------signup-form-------------/
function listenForSignup(st) {
  if (st.view === "Signup") {
    document
      .querySelector("#signup-form")
      .addEventListener("submit", (event) => {
        event.preventDefault();
        //convert html elements to Array
        let inputList = Array.from(event.target.elements);
        //remove submit button so it's not included
        inputList.pop();
        const inputs = inputList.map((input) => input.value);
        let email = inputs[0];
        let password = inputs[1];
        //create user in firebase
        auth
          .createUserWithEmailAndPassword(email, password)
          .then(() => {
            //add user to state and database
            addUserToStateAndDB(email);
            render(state.Welcome);
          });
        router.navigate("/Welcome");
      });
  }
}

//--------add user to state and db-----------/
function addUserToStateAndDB(email) {
  state.User.email = email;
  state.User.loggedIn = true;
  state.User.lessons[0] = false;

  db.collection("users").add({
    email: email,
    loggedIn: true,
    lessons: { story: false}
  });
}

//-----------------------------------------login----------------------------------------------------
function listenForLogin(st) {
  if (st.view === "Login") {
    document
      .querySelector("#login-form")
      .addEventListener("submit", (event) => {
        event.preventDefault();
        //convert html elements to Array
        let inputList = Array.from(event.target.elements);
        //remove the login button so it's not included
        inputList.pop();
        const inputs = inputList.map((input) => input.value);
        let email = inputs[0];
        let password = inputs[1];
        auth.signInWithEmailAndPassword(email, password).then(() => {
          getUserFromDb(email).then(
            () => render(state.Welcome),
            router.navigate("/Welcome")
          );
        });
      });
  }
}


//--------get user from db-------//
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
            .update({ loggedIn: true });
          let user = doc.data();
          state.User.email = user.email;
          state.User.loggedIn = true;
        }
      })
    );
}

//------------------------log out-------------------------//
//-----log-out main fxn-----//
function logoutListener(user) {
  //select log-out a tag in nav//
  document.querySelector("#log-out").addEventListener("click", event => {
    //condition if user is logged-in//
    if (user.loggedIn) {
      event.preventDefault();
      //log-out fxn//
      auth.signOut().then(() => {
        //logOutUserInDb(user.email);
        resetUserInState();
        render(state.Home);
        router.navigate("/Home");
      });
    }
  });
}


//---------reset user in state-------//
function resetUserInState() {
  state.User.email = "";
  state.User.loggedIn = false;
  state.User.lessons[0] = false;
}

//----------------Our Story Lesson Completion----------------//
//-main complete fxn----//
function storyComplete(st) {
  if (st.view === "Story") {
    document
      .querySelector("#next-button")
      .addEventListener("click", (event) => {
        event.preventDefault();
        storyDbUpdate()
        .then(() => {
        state.User.lessons[0] = true;
        })
      })
  }
}

function storyDbUpdate()
 {
  return db
    .collection("users")
    .get()
    .then(snapshot =>
      snapshot.docs.forEach(doc => {
        if (state.User.email === doc.data().email) {
          let id = doc.id;
          db.collection("users")
            .doc(id)
            .update({
              lessons: { story: true }
            });
        }
      })
    );
}


// function turnGreen(st) {
//  if (st.view === "Handbook")
//   return db
//     .collection("users")
//     .get()
//     .then(snapshot => snapshot.docs.forEach(doc => {
//       if (state.User.email === doc.data()) {
//         let id = doc.id;
//         db.collection("users")
//         .doc(id.lessons)
//         .forEach(lesson => {
//           if (lesson) return
//           document.querySelector(`#${lesson}`).className = "is-completed"
//         })
//       }
//     })
//     )}

// Object.entries(state.User.lessons).forEach(([key, value]) => {
//   if (value) {
//     const $lesson = document.querySelector(`#[data-lesson="${key}"]`)
//     $lesson.className = 'is-completed'
//   }
// })



//----------------incomplete functions---------------------------------------------//
//----------------Our Story Lesson Completion----------------//
//when a user clicks next after finishing a lesson module, mark it as complete in state and db and show user that they have completed said module with a graphic


//---------log-out in Db-------//

//fxn not working properly, not logging people out of the db, doesn't really matter for this project//
//function logOutUserInDb(email) {
//   if (state.User.loggedIn) {
//     db.collection("users")
//       .get()
//       .then(snapshot =>
//         snapshot.docs.forEach(doc => {
//           if (email === doc.data().email) {
//             let id = doc.id;
//             db.collection("users")
//               .doc(id)
//               .update({ loggedIn: false });
//           }
//         })
//       );
//   }
// }
