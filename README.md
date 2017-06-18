[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/if-diff)

# \<if-diff\>

if-diff is an extension of Polymer&#39;s dom-if element that allows comparison between two operands.

Because Polymer's dom-if can only bind to simple boolean properties, it is somewhat clunky when using it in conjunction with multi-select components like paper-tabs.

<!--
```
<custom-element-demo>
  <template>
    <link rel="import" href="if-diff.html">

  </template>
</custom-element-demo>
```
-->
```html
<if-diff if lhs="[[lhs]]" equals rhs="[[rhs]]">
<template>
    <div>LHS == RHS</div>
</template>
</if-diff>
```

## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. Then run `polymer serve` to serve your element locally.

## Viewing Your Element

```
$ polymer serve
```

## Running Tests

```
$ polymer test
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.
