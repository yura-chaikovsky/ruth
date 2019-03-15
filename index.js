import "./http/fetch";
import {Ruth} from "./core";
import {Routing} from "./routing";
import {Tools} from "./tools";

Ruth.addComponent(Routing);
// Expose navigation method in Ruth object to be used as a shortcut for templates.
window.ruthNavigate = function(event) {event.preventDefault(); Routing.navigate(event.currentTarget.pathname)};

// Expose helper function in Ruth object
Object.assign(Ruth, Tools);

export * from "./core";
export * from "./events";
export * from "./form";
export * from "./http";
export * from "./i18n";
export * from "./page";
export * from "./directive";
export * from "./routing";
export * from "./tools";

export default Ruth;