[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/if-diff)

<a href="https://nodei.co/npm/if-diff/"><img src="https://nodei.co/npm/if-diff.png"></a>

<img src="https://badgen.net/bundlephobia/minzip/if-diff">

# \<if-diff\>

\<if-diff\> is an alternative to Polymer's [dom-if](https://polymer-library.polymer-project.org/3.0/docs/devguide/templates#dom-if) element that allows comparison between two operands, as well as progressive enhancement.  See [if-else](https://github.com/matthewp/if-else) for another data-centric alternative.

if-diff allows the server to display content that should be initially displayed, then adjusts what is displayed as conditions in the browser change.

For example, suppose today is Monday.  The server could generate the syntax below:


```html
<!-- Framework-neutral psuedo code:  Assume some framework / library sets property "lhs" based on -lhs attribute --> 
<if-diff if -lhs=dayOfWeek equals rhs="Monday" tag="manicMonday" m="1"></if-diff>
...
<if-diff if -lhs=dayOfWeek equals rhs="Tuesday" tag="rubyTuesday"></if-diff>
...
<div data-manic-monday="1">
  <div>I wish it was Sunday</div>
</div>
<div data-ruby-tuesday="0">
  <template>
    <div>Who could hang a name on you</div>
  </template>
</div>
...
```

Generally, as we will see, a data-* value of "1" should be interpreted as "matches", so assuming your css is consistent with that interpretation, the user will immediately see the desired text "I wish it was Sunday" before a single byte of JS is downloaded.  Since the text for Tuesday is not yet applicable, embedding the content inside a template tag will allow the browser to ignore whatever is inside until needed.  Only if the day changes would we need to display Tuesday.  At that point, the template needs to be cloned (and discarded).  So to fill in the details:

Rules: 

1.  The "tag" attribute refers to a data-* attribute / dataset.* property.  The case is based on the property name.
2.  Only downstream sibling elements are checked for the data-* attribute.  This is to encourage unidirectional data flow, and keeping related things physically close.
3.  Speaking of which, the optional  m attribute indicates the maximum number of elements that are getting affected by the *if-diff* tag.  Placing the *if-diff* element right above the elements it affects, and specifying "m" accurately, will improve performance and help reduce greenhouse emissions.
4.  *if-diff* sets the data-* attribute to "1" when the condition is true, "-1" if not.  It is up to the application's css styling to interpret how this should display.
5.  If *if-diff* encounters a data-* value of "0", this signifies there's exactly one template inside the DOM element, which needs cloning before changing to "1".  It will leave the template untouched if the condition is not satisfied.
6.  The "if" attribute / property is actually an active participant in the logical evaluation.  If that attribute / property is false, then the evaluation will be false no matter what.  And as the demo below indicates, not_equals is also supported.

<!--
```
<custom-element-demo>
  <template>
    <div>
      <style>
        [data-equals="-1"]{
          display: none;
        }
        [data-not-equals="-1"]{
          display: none;
        }
      </style>
      <h3>Basic if-diff demo.</h3>
      <div> 
        Type in the text boxes, and see what happens when value in the left textbox matches or doesn't match the right textbox.
      </div>
      LHS: <input type="textbox"> 
      <p-d on="input" to="if-diff" prop="lhs" m="2"></p-d>
      RHS: <input type="textbox">
      <p-d on="input" to="if-diff" prop="rhs" m="2"></p-d>
      <if-diff if  equals tag="equals"></if-diff>
      <p-d on="value-changed" to="[data-lhs-equals-rhs]" prop="innerText"></p-d>
      <div data-equals="0">
          <template>
            <div>LHS == RHS</div>
          </template>
      </div>

      <if-diff if not_equals tag="notEquals"></if-diff>
      <p-d on="value-changed" to="[data-lhs-not-equals-rhs]" prop="innerText"></p-d>
      <div data-not-equals="0">
          <template>
              <div>LHS != RHS</div>
          </template>       
      </div>

      

      LHS Equals RHS: <span data-lhs-equals-rhs></span><br>
      LHS Doesn't equal RHS: <span data-lhs-not-equals-rhs></span>
      <!-- ========================  Script Refs ========================== -->
      <!-- Polyfills Needed for retro browsers -->
      <script src="https://cdn.jsdelivr.net/npm/@webcomponents/webcomponentsjs/webcomponents-loader.js"></script>
      <!-- End Polyfills -->
      <script type="module" src="https://cdn.jsdelivr.net/npm/if-diff@0.0.5/if-diff.iife.js"></script>
      <script type="module" src="https://cdn.jsdelivr.net/npm/p-d.p-u@0.0.82/dist/p-d.iife.js"></script>
    </div>
  </template>
</custom-element-demo>
```
-->  

## Syntax

<!--
```
<custom-element-demo>
<template>
    <div>
        <wc-info package-name="npm.if-diff" href="https://unpkg.com/if-diff@0.0.19/html.json"></wc-info>
        <script type="module" src="https://unpkg.com/wc-info@0.0.26/wc-info.js?module"></script>
    </div>
</template>
</custom-element-demo>
```
-->

## Commonality with p-d.p-u (a kind of dom-bind alternative)

Not only does if-diff share the same fetish for unidirectional data flow as [p-d.p-u](https://www.webcomponents.org/element/p-d.p-u), they share a number of common modules.  As a result, while if-diff weighs around 1.6kb and p-d weighs around 1.9kb, combine them together, and due to the magic of code reuse, the combined size is ~2.5kb minified and gzipped.

## Go to sleep mode

It is quite common to have a user interface with multiple tabs, each tab depending on some common filters / inputs.  if-diff can be used in this scenario, and to help improve performance, it can toggle the disabled attribute on the target elements.  If the elements themselves know how to "go to sleep" when disabled, and then sync up with the new filters / inputs when disabled is removed, that could provide the most optimal performance.

## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. Then run `polymer serve` to serve your element locally.

## Installation

```sh
$ npm install if-diff 
```

## Viewing Your Element

```
$ npm run serve
Open http://localhost:3030/demo/dev
```

## Running Tests

```
$ npm test
```
