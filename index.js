/*imports--------------------*/
import { Nav, Main, Footer } from "./components";
import * as state from "./store";
import Navigo from "navigo";
import { capitalize } from "lodash";

/*render fxn-----------------*/
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
}
/*router fxn--------------------*/
const router = new Navigo(window.location.origin);

router.on("/", () => render(state.Home)).resolve();

router.on({
  "/": () => render(state.Home),
  ":page": params => {
    let page = capitalize(params.page);
    render(state[page]);
  }})

