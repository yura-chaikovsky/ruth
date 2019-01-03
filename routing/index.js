class RoutingMachine {

    constructor() {

        window.addEventListener('popstate', event => {
            this.mainStateStorage.go(event.state);
        });

        this.mainStateStorage = new StateStorage();
        this.ancillaryStateStorage = new StateStorage();

        this.navigate(window.location.pathname, true);
    }

    get state() {
        return this.mainStateStorage.signalState;
    }

    get ancillaryState() {
        return this.ancillaryStateStorage.signalState;
    }

    navigate(newState, replace = false) {
        if (typeof newState === "string") {
            newState = {
                pathname: newState
            };
        }
        newState.stateIndex = this.mainStateStorage.push(newState);
        window.history[replace ? "replaceState" : "pushState"](newState, "", newState.pathname);
    }

    ancillaryNavigate(newState, replace = false) {
        newState.stateIndex = this.ancillaryStateStorage.push(newState);
        window.history[replace ? "replaceState" : "pushState"](newState, "");
    }
}

export class StateStorage {
    constructor() {
        this.stateStack = [];
        this.currentStateIndex = 0;
    }

    push(state) {
        this.stateStack.splice(this.currentStateIndex + 1);
        this.currentStateIndex = this.stateStack.push(state) - 1;
        return this.currentStateIndex;
    }

    go(state) {
        this.currentStateIndex = state.stateIndex;
        this.stateStack[this.currentStateIndex] = state;
    }
}

export const Routing = new RoutingMachine();