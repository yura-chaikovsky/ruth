import {Ruth} from "./../index";


export class Directive {

    constructor(options, rootScope) {
        if(Ruth[options.name]){
            throw new Error(`Directive '${options.name}' already registered.`);
        }

        Ruth[options.name] = function ({scope = {}}) {
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
        this.$options = Object.assign({
            name: "",
            events: {},
            view: null,
            init: () => {
            }
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
        this.$options.init.call(this);
        this.$dom = this.$options.view(this, Ruth)
        this.$bindEvents(true);
    }

    $bindEvents(on) {
        Object.keys(this.$options.events).forEach(eventDeclaration => {
            const event = eventDeclaration.substring(0, eventDeclaration.indexOf(" "));
            const label = eventDeclaration.substring(eventDeclaration.indexOf(" ") + 1);
            this.$dom.querySelectorAll(`[data-label=${label}]`).forEach(node => {
                node[on ? "addEventListener" : "removeEventListener"](event, this[this.$options.events[eventDeclaration]]);
            });
        });
    }

}