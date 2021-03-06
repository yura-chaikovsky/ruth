import {Ruth, Routing, Events} from "./../index";
import Component from "./../component";


export class Page extends Component {

    constructor(options, scope) {
        super();

        this.$children = [];
        this.$elements = {};
        this.$groups = {};
        this.$mounted = false;
        this.$options = Object.assign({
            pathname: /.*/,
            mountTo: "body",
            events: {},
            view: () => document.createElement("div"),
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
        Events.on("routing", this.$watchRoute, this);
    }

    $watchRoute() {
        const routeMatches = Routing.state.pathname.match(this.$options.pathname);

        if (routeMatches && !this.$mounted) {
            this.$options.routeMatches = routeMatches;
            Promise.all([this.$options.init.call(this)]).then(this.$mountPage.bind(this));
        } else if (!routeMatches && this.$mounted) {
            this.$unmountPage();
        }
    }

    $mountPage() {
        this.$dom = this.$options.view.call(this, Ruth);
        super.$create();
        this.$root = document.querySelector(this.$options.mountTo);
        this.$root.appendChild(this.$dom);
        //hack to force re-render
        window.getComputedStyle(this.$dom).opacity;
        window.scrollTo(0, 0);
        this.$dom.classList.add("mounted");
        this.$options.mount.call(this);

        this.$mounted = true;
    }

    $unmountPage() {
        this.$options.unmount.call(this);
        this.$dom.parentNode.removeChild(this.$dom);
        super.$destroy();

        this.$mounted = false;
    }

    $updatePage() {
        const _oldDom = this.$dom;

        this.$destroy();
        this.$dom = this.$options.view.call(this, Ruth);
        this.$create();
        _oldDom.replaceWith(this.$dom);
        this.$dom.classList.add("mounted");
    }

}