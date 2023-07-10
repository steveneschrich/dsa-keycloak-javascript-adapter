import $ from "jquery";
import View from "@girder/core/views/View";
import { CONFIG } from "../config";

const redirect = View.extend({
    initialize(settings) {
        parent.postMessage(location.href, "*");
        $(location).prop("href", `${CONFIG.DSA_HOST}/#`);
    },

    render() {},
});

export default redirect;
