import {Ruth} from "./../index";
import Component from "./../component";


export class Directive {

    constructor(options, rootScope) {
        if(Ruth.directives[options.name]){
            throw new Error(`Directive '${options.name}' already registered.`);
        }

        Ruth.directives[options.name.toLowerCase()] = function (scope = {}) {
            const directiveScope = Object.assign({}, rootScope, JSON.parse(JSON.stringify(rootScope)), scope);
            return new DirectiveConstructor(options, directiveScope);
        };

        return Ruth[options.name];
    }
}

class DirectiveConstructor extends Component {

    constructor(options, scope) {
        super();

        this.$children = [];
        this.$elements = {};
        this.$groups = {};
        this.$options = Object.assign({
            name: "",
            events: {},
            view: null,
            mount: () => { },
            unmount: () => { }
        }, options);

        Object.keys(scope).forEach(key => {
            if (typeof scope[key] === "function") {
                scope[key] = scope[key].bind(this);
            }
        });

        Object.assign(this, scope);
        this.$create();
    }

    $create() {
        this.$dom = this.$options.view.call(this, Ruth);
        super.$create();
        this.$options.mount.call(this);
    }


    $update() {
        const _oldDom = this.$dom;

        super.$destroy();
        this.$dom = this.$options.view.call(this, Ruth);
        super.$create();
        _oldDom.replaceWith(this.$dom);
    }

    $destroy() {
        this.$options.unmount.call(this);
        this.$dom.parentNode.removeChild(this.$dom);
        super.$destroy();
    }

}