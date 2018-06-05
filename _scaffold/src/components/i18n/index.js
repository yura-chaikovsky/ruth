import Config from "./../../config/index";
import ua_uk from "./uk-ua/index";

const Dictionary = {
    "ua-uk": ua_uk
};

export default function (key, ...params) {
    if(typeof Dictionary[Config.i18n][key] === "undefined"){
        throw new Error(`Internationalization for key '${key}' not found in language '${Config.i18n}'.`);
    }

    return typeof Dictionary[Config.i18n][key] === "string"?
        Dictionary[Config.i18n][key]
        : Dictionary[Config.i18n][key].apply(null, params);
}