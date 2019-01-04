import "./http/fetch";
import {Ruth} from "./core";
import {Routing} from "./routing";
import {Tools} from "./tools";

// Expose navigation method in Ruth object to be used as a shortcut for templates.
window.ruthNavigate = function(event) {event.preventDefault(); Routing.navigate(event.currentTarget.pathname)};


// Expose helper function in Ruth object
Object.assign(Ruth, Tools);

export * from "./core";
export * from "./directive";
export * from "./form";
export * from "./http";
export * from "./i18n";
export * from "./events";
export * from "./page";
export * from "./routing";
export * from "./tools";

export default Ruth;