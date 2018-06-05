import S from "s-js";

import CView from "./view.tpl";
import Ruth from "../../../../src/index";

export default class SrmSelector {

    constructor() {
        S.root(() => {
            this._modal = CView();
            document.body.appendChild(this._modal)
        });

        S(() => {
            if(Ruth.route.state().srmSelector) {
                this.open();
            }else{
                this.close();
            }
        })
    }

    open() {
        this._modal.classList.remove("d-none");
    }

    close() {
        this._modal.classList.add("d-none");
    }

}
