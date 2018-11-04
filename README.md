[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/if-diff)

<a href="https://nodei.co/npm/if-diff/"><img src="https://nodei.co/npm/if-diff.png"></a>

# \<if-diff\>

\<if-diff\> is an alternative to Polymer's dom-if element that allows comparison between two operands, as well as progressive enhancement.

if-diff allows the server to display content that should be initially displayed, then adjusts what is displayed as conditions in the browser change.

## Syntax


```html
<!-- Polymer notation -->
<if-diff if lhs="[[dayOfWeek]]" equals rhs="Monday" tag="manicMonday" m="1"></if-diff>
...
<if-diff if lhs="[[dayOfWeek]]" equals rhs="Tuesday" tag="rubyTuesday"></if-diff>
...
<div data-manic-monday="0">
    <template>
        <div>Wish it was Sunday</div>
    </template>
</div>
<div data-ruby-tuesday="-1">
    <div>Who could hang a name on you</div>
</div>
...
```

Notes: 

1.  The "tag" attribute refers to a data-* attribute / dataset.* property.  The case is based on the property name.
2.  Only downstream sibling elements are checked for the data-* attribute.  This is to encourage unidirectional data flow, and keeping related things physically close.
3.  Speaking of which, the optional  m attribute indicates the maximum number of elements that are getting affected by the if-diff tag.  Placing the if-diff element right above the elements it affects, and specifying m accurately will improve performance.
4.  if-diff sets the data-* attribute to "1" when the condition is true, "-1" if not.  It is up to the application css styling to interpret how this should display.
5.  If if-diff encounters a data-* value of "0", this signifies there's exactly one template inside the DOM element, which needs cloning before changing to "1".  It will leave the template untouched if the condition is not satisfied.


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
      <p-d on="input" to="if-diff{lhs}" m="2"></p-d>
      RHS: <input type="textbox">
      <p-d on="input" to="if-diff{rhs}" m="2"></p-d>
      <if-diff if  equals tag="equals"></if-diff>
      <p-d on="value-changed" to="[data-lhs-equals-rhs]{innerText}"></p-d>
      <div data-equals="0">
          <template>
            <div>LHS == RHS</div>
          </template>
      </div>

      <if-diff if not_equals tag="notEquals"></if-diff>
      <p-d on="value-changed" to="[data-lhs-not-equals-rhs]{innerText}"></p-d>
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
      <script type="module" src="https://cdn.jsdelivr.net/npm/p-d.p-u@0.0.74/p-d.p-u.js"></script>
    </div>
  </template>
</custom-element-demo>
```
-->  


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

WIP
