const RuthComponentsMap = new Map();
const RuthPagesMap = new Map();


export const Ruth = {

    pages: {},
    directives: {},

    addComponent(component) {
        if (component.name in RuthComponentsMap) {
            throw new Error(`Component '${component.name}' already registered.`);
        } else {
            RuthComponentsMap.set(component.name, component);
        }
    },

    addPage(definition) {
        if (definition.controller.pathname in RuthPagesMap) {
            throw new Error(`Page '${definition.title} (${definition.controller.pathname})' already registered.`);
        } else {
            RuthPagesMap.set(definition.controller.pathname, definition);
        }
    },

    initComponents() {
        RuthComponentsMap.forEach((component, name) => {
            Object.defineProperty(this, name, {
                value: new (component),
                writable: false,
                enumerable: true,
                configurable: false
            });
        });
    },

    initPages() {
        RuthPagesMap.forEach((page, pathname) => {
            Object.defineProperty(this.pages, pathname, {
                value: new (page.controller),
                writable: false,
                enumerable: true,
                configurable: false
            });
        });
    },

    boot() {
        this.initComponents();
        this.initPages();
    }
};