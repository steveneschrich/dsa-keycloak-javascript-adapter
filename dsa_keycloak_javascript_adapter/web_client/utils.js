import { restRequest } from "@girder/core/rest";
import { CONFIG } from "./config";

export function inIframe() {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

export function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
}

export function redirectToCollection() {
    const caseId = sessionStorage.getItem("CBIOPORTAL_CASE_ID");

    if (caseId !== "") {
        let redirectUrl = `${CONFIG.DSA_HOST}/#collectionNotFound`;
        restRequest({
            method: "GET",
            url: `folder?text=${caseId}&limit=50&sort=lowerName&sortdir=1`,
            headers: {
                Accept: "application/json",
            },
        }).done((resp) => {
            const foundFolder = resp.find(
                ({ name, parentCollection }) =>
                    name === caseId && parentCollection === "collection"
            );

            if (foundFolder) {
                restRequest({
                    method: "GET",
                    url: `item?folderId=${foundFolder._id}&limit=50&sort=lowerName&sortdir=1`,
                    headers: {
                        Accept: "application/json",
                    },
                }).done((resp) => {
                    if (resp.length > 1) {
                        redirectUrl = `${CONFIG.DSA_HOST}/histomics#?image=${resp[0]._id}`;
                    }

                    $(location).prop("href", redirectUrl);
                });
            } else {
                $(location).prop("href", redirectUrl);
            }
        });
    }
}

export function setCookie(name, value, expiration) {
    const expires = `expires=${expiration}`;
    document.cookie = `${name}=${value};${expires}; path=/`;
}

export function deleteCookie(name) {
    document.cookie = name + "=; Max-Age=-99999999;";
}

export function setOrGetcaseIDSessionStorage() {
    const sessionCaseId = sessionStorage.getItem("CBIOPORTAL_CASE_ID");
    const searchParametersFromParentUrl = window.location.href;
    const caseId = searchParametersFromParentUrl.split("byPatientID/")[1];

    if (caseId !== undefined && caseId !== sessionCaseId) {
        sessionStorage.setItem("CBIOPORTAL_CASE_ID", caseId);
    }
}
