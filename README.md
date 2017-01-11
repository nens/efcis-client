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


Release bundle to github
------------------------

Configure [buck-trap](https://www.npmjs.com/package/buck-trap), then run:

```
$ npm run buck-trap
```


Deploy
------

Configure ansible variables, then run:
```
$ ansible-playbook ...
```
