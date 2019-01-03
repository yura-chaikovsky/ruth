import {Directive} from "ruth";
import SView from "./index.tpl";
import "./index.scss";


export const OnlineStatus = new Directive(
    {
        name: "OnlineStatus",
        view: SView,
        events: {
            "mousemove root": "logMove"
        },
        init() {
            console.log("Online Status Initialized");
        }
    },
    {
        status: window.navigator.onLine? "online" : "offline",

        logMove(event) {
            console.log(event.clientX + "," + event.clientY);
        },

        logClick() {
            console.log("Clicked!");
        }
    }
);