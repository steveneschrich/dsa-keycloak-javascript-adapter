# DSA-Keycloak Javascript Adapter Plugin

Girder plugin for Keycloak-javascript adapter using the Authorization Broker Microservice, also, with the ability to being redirected to an image when using `cbioportal`
 
# How to install the plugin?

For installing the plugin you will need to run the following command
```bash
pip install dsa_keycloak_javascript_adapter
```
# Development
## Before installing and running the plugin:
Be sure to have the following technologies installed with the required version:

 - NodeJS `12.22.x`
	 - You can install `nvm ` for easy node version management
 - Girder
 - HistomicsUI
	 - It needs to be installed as a plugin
	 - You'll need to follow the installation guide in the [plugin's repository](https://github.com/DigitalSlideArchive/HistomicsUI#installation)
 - Python
 - PIP
 - Docker
	 - With the CLI commands enabled (for running `docker` and `docker-compose`)

## Local Development:
For local development you'll need to follow some steps:

 **1.** Make sure you have the right `node` version installed locally, we recommend to use `nvm` for managing `node` versions:
```bash
> nvm use 12.22.12
```
**2.** In other terminal, in the root folder, run `docker`, it will create a container running `mongodb` : 
we recommend to use the docker from the [DSA repository](https://github.com/DigitalSlideArchive/digital_slide_archive/tree/master/devops/dsa) but you'll need to do some additional configuration first:

**2.1** Comment the `girder`  container configuration from the `docker-compose.yml` file located in `devops/dsa/` directory (everything from line [4 to 89](https://github.com/DigitalSlideArchive/digital_slide_archive/blob/master/devops/dsa/docker-compose.yml#L4-L89))

**2.2** Uncomment lines [107 and 108](https://github.com/DigitalSlideArchive/digital_slide_archive/blob/master/devops/dsa/docker-compose.yml#L107-L108) from the `docker-compose.yml` to allow access to the database from outside the docker network, also you can include the `external_links` attribute, everything should look like this at the end:
```
external_links:
	- mongo
ports:
	- "27017"
```

**2.3** After updating the configuration you will need to run the following command:
```bash
> DSA_USER=$(id -u):$(id -g) docker-compose up
```

**3.** Once the container is running, in other terminal run:
```bash
> girder build --dev
```
**4.** Then, finally, serve the plugin:
```bash
> GIRDER_MONGO_URI='mongodb://localhost:51467/girder' girder serve --dev
```
* *You'll need to specify the URL where docker is running, for that use* 
```bash
docker ps
```
* *And take the external port that the mongodb container is exposing*

If you want to watch the changes when you are coding use the following command:
- *For ubuntu and MAC users*:
```bash
> sudo ls dsa_keycloak_javascript_adapter/web_client/**/*.js | entr -r -s 'girder build --dev --no-reinstall && GIRDER_MONGO_URI='mongodb://localhost:61784/girder' girder serve --dev'
```
> *This command will listen to any change that you do in the web_client .js files and build & serve again the project without re-installing node modules.*

# Deployment
**0.** Go to the the container bash and go to the `opt` folder:
```bash
docker exec -it <container name> /bin/bash
cd ..
```

**1.** Clone the repository into the container:
```bash
git clone https://github.com/steveneschrich/dsa-keycloak-javascript-adapter.git
```

**2.** Setup the `dsa_keycloak_javascript_adapter/web_client/.env` file with the following environment variables (remember to change the variables with your own environment data):
```
DSA_HOST=http://localhost:8080
AUTHORIZATION_BROKER_HOST=http://localhost:8085
KEYCLOAK_HOST=http://localhost:8083
KEYCLOAK_REALM=myrealm
KEYCLOAK_CLIENTID=cbioportal_api
```

**3.** Build the plugin using `girder`:
```bash
girder build --mode=production
```

**4.** Install the plugin:
```bash
cd dsa-keycloak-javascript-adapter
pip install .
```

## Deployment notes:
1. You'll need to have a OpenID client in `keycloak`, for example if you are using `cbioportal` you'll need to have 2 clients one with SAML configuration named `cbioportal` and another with OpenID configuration named `cbioportal_api`
2. You'll need to have a admin user in both `dsa` and `keycloak` (with realm manager role)