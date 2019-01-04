import {Ruth, Routing, Events} from "./../index";


export class Page {

    constructor(options, scope) {
        this.$mounted = false;
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
        this.$createPage();
    }

    $createPage() {
        this.$root = document.querySelector(this.$options.mountTo);
        console.info('Call $watchRoute from $createPage()', this);
        Events.on("routing", this.$watchRoute, this);
        this.$watchRoute();
    }

    $watchRoute() {
        console.info('Execute $watchRoute', this.constructor.name);
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
            this.$options.mount.call(this);
            this.$root.appendChild(this.$dom);
        }

        this.$bindEvents(true);
        this.$mounted = true;
    }

    $unmountPage() {
        if (this.$options.view) {
            this.$root.removeChild(this.$dom);
        }

        this.$bindEvents(false);
        this.$options.unmount.call(this);
        this.$mounted = false;
        Events.off("routing", this.$watchRoute);
    }

    $bindEvents(on) {
        Object.keys(this.$options.events).forEach(eventDeclaration => {
            const event = eventDeclaration.substring(0, eventDeclaration.indexOf(" "));
            const label = eventDeclaration.substring(eventDeclaration.indexOf(" ") + 1);
            this.$root.querySelectorAll(`[data-label=${label}]`).forEach(node => {
                node[on ? "addEventListener" : "removeEventListener"](event, this[this.$options.events[eventDeclaration]]);
            });
        });
    }

}