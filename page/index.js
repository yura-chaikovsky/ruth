import {Ruth, Routing, Events} from "./../index";


export class Page {

    constructor(options, scope) {
        this.$mounted = false;
        this.$elements = {};
        this.$options = Object.assign({
            pathname: /.*/,
            mountTo: "body",
            events: {},
            view: null,
            init: () => {},
            mount: () => {},
            unmount: () => {}
        }, options);

        Object.keys(scope).forEach(key => {
            if (typeof scope[key] === "function" && scope[key].name !== "data") {
                scope[key] = scope[key].bind(this);
            }
        });

        Object.assign(this, scope);
        requestAnimationFrame(this.$createPage.bind(this));
    }

    $createPage() {
        console.info("Call $watchRoute from $createPage()", this);
        Events.on("routing", this.$watchRoute, this);
    }

    $watchRoute() {
        console.info("Execute $watchRoute", this.constructor.name);
        const routeMatches = Routing.state.pathname.match(this.$options.pathname);

        if (routeMatches && !this.$mounted) {
            this.$options.routeMatches = routeMatches;
            Promise.all([this.$options.init.call(this)]).then(this.$mountPage.bind(this));
        } else if (!routeMatches && this.$mounted) {
            this.$unmountPage();
        }
    }

    $mountPage() {
        if (this.$options.view) {
            this.$dom = this.$options.view.call(this, Ruth);
            this.$collectElements();
            this.$root = document.querySelector(this.$options.mountTo);
            this.$root.appendChild(this.$dom);
            this.$options.mount.call(this);
        }

        this.$bindEvents(true);
        this.$mounted = true;
    }

    $unmountPage() {
        this.$options.unmount.call(this);
        this.$bindEvents(false);
        if (this.$options.view) {
            this.$root.removeChild(this.$dom);
            this.$dom = null;
            this.$elements = {};
        }
        this.$mounted = false;
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