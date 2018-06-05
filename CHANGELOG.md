# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="0.0.48"></a>
## [0.0.48](https://github.com/nens/efcis-client/compare/v0.0.47...v0.0.48) (2018-06-05)



<a name="0.0.47"></a>
## [0.0.47](https://github.com/nens/efcis-client/compare/v0.0.46...v0.0.47) (2017-10-19)


### Bug Fixes

* **Legend:** (legendMin !== null || legendMin !== ) && legendMax ([a1dac45](https://github.com/nens/efcis-client/commit/a1dac45))



<a name="0.0.46"></a>
## [0.0.46](https://github.com/nens/efcis-client/compare/v0.0.45...v0.0.46) (2017-10-16)



<a name="0.0.45"></a>
## [0.0.45](https://github.com/nens/efcis-client/compare/v0.0.44...v0.0.45) (2017-10-13)


### Bug Fixes

* **Legend:** Legend minimum can now be 0 ([3101510](https://github.com/nens/efcis-client/commit/3101510))



<a name="0.0.44"></a>
## [0.0.44](https://github.com/nens/efcis-client/compare/v0.0.43...v0.0.44) (2017-10-11)



<a name="0.0.43"></a>
## [0.0.43](https://github.com/nens/efcis-client/compare/v0.0.42...v0.0.43) (2017-07-25)


### Bug Fixes

* **KWR Colors:** Reversed order of KRW color pallette. ([e8a18aa](https://github.com/nens/efcis-client/commit/e8a18aa))



<a name="0.0.42"></a>
## [0.0.42](https://github.com/nens/efcis-client/compare/v0.0.41...v0.0.42) (2017-07-07)


### Bug Fixes

* **SelectParameterList:** Fixed a scoping bug where deleting a selected parameter would actually remove the wrong item. Also ran prettier.js on the file. ([3606abe](https://github.com/nens/efcis-client/commit/3606abe))



<a name="0.0.41"></a>
## [0.0.41](https://github.com/nens/efcis-client/compare/v0.0.40...v0.0.41) (2017-06-14)



<a name="0.0.40"></a>
## [0.0.40](https://github.com/nens/efcis-client/compare/v0.0.39...v0.0.40) (2017-06-14)



<a name="0.0.39"></a>
## [0.0.39](https://github.com/nens/efcis-client/compare/v0.0.38...v0.0.39) (2017-06-14)


### Bug Fixes

* **MapApp:** Change color of grey circlemarkers from #ccc to [#989796](https://github.com/nens/efcis-client/issues/989796) as requested by customer. ([13eefc3](https://github.com/nens/efcis-client/commit/13eefc3))



<a name="0.0.38"></a>
## [0.0.38](https://github.com/nens/efcis-client/compare/v0.0.37...v0.0.38) (2017-04-28)


### Bug Fixes

* **KRW Areas:** Some features did not have a color property in KRW Areas GeoJSON. ([4fbdae5](https://github.com/nens/efcis-client/commit/4fbdae5))
* **Map/Chart:** Grey markers now listen to filter selection. Chart color now doesnt reset to white when filter selection is changed. ([d5ed2d0](https://github.com/nens/efcis-client/commit/d5ed2d0))



<a name="0.0.37"></a>
## [0.0.37](https://github.com/nens/efcis-client/compare/v0.0.36...v0.0.37) (2017-04-20)


### Bug Fixes

* **Export:** Add parameter ids and parameter group ids to selection params. ([c84530c](https://github.com/nens/efcis-client/commit/c84530c))
* **KRW Areas:** Fixed dupes in json. ([a88220a](https://github.com/nens/efcis-client/commit/a88220a))
* **Select via Map:** Info popups now enabled on Map selection modal. ([64d9b26](https://github.com/nens/efcis-client/commit/64d9b26))



<a name="0.0.36"></a>
## [0.0.36](https://github.com/nens/efcis-client/compare/v0.0.35...v0.0.36) (2017-04-19)


### Bug Fixes

* **Map:** Changed gray color to be less dark. ([9b94ec2](https://github.com/nens/efcis-client/commit/9b94ec2))
* **MapApp:** Add option to view all measuring locations as grey points. ([e61f597](https://github.com/nens/efcis-client/commit/e61f597))
* **Modals:** Removing modal closing X's for consistency's sake ([1452210](https://github.com/nens/efcis-client/commit/1452210))



<a name="0.0.35"></a>
## [0.0.35](https://github.com/nens/efcis-client/compare/v0.0.34...v0.0.35) (2017-04-18)


### Bug Fixes

* **Linechart:** Colors now picked through Redux, so consistently showing in chart as well as in color picker. ([bb575d6](https://github.com/nens/efcis-client/commit/bb575d6))



<a name="0.0.34"></a>
## [0.0.34](https://github.com/nens/efcis-client/compare/v0.0.33...v0.0.34) (2017-03-17)


### Bug Fixes

* **HTML:** Remove scroll=no in body. ([7cdf197](https://github.com/nens/efcis-client/commit/7cdf197))



<a name="0.0.33"></a>
## [0.0.33](https://github.com/nens/efcis-client/compare/v0.0.32...v0.0.33) (2017-03-14)


### Bug Fixes

* **Linechart:** Right axis now also colored black. ([2d50dc8](https://github.com/nens/efcis-client/commit/2d50dc8))
* **Map:** Legend colors were wrong in inverse mode - fixed now. ([3d3509f](https://github.com/nens/efcis-client/commit/3d3509f))
* **Redux:** Adding GET/POST parameters to each XHR call. ([8bde679](https://github.com/nens/efcis-client/commit/8bde679))
* **Redux:** Table pagination now resets after manipulating selection. Some parseInt() had to be parseFloat()'s. ([a83cf72](https://github.com/nens/efcis-client/commit/a83cf72))
* **SelectLocations:** Adds call to reload table and map data. ([7751d7c](https://github.com/nens/efcis-client/commit/7751d7c))
* **SelectLocationsMeetnet:** Close after select fixed. ([4ab4a05](https://github.com/nens/efcis-client/commit/4ab4a05))
* **Sidebar:** Reset state button now confirmed to work in IE11. ([0caa271](https://github.com/nens/efcis-client/commit/0caa271))
* **TableApp:** Two bugs fixed that were caused by typos... ([9ef881f](https://github.com/nens/efcis-client/commit/9ef881f))



<a name="0.0.32"></a>
## [0.0.32](https://github.com/nens/efcis-client/compare/v0.0.31...v0.0.32) (2017-03-08)



<a name="0.0.31"></a>
## [0.0.31](https://github.com/nens/efcis-client/compare/v0.0.30...v0.0.31) (2017-02-24)



<a name="0.0.30"></a>
## [0.0.30](https://github.com/nens/efcis-client/compare/v0.0.29...v0.0.30) (2017-02-23)



<a name="0.0.29"></a>
## [0.0.29](https://github.com/nens/efcis-client/compare/v0.0.28...v0.0.29) (2017-02-20)



<a name="0.0.28"></a>
## [0.0.28](https://github.com/nens/efcis-client/compare/v0.0.27...v0.0.28) (2017-02-20)



<a name="0.0.27"></a>
## [0.0.27](https://github.com/nens/efcis-client/compare/v0.0.26...v0.0.27) (2017-02-09)



<a name="0.0.26"></a>
## [0.0.26](https://github.com/nens/efcis-client/compare/v0.0.25...v0.0.26) (2017-02-09)



<a name="0.0.25"></a>
## [0.0.25](https://github.com/nens/efcis-client/compare/v0.0.24...v0.0.25) (2017-02-09)



<a name="0.0.24"></a>
## [0.0.24](https://github.com/nens/efcis-client/compare/v0.0.23...v0.0.24) (2017-02-09)



<a name="0.0.23"></a>
## [0.0.23](https://github.com/nens/efcis-client/compare/v0.0.22...v0.0.23) (2017-02-09)



<a name="0.0.22"></a>
## [0.0.22](https://github.com/nens/efcis-client/compare/v0.0.21...v0.0.22) (2017-02-09)



<a name="0.0.21"></a>
## [0.0.21](https://github.com/nens/efcis-client/compare/v0.0.20...v0.0.21) (2017-02-09)



<a name="0.0.20"></a>
## [0.0.20](https://github.com/nens/efcis-client/compare/v0.0.19...v0.0.20) (2017-02-01)



<a name="0.0.19"></a>
## [0.0.19](https://github.com/nens/efcis-client/compare/v0.0.18...v0.0.19) (2017-01-25)



<a name="0.0.18"></a>
## [0.0.18](https://github.com/nens/efcis-client/compare/v0.0.17...v0.0.18) (2017-01-25)



<a name="0.0.17"></a>
## [0.0.17](https://github.com/nens/efcis-client/compare/v0.0.16...v0.0.17) (2017-01-25)



<a name="0.0.16"></a>
## [0.0.16](https://github.com/nens/efcis-client/compare/v0.0.15...v0.0.16) (2017-01-24)



<a name="0.0.15"></a>
## [0.0.15](https://github.com/nens/efcis-client/compare/v0.0.14...v0.0.15) (2017-01-23)



<a name="0.0.14"></a>
## [0.0.14](https://github.com/nens/efcis-client/compare/v0.0.13...v0.0.14) (2017-01-23)



<a name="0.0.13"></a>
## [0.0.13](https://github.com/nens/efcis-client/compare/v0.0.12...v0.0.13) (2017-01-23)



<a name="0.0.12"></a>
## [0.0.12](https://github.com/nens/efcis-client/compare/v0.0.11...v0.0.12) (2017-01-23)



<a name="0.0.11"></a>
## [0.0.11](https://github.com/nens/efcis-client/compare/v0.0.10...v0.0.11) (2017-01-23)



<a name="0.0.10"></a>
## [0.0.10](https://github.com/nens/efcis-client/compare/v0.0.9...v0.0.10) (2017-01-23)



<a name="0.0.9"></a>
## [0.0.9](https://github.com/nens/efcis-client/compare/v0.0.8...v0.0.9) (2017-01-20)



<a name="0.0.8"></a>
## [0.0.8](https://github.com/nens/efcis-client/compare/v0.0.7...v0.0.8) (2017-01-20)



<a name="0.0.7"></a>
## [0.0.7](https://github.com/nens/efcis-client/compare/v0.0.6...v0.0.7) (2017-01-20)



<a name="0.0.6"></a>
## [0.0.6](https://github.com/nens/efcis-client/compare/v0.0.5...v0.0.6) (2017-01-20)



# Change Log
