import {Ruth, i18n} from "ruth";
import Config from "./../../../config";
import ua_uk from "./uk-ua";

const dictionary = {
    "ua-uk": ua_uk
};

Ruth.i18n = i18n.set(dictionary, Config.i18n);

export default Ruth.i18n;
