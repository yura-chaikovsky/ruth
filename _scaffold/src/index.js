import "./index.html";
import "./index.scss";


import OnlineStatus from "./components/online-status";

import Home from "./components/home";
import StoragePage from "./components/storage";


window.addEventListener("DOMContentLoaded", () => {

});

function measure(measureName, state) {
    if (state) {
        performance.mark(`${measureName}-start`);
        return "";
    } else if(performance.getEntriesByName(`${measureName}-start`).length){
        performance.mark(`${measureName}-end`);

        performance.measure(
            measureName,
            `${measureName}-start`,
            `${measureName}-end`
        );

        return `${performance.getEntriesByName(measureName)[0].duration >> 0}ms`;
    }

}