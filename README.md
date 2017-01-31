EFCIS-CLIENT
============

Motivation
----------

- Why a separate repository/project?

Because we gain the following advantages:

 - Hot Module Reloading for quick iteration during development
 - No need to install full EFCIS stack to build/release front-end
 - Redux integration
 - redux-persist with localForage to persist to IndexedDB
 - ES6 modules



Install dependencies
--------------------

Run this:

```
$ yarn install
```

Development
-----------

The following will start a hot module reloading devserver on port 3000:

```
$ sso_user=yourusername sso_pass=yourpassword npm start
```


Build bundle
------------

```
$ npm run build
```


Release bundle to Github
------------------------

Configure [buck-trap](https://www.npmjs.com/package/buck-trap).

Buck-trap is installed when running yarn install. The only thing you need to do
is to copy `deploy/auth.json.example` to `deploy/auth.json`, and edit that file,
so that it contains your [Github Personal Access Token](https://github.com/settings/tokens)
with the proper scopes selected.

Then run:
```
$ npm run release
```


Deploy
------

Configure ansible variables, then run:
```
$ ansible-playbook ...
```






Todo
----

- Switch react-router [from hashHistory to browserHistory](https://github.com/ReactTraining/react-router/blob/master/docs/guides/Histories.md) and configure nginx to support this.
