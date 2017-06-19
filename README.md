[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/if-diff)

# \<if-diff\>

\<if-diff\> is an extension of Polymer's dom-if element that allows comparison between two operands.

Because Polymer's dom-if can only bind to simple boolean properties, it is somewhat clunky when using it in conjunction with multi-select components like paper-tabs.

<!--
```
<custom-element-demo>
  <template>
    <link rel="import" href="if-diff.html">
    <link rel="import" href="../polymer/lib/elements/dom-bind.html">
    <dom-bind>
        <template>
            LHS: <input type="textbox" value="{{lhs::input}}"> RHS: <input type="textbox" value="{{rhs::input}}" >
            <if-diff if lhs="[[lhs]]" equals rhs="[[rhs]]" result="{{EqualsResult}}">
            <template>
                <div>LHS == RHS</div>
            </template>
            </if-diff>

            <if-diff if lhs="[[lhs]]" not_equals rhs="[[rhs]]" result="{{NotEqualsResult}}">
            <template>
                <div>LHS != RHS</div>
            </template>
            </if-diff>

            LHS Equals RHS: <span>[[EqualsResult]]</span><br>
            LHS Doesn't equal RHS: <span>[[NotEqualsResult]]</span>
        </template>
    </dom-bind>
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

## Installation

Install the component using [Bower](http://bower.io/):
```sh
$ bower install if-diff --save
```

## Viewing Your Element

```
$ polymer serve
Open http://127.0.0.1:8081/components/if-diff
```

## Running Tests

```
$ polymer test
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.
