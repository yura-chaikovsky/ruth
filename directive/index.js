import {Events, Ruth} from "./../index";


export class Directive {

    constructor(options, rootScope) {
        if(Ruth.directives[options.name]){
            throw new Error(`Directive '${options.name}' already registered.`);
        }

        Ruth.directives[options.name.toLowerCase()] = function ({scope = {}}) {
            const directiveScope = Object.assign({}, rootScope);
            Object.keys(scope).forEach(key => {
                directiveScope[key] = scope[key];
            });

            return (new DirectiveConstructor(options, directiveScope)).$dom;
        };

        return Ruth[options.name];
    }
}

class DirectiveConstructor {

    constructor(options, scope) {
        this.$elements = {};
        this.$options = Object.assign({
            name: "",
            events: {},
            view: null,
            init: () => { }
        }, options);

        Object.keys(scope).forEach(key => {
            if (typeof scope[key] === "function") {
                scope[key] = scope[key].bind(this);
            }
        });

        Object.assign(this, scope);
        this.$createDirective();
    }

    $createDirective() {
        this.$dom = this.$options.view.call(this, Ruth);
        this.$collectElements();
        this.$bindEvents(true);
        this.$options.init.call(this);
    }

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
        this.$dom.querySelectorAll("[data-label]").forEach(element => this.$elements[element.dataset.label] = element)
    }
}