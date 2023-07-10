import { wrap } from "@girder/core/utilities/PluginUtils";
import LayoutHeaderUserView from "@girder/core/views/layout/HeaderUserView";
import _ from "underscore";
import axios from "axios";
import { deleteCookie, getCookie } from "../utils";
import events from "@girder/core/events";
import { logoutFromKeycloak } from "../keycloak-validator";

wrap(LayoutHeaderUserView, "initialize", function (initialize) {
    initialize.apply(this, _.rest(arguments));
});

wrap(LayoutHeaderUserView, "render", function (render) {
    render.call(this);
    $(".g-logout").remove();
    $(
        `<a class="g-logout-keycloak"><i class="icon-logout"></i>Log out</a>`
    ).insertAfter(this.$(".g-my-settings"));

    $(".g-logout-keycloak").on("click", function () {
        const keycloakSessionId = getCookie("KeycloakSessionId");
        logoutFromKeycloak(keycloakSessionId);
    });
});
