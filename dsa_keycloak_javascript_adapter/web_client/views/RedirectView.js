import $ from "jquery";
import View from "@girder/core/views/View";
import { CONFIG } from "../config";

const redirect = View.extend({
    initialize(settings) {
        parent.postMessage(location.href, "*");
        $(location).prop("href", `${window.location.origin}/#`);
    },

    render() {},
});

export default redirect;
