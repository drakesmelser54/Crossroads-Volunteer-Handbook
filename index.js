/* eslint-disable prettier/prettier */
/*imports--------------------*/
import { Nav, Main, Footer } from "./components";
import * as state from "./store";
import Navigo from "navigo";
import { capitalize } from "lodash";
import { auth, db } from "./firebase";

//-----------------------------------router fxn-----------------------------------------------------
const router = new Navigo(window.location.origin);

// Mark lessons as completed after navigating to Handbook page
router.hooks({
  after(params) {
    if(params.page === 'Handbook') {
      progress()
      markAllLessonsComplete()
      console.log(state.User);
    }
  }
})

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
  lessonComplete(st, "story", "mission", "do", "who", "volunteering", "policy", "dv");
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


  db.collection("users").add({
    email: email,
    loggedIn: true,
    lessons: {
      story: false,
      mission: false,
      do: false,
      who: false,
      volunteering: false,
      policy: false,
      dv: false
    }
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
          getUserFromDb(email).then(() => {
            render(state.Welcome)
            router.navigate("/Welcome")
          });
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
          state.User.lessons = user.lessons
          console.log(state.User);
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
  state.User.lessons.story = false;
  state.User.lessons.mission = false;
  state.User.lessons.do = false;
  state.User.lessons.who = false;
  state.User.lessons.policy = false;
  state.User.lessons.dv = false;
}

//----------------Our Story Lesson Completion----------------//
//-main complete fxn----//
function lessonComplete(st, lessonName) {
  if (st.view.toLowerCase() === lessonName) {
    document
      .querySelector("#next-button")
      .addEventListener("click", (event) => {
        event.preventDefault();
        lessonDbUpdate(lessonName)
        .then(() => {
          console.log(lessonName, state.User.lessons)
          state.User.lessons[lessonName] = true;
          progress()
          markAllLessonsComplete()
        })
      })
  }
}

function lessonDbUpdate(lessonName) {
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
              lessons: { ...state.User.lessons, [lessonName]: true }
            });
        }
      })
    );
}


//----- Turn all the things green

function markLessonCompleted(lesson) {
  if (!state.User.lessons[lesson]) return;
  let $lesson = document.querySelector(`[data-lesson="${lesson}"]`)
  $lesson.className = "is-completed";
}

function markAllLessonsComplete() {
  Object.keys(state.User.lessons).forEach(markLessonCompleted)
}


//----progress-bar------/
function progress() {
  // turn the user lessons into an array of booleans,
// in this case [true, false, true]
let totalLessonValues = Object.values(state.User.lessons)
// get an array of the true values from the lessons object, in this case [true, true]
let finishedLessons = totalLessonValues.filter(Boolean)
// finally, get the percentage of lessons completed
let percentLessonsCompleted = finishedLessons.length / totalLessonValues.length

// turn our percentage into a number between 1-100
let scroll = percentLessonsCompleted * 100

let progress = document.querySelector('.progress')
progress.style.setProperty('--scroll', scroll + '%');

progressHeader(percentLessonsCompleted);
console.log(state.User);

}

function progressHeader (percentLessonsCompleted) {
  document.getElementById('progress-header')
  .innerHTML = `${Math.round(percentLessonsCompleted * 100)}% of Handbook Complete. Keep it up!`
}
