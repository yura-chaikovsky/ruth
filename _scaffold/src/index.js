import "./index.html";
import "./index.scss";

import S from "s-js";

import OnlineStatus from "./components/online-status";

import Home from "./components/home";
import StoragePage from "./components/storage";


window.addEventListener("DOMContentLoaded", () => {

    // Ruth.dataSource.retrieveRemote()
    //     .then(() => {
    //         Ruth.boot();
    //     });
    //
    // // setInterval(()=>{
    // //     Ruth.dataSource.retrieveRemote();
    // // }, 5000);
    //
    // S.root(() => {
    //     S.on(Ruth.dataSource.pullRuntime("serverAvailable", true), () => {
    //         console.warn("==> Server OK: ", Ruth.dataSource.pullRuntime("serverAvailable", true)());
    //     }, undefined, true);
    //
    //     S.on(Ruth.dataSource.pullRuntime("remoteSyncing", false), () => {
    //         let state = Ruth.dataSource.pullRuntime("remoteSyncing", false)();
    //         console.info("==> Syncing status: ", state, " " + measure("Remote Syncing", state));
    //     }, undefined, true);
    //
    // });


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