import { validateSession, keyckloakSilentSSO } from "./keycloak-validator";
import "./routes";
import "./views/HeaderUserView";
import {
    deleteCookie,
    getCookie,
    inIframe,
    redirectToCollection,
    setOrGetcaseIDSessionStorage,
} from "./utils";
import events from "@girder/core/events";

console.log("Loaded dsa-keycloak-javascript-adapter!");

const currentUser = getCookie("girderToken");

if (!currentUser) {
    keyckloakSilentSSO();
} else {
    const keycloakSessionId = getCookie("KeycloakSessionId");
    const keycloakSessionUsername = getCookie("KeycloakSessionUsername");
    validateSession(keycloakSessionId, keycloakSessionUsername);
}

if (inIframe()) {
    setOrGetcaseIDSessionStorage();

    if (currentUser !== undefined) {
        redirectToCollection();
    }
}
