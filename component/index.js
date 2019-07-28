import {Events} from "../events";

export default class Component {

    $bindEvents(on) {
        Object.keys(this.$options.events).forEach(eventDeclaration => {
            let [, event, elementLabel, groupLabel, globalObject] = eventDeclaration.match(/^([\w\-\/]+)(?: (?:(\$\w+)|(\$\$\w+)|(window|document)))?$/) || [];
            let targets;

            if (!event) {
                throw new Error(`Syntax error in event declaration: ${eventDeclaration}`);
            }

            if (elementLabel) {
                targets = this.$dom.querySelectorAll(`[data-label='${elementLabel.substr(1)}']`);
            } else if (groupLabel) {
                targets = this.$dom.querySelectorAll(`[data-group-label='${groupLabel.substr(2)}']`);
            } else if (globalObject) {
                targets = [globalObject === "window" ? window : document];
            } else {
                targets = [Events];
            }

            targets.forEach(node => {
                node[on ? "addEventListener" : "removeEventListener"](event, this[this.$options.events[eventDeclaration]]);
            });
        });
    }

    $emit(eventName, detail) {
        this.$dom.dispatchEvent(new CustomEvent(eventName, {bubbles: true, detail: {component: this, ...detail}}));
    }

    $collectElements() {
        this.$dom.querySelectorAll("[data-label]").forEach(element => this.$elements[element.dataset.label] = element);
        this.$dom.querySelectorAll("[data-group-label]").forEach(element => (this.$groups[element.dataset.groupLabel] = this.$groups[element.dataset.groupLabel] || []).push(element));
    }

    $create() {
        this.$bindEvents(true);
        this.$collectElements();
    }

    $destroy() {
        this.$bindEvents(false);
        this.$children.forEach(child => this.$destroyChild(child));
        this.$dom = null;
        this.$elements = {};
        this.$groups = {};
    }

    $addChild(childInstance) {
        this.$children.push(childInstance);
        return childInstance.$dom;
    }

    $destroyChild(childInstance) {
        this.$children.some((child, index) => {
            if(child === childInstance) {
                child.$destroy();
                this.$children.splice(index, 1);
                return true;
            }
        });
    }
}
