import {Page} from "ruth";
import SView from "./index.tpl";


export const HomePage = new Page(
    {
        pathname: /^\/$/,
        mountTo: "body",
        view: SView,

        events: {
            "click searchButton": "getItems"
        },

        init() {
            this._buildSearchQuery();
        }

    },

    {
        getItems() {
            return [1, 2, 3];
        },

        _buildSearchQuery() {

        },

        _filterSearchResults() {

        }
    }
);