import {Events} from "../events";
import {Ruth} from "../core";

export default class Component {

    $bindEvents(on) {
        Object.keys(this.$options.events).forEach(eventDeclaration => {
            let [, event, label, globalObject] = eventDeclaration.match(/^([\w\-]+)(?: (?:(\$\w+)|(window|document)))?$/) || [];
            let targets;

            if(!event) {
                throw new Error(`Syntax error in event declaration: ${eventDeclaration}`);
            }

            if(label) {
                targets = this.$dom.querySelectorAll(`[data-label='${label.substr(1)}']`);
            } else if(globalObject) {
                targets = [ globalObject === "window"? window : document ];
            } else {
                targets = [ Events ];
            }

            targets.forEach(node => {
                node[on ? "addEventListener" : "removeEventListener"](event, this[this.$options.events[eventDeclaration]]);
            });
        });
    }

    $collectElements() {
        this.$dom.querySelectorAll("[data-label]").forEach(element => this.$elements[element.dataset.label] = element);
    }

    $create() {
        this.$bindEvents(true);
        this.$collectElements();
    }

    $destroy() {
        this.$bindEvents(false);
        this.$destroyChildren();
    }

    $addChild(childInstance) {
        this.$children.push(childInstance);
        return childInstance.$dom;
    }

    $destroyChildren() {
        this.$children.forEach(child => child.$destroy());
    }
}