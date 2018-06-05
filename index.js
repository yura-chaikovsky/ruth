import "./http/fetch";
import {Ruth} from "./core";
import {Routing} from "./routing";
import {i18n} from "./i18n";


// Expose navigation method in Ruth object to be used as a shortcut for templates.
Ruth.navigate = url => () => Routing.navigate(url);

Ruth.addComponent(i18n);
Ruth.initComponents();

export * from "./core";
export * from "./data-source";
export * from "./directive";
export * from "./form";
export * from "./http";
export * from "./i18n";
export * from "./page";
export * from "./routing";
export * from "./tools";



