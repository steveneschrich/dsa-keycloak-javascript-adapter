const path = require("path");
const webpack = require("webpack");
const dotenv = require("dotenv").config({
    path: path.join(__dirname, ".env"),
});

module.exports = function (config) {
    config.plugins.push(
        new webpack.DefinePlugin({
            "process.env.AUTHORIZATION_BROKER_HOST": JSON.stringify(
                dotenv.parsed.AUTHORIZATION_BROKER_HOST
            ),
            "process.env.DSA_HOST": JSON.stringify(dotenv.parsed.DSA_HOST),
            "process.env.KEYCLOAK_HOST": JSON.stringify(
                dotenv.parsed.KEYCLOAK_HOST
            ),
            "process.env.KEYCLOAK_REALM": JSON.stringify(
                dotenv.parsed.KEYCLOAK_REALM
            ),
            "process.env.KEYCLOAK_CLIENTID": JSON.stringify(
                dotenv.parsed.KEYCLOAK_CLIENTID
            ),
            "process.env.KEYCLOAK_REALM": JSON.stringify(
                dotenv.parsed.KEYCLOAK_REALM
            ),
        })
    );
    return config;
};
