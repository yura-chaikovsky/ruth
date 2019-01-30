import {Ruth, Routing, Events} from "./../index";
import Component from "./../component";


export class Page extends Component {

    constructor(options, scope) {
        super();

        this.$children = [];
        this.$elements = {};
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
        requestAnimationFrame(this.$create.bind(this));
    }

    $create() {
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
        this.$dom = this.$options.view.call(this, Ruth);
        super.$create();
        this.$root = document.querySelector(this.$options.mountTo);
        this.$root.appendChild(this.$dom);
        this.$options.mount.call(this);

        this.$mounted = true;
    }

    $unmountPage() {
        this.$options.unmount.call(this);
        this.$elements = {};
        super.$destroy();
        this.$root.removeChild(this.$dom);
        this.$dom = null;
        this.$root = null;

        this.$mounted = false;
    }

}