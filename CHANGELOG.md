# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.4.0](https://github.com/stumpam/ngx-date-input/compare/v1.3.0...v1.4.0) (2020-03-06)


### Features

* **lib:** use custom padStart fn ([2e2446c](https://github.com/stumpam/ngx-date-input/commit/2e2446cff4eb480874f71350b80f1903dc1f6b2f))

## [1.3.0](https://github.com/stumpam/ngx-date-input/compare/v1.2.0...v1.3.0) (2020-03-05)


### Features

* **demo:** update demos ([255009b](https://github.com/stumpam/ngx-date-input/commit/255009b0c4002e8c20e91cee04a8c1b059979866))
* **lib:** make other moth's days highlitable if possible ([7ff2805](https://github.com/stumpam/ngx-date-input/commit/7ff280524d43af1596e16668ca3dd5e92668fcbb)), closes [#11](https://github.com/stumpam/ngx-date-input/issues/11)
* **lib:** min and max dates can be Date objects ([ad26f8b](https://github.com/stumpam/ngx-date-input/commit/ad26f8b005d755430cd5ec2b55eba1cc88d3dbcf))


### Bug Fixes

* **lib&:** monthly view checks current year ([d87c20d](https://github.com/stumpam/ngx-date-input/commit/d87c20d05afe45875ce0484e25a03513fcd6fd51)), closes [#10](https://github.com/stumpam/ngx-date-input/issues/10)

## [1.2.0](https://github.com/stumpam/ngx-date-input/compare/v1.1.3...v1.2.0) (2020-03-02)


### Features

* **demo:** add ngx-formly to demo ([95668e1](https://github.com/stumpam/ngx-date-input/commit/95668e199f340b181885d6d1a9294b008424ca60))
* **lib:** bind attributes directly to input element ([8596f3a](https://github.com/stumpam/ngx-date-input/commit/8596f3ab1031f0e3baf4e7bf80ee8f30c1372f1f))

### [1.1.3](https://github.com/stumpam/ngx-date-input/compare/v1.1.2...v1.1.3) (2020-03-01)


### Bug Fixes

* **lib:** iso date output with leading zero ([50be2b2](https://github.com/stumpam/ngx-date-input/commit/50be2b2b5ea55f1752e40ab0e52e37f15fcab0d6)), closes [#9](https://github.com/stumpam/ngx-date-input/issues/9)

### [1.1.2](https://github.com/stumpam/ngx-date-input/compare/v1.1.1...v1.1.2) (2020-02-26)


### Bug Fixes

* **lib:** fix setHours of null date ([2163208](https://github.com/stumpam/ngx-date-input/commit/2163208d223b836100a48d4e91b64b733d6003c7)), closes [#8](https://github.com/stumpam/ngx-date-input/issues/8)

### [1.1.1](https://github.com/stumpam/ngx-date-input/compare/v1.1.0...v1.1.1) (2020-02-21)


### Bug Fixes

* **lib:** emitted ISO date was smaller by 1 ([1f1f620](https://github.com/stumpam/ngx-date-input/commit/1f1f620947f752690c82b736f6ffe6ea0d9f439d)), closes [#6](https://github.com/stumpam/ngx-date-input/issues/6)
* **lib:** handle correctly input in ISO string ([33ccf01](https://github.com/stumpam/ngx-date-input/commit/33ccf0121ba4e16ea7be4030371bbe2596cf7cb6)), closes [#7](https://github.com/stumpam/ngx-date-input/issues/7)
* **lib:** handle correctly null date in calendar popup ([6df66b1](https://github.com/stumpam/ngx-date-input/commit/6df66b17fb401584f8bf6dfaac428841b67ce8e9)), closes [#4](https://github.com/stumpam/ngx-date-input/issues/4)
* **lib:** make lib pattern letter moment.js compliant ([821a293](https://github.com/stumpam/ngx-date-input/commit/821a293bb45aaff10b9b104df053c022fbf8b9e5)), closes [#3](https://github.com/stumpam/ngx-date-input/issues/3)

## [1.1.0](https://github.com/stumpam/ngx-date-input/compare/v1.0.0...v1.1.0) (2020-02-20)


### Features

* **lib:** add disabled state ([9b44b3a](https://github.com/stumpam/ngx-date-input/commit/9b44b3a830b782adf9c3be4a366c6ee6fa21f675)), closes [#1](https://github.com/stumpam/ngx-date-input/issues/1)


### Bug Fixes

* **lib:** divider is not entered when section is empty ([62e8447](https://github.com/stumpam/ngx-date-input/commit/62e844737eaefe7053dff774625b26398b46d310)), closes [#2](https://github.com/stumpam/ngx-date-input/issues/2)

## 1.0.0 (2020-02-19)


### Features

* **app:** adapt demo app to calendar ([25aeaa8](https://github.com/stumpam/ngx-date-input/commit/25aeaa82b01663e830221a2691779711516fcd3d))
* **app:** updates to demo app ([73596f2](https://github.com/stumpam/ngx-date-input/commit/73596f2be4e5bb187d941a02defccdd9549b8760))
* **lib:** add calendar component ([c29b8cc](https://github.com/stumpam/ngx-date-input/commit/c29b8cc7c01150d5f93f879b33eb5c0375f672e2))
* **lib:** add img url ([ec585b4](https://github.com/stumpam/ngx-date-input/commit/ec585b41389ae1f7df762d3fa538a41203750ea4))
* **lib:** add input mask for enter ([7387f2a](https://github.com/stumpam/ngx-date-input/commit/7387f2af77b1c3de125032e88d72b17210dc9fdb))
* **lib:** add keybindings ([f0e7d08](https://github.com/stumpam/ngx-date-input/commit/f0e7d082f86da71dfe207bcf238b1f653f2bea0e))
* **lib:** add ngx-date-input library ([31e3f7c](https://github.com/stumpam/ngx-date-input/commit/31e3f7c52e9702b6497ef7328a6007239f68ac76))
* **lib:** add year and month views ([fce0cfb](https://github.com/stumpam/ngx-date-input/commit/fce0cfb5d4abef62f2ba060519746a556c7c30a3))
* **lib:** parse date format ([062beea](https://github.com/stumpam/ngx-date-input/commit/062beea80a50af63de0e98abcc9b8f31dba8a839))
* **lib:** update calendar ([6676f8f](https://github.com/stumpam/ngx-date-input/commit/6676f8f1f9c3565372ed1059d89537dd576edd0d))
* **lib:** updates for edge cases ([eb6603b](https://github.com/stumpam/ngx-date-input/commit/eb6603b54f951d5164b6d823181899fa0629e81f))


### Bug Fixes

* **lib:** expose DateInputComponent ([edb9399](https://github.com/stumpam/ngx-date-input/commit/edb93994153f08c3e0693d4a0ddad192ab6230ca))
