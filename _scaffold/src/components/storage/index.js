import S from "s-js";
import {Page} from "ruth";
import SView from "./index.tpl";


export const StoragePage = new Page(
    {
        pathname: /^\/_storage$/,
        mountTo: "body",
        view: SView,
        events: {
            "click pre": "sayHi"
        },
        init() {
            this.storageSize((window.localStorage.vault.length / 1024).toFixed(2));
            this.storageDump(JSON.stringify(JSON.parse(window.localStorage.vault), null, 4));
        }
    },

    {
        storageSize: S.data(),
        storageDump: S.data(),

        refresh () {
            this.$options.init.call(this);
        },
        sayHi () {
            alert("Hi!", this.$options.pathname);
        }
    }
);
