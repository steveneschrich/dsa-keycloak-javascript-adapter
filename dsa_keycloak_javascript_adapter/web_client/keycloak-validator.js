import Keycloak from "keycloak-js";

import events from "@girder/core/events";

import { setCurrentToken, setCurrentUser } from "@girder/core/auth";
import { UserModel } from "@girder/core/models";
import axios from "axios";
import {
    deleteCookie,
    inIframe,
    redirectToCollection,
    setCookie,
} from "./utils";
import { CONFIG } from "./config";

export function keyckloakSilentSSO() {
    const keycloakConfig = {
        url: CONFIG.KEYCLOAK_HOST,
        realm: CONFIG.KEYCLOAK_REALM,
        clientId: CONFIG.KEYCLOAK_CLIENTID,
    };
    const keycloak = new Keycloak(keycloakConfig);

    const keycloakInitOptions = {
        onLoad: "login-required",
        checkLoginIframe: false,
        enableLogging: true,
        redirectUri: `${window.location.origin}/#redirect/`,
    };

    keycloak
        .init(keycloakInitOptions)
        .then((authenticated) => {
            const name = keycloak.idTokenParsed.name.split(" ");
            const userData = {
                login: `${keycloak.idTokenParsed.email.split("@")[0]}`,
                keycloakSessionId: `${keycloak.sessionId}`,
                keycloakUsername: `${keycloak.idTokenParsed.preferred_username}`,
                email: `${keycloak.idTokenParsed.email}`,
                firstName: `${name[0]}`,
                lastName: `${name[1]}`,
            };

            const config = {
                method: "POST",
                url: `${CONFIG.AUTHORIZATION_BROKER_HOST}/authorization`,
                headers: {
                    "Content-Type": "application/json",
                },
                data: userData,
            };

            axios.request(config).then((response) => {
                const newUser = new UserModel(response.data.dsaAuthObject.user);
                setCurrentUser(newUser);
                setCurrentToken(response.data.dsaAuthObject.authToken.token);

                setCookie(
                    "girderToken",
                    response.data.dsaAuthObject.authToken.token,
                    keycloak.idTokenParsed.exp
                );
                setCookie("KeycloakSessionId", userData.keycloakSessionId);
                setCookie("KeycloakSessionUsername", userData.keycloakUsername);

                events.trigger("g:login", newUser);

                if (inIframe()) {
                    redirectToCollection();
                }
            });
        })
        .catch(function (e) {
            console.log("failed to initialize", e);
        });
}

function logoutEvent() {
    deleteCookie("KeycloakSession");
    deleteCookie("girderToken");

    events.trigger("g:logout");
    location.reload();
}

export function logoutFromKeycloak(keycloakSessionId, logoutCallback) {
    let data = JSON.stringify({
        keycloakSessionId: keycloakSessionId,
    });

    let config = {
        method: "POST",
        url: `${CONFIG.AUTHORIZATION_BROKER_HOST}/logout`,
        headers: {
            "Content-Type": "application/json",
        },
        data: data,
    };

    axios
        .request(config)
        .then(() => {
            logoutEvent();
        })
        .catch((error) => {
            console.log(error);
        });
}

export function validateSession(keycloakSessionId, keycloakSessionUsername) {
    let data = JSON.stringify({
        keycloakUsername: keycloakSessionUsername,
        keycloakSessionId: keycloakSessionId,
    });

    let config = {
        method: "POST",
        url: `${CONFIG.AUTHORIZATION_BROKER_HOST}/isSessionActive`,
        headers: {
            "Content-Type": "application/json",
        },
        data: data,
    };

    axios.request(config).catch((error) => {
        if (error.response.status === 401) {
            logoutEvent();
        }
        console.log(error);
    });
}
