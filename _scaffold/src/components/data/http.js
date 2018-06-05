import Config from "./../../config/index";
import {RuthHttp} from "../../../src/http/index";


export {HttpForbidden, HttpUnauthorized, HttpNotFound, HttpServerUnavailable} from "../../../src/http";

export default class Http {

    static fetch(url, method, body, headers = {}) {
        return RuthHttp.fetch(url, method, body, headers);
    }

    static fetchApi(urlSuffix, method, body, headers = {}) {
        return RuthHttp.fetch(Config.apiHost + urlSuffix, method, body, headers);
    }

    static upload(fileBase64) {
        return RuthHttp.fetch(Config.apiHost + "/media", "POST", fileBase64);
    }
}

