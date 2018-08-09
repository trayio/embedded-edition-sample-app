## Tray.io Embedded Edition sample application

In this repo is a sample webapp which runs on top of the Tray.io Embedded Edition API - this is an application which simply allows you to create new external users linked to your Tray.io partner account, and allow them to create and configure the public Workflow Templates that exist on your Tray.io partner account.

## Important concepts in Tray.io Embedded Edition

There are a few key things we should define to understand how to integrate Embedded Edition.

#### System components:
* Your Partner Account
* Your Partner Accounts Templates
* Your Partner Accounts External Users
* Your External Users Workflows

#### Integration details:

* [Embedded Edition GraphQL API](https://tray.io/docs/article/partner-api-intro)
* [Using the Tray.io configurator and authentication UIs from within your application](https://tray.io/docs/article/embedded-external-configuration)
* Authenticating your external users

## Setting up and running the sample application

To set up and run the sample application first you must install the packages:

```
npm install
```

You must also ensure that a few variables are available in your environment:

```
MASTER_TOKEN=<your partner token>
PARTNER=<your partner name (used to enable custom stylesheets in the Tray.io configurator)>
HTTPS=<true | false depending if you want to run local app with SSL>
```

You can then run the application server using:

```
npm run api
```

And in a seperate session run the web server using:

```
npm start
```
