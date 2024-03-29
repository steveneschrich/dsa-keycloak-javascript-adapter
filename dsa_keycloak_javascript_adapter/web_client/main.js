import { validateSession, keyckloakSilentSSO } from "./keycloak-validator";
import "./routes";
import "./views/HeaderUserView";
import {
    getCookie,
    inIframe,
    redirectToCollection,
    setOrGetcaseIDSessionStorage,
} from "./utils";

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
    if (!window.frameElement) {
        setOrGetcaseIDSessionStorage();
        if (currentUser !== undefined) {
            redirectToCollection();
        }
    }
}
