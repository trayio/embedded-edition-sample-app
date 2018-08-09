## Tray.io Embedded Edition sample application

In this repo is a sample webapp which runs on top of the Tray.io Embedded Edition API - this is an application which simply allows you to create new external users linked to your Tray.io partner account, and allow them to create and configure the public Workflow Templates that exist on your Tray.io partner account.

## Important concepts in Tray.io Embedded Edition

There are a few key things we should define to understand how to integrate Embedded Edition.

#### System components:
##### Your Partner Account
This is the Tray.io account we will provide for the purposes of setting up your integration to Tray.io. You wil have to create any workflow templates that you would like your users to use on this account. When you sign up an external user to Tray.io through your system, they will be considered to be a user linked to this accounts team.
##### Your Partner Accounts Templates
Your Templates will be available to list and edit through the Tray.io GraphQL API for usage in your application.
##### Your Partner Accounts External Users
In order for your users to take advantage of the Tray.io platform, they must have a Tray account. We have set up a system to provision Tray.io accounts which will be linked to the team of your Partner user.
##### Your External Users Workflows
When an external user creates a workflow from a template, a copy of that template will be created in that accounts workflow list. The workflow must then be configured and enabled with your users SaaS authentications for the services used within that template.

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
