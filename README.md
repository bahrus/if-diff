[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/if-diff)

<a href="https://nodei.co/npm/if-diff/"><img src="https://nodei.co/npm/if-diff.png"></a>

[![Actions Status](https://github.com/bahrus/p-et-alia/workflows/CI/badge.svg)](https://github.com/bahrus/p-et-alia/actions?query=workflow%3ACI)

<img src="https://badgen.net/bundlephobia/minzip/if-diff">


# \<if-diff\>

\<if-diff\> is an alternative to Polymer's [dom-if](https://polymer-library.polymer-project.org/3.0/docs/devguide/templates#dom-if) element that allows comparison between two operands, as well as progressive enhancement.  See [if-else](https://github.com/matthewp/if-else) for another data-centric alternative.

if-diff allows the server to display content that should be initially displayed, then adjusts what is displayed as conditions in the browser change.

For example, suppose today is Monday.  The server could generate the syntax below:


```html
<!-- Framework-neutral pseudo code:  Assume some framework / library sets property "lhs" based on lhs:=dayOfWeek attribute --> 
<if-diff if lhs:=dayOfWeek equals rhs=Monday data-key-name=manicMonday m=1></if-diff>
...
<if-diff if lhs:=dayOfWeek equals rhs=Tuesday data-key-name=rubyTuesday></if-diff>
...
<div data-manic-monday="1">
  I wish it was Sunday
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

1.  The "data-key-name" attribute refers to a data-* attribute / dataset.* property.  The case is based on the property name.
2.  Only downstream sibling elements are checked for the data-* attribute.  This is to encourage unidirectional data flow, and keeping related things physically close.
3.  Speaking of which, the optional  m attribute indicates the maximum number of elements that are getting affected by the *if-diff* tag.  Placing the *if-diff* element right above the element(s) it affects, and specifying "m" accurately, will improve performance and help reduce greenhouse emissions.
4.  *if-diff* sets the data-* attribute to "1" when the condition is true, "-1" if not.  It is up to the application's css styling to interpret how this should display.
5.  If *if-diff* encounters a data-* value of "0", this signifies there's exactly one template inside the DOM element, which needs cloning before changing to "1".  It will leave the template untouched if the condition is not satisfied.  This allows for lazy loading, especially if combined with a dynamic loader, like [xtal-sip](https://github.com/bahrus/xtal-sip).
6.  The "if" attribute / property is actually an active participant in the logical evaluation.  If that attribute / property is false, then the evaluation will be false no matter what.  And as the demo below indicates, not_equals is also supported.

<!--
```
<custom-element-demo>
  <template>
    <div>
      <xtal-sip><script nomodule>["p-d", "if-diff"]</script></xtal-sip>
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
      <label for=lhs>LHS:</label><input id=lhs> 
      <p-d on=input to=[-lhs]  val=target.value m=2></p-d>
      <label for=rhs>RHS:</label><input id=rhs>
      <p-d on=input to=[-rhs]  val=target.value m=2></p-d>
      <if-diff if -lhs equals -rhs data-key-name=equals></if-diff>
      <p-d on=value-changed to=[data-lhs-equals-rhs] prop=textContent value=target.value></p-d>
      <div data-equals=0 id=equalsStatus>
          <template>
            <div>LHS == RHS</div>
          </template>
      </div>

      <if-diff if -lhs not_equals -rhs data-key-name=notEquals></if-diff>
      <p-d on=value-changed to=[data-lhs-not-equals-rhs] prop=textContent></p-d>
      <div data-not-equals=0>
          <template>
              <div>LHS != RHS</div>
          </template>       
      </div>

      

      LHS Equals RHS: <span data-lhs-equals-rhs></span><br>
      LHS Doesn't equal RHS: <span data-lhs-not-equals-rhs></span>

      <!-- ========================  Script Refs ========================== -->


      <!-- Use experimental import maps -->
      <script defer src="https://cdn.jsdelivr.net/npm/es-module-shims@0.2.0/dist/es-module-shims.js"></script>
      <script type="importmap-shim">
        {
          "imports": {
            "xtal-sip":             "https://cdn.jsdelivr.net/npm/xtal-sip@0.0.90/xtal-sip.js",
            "xtal-element/":        "https://cdn.jsdelivr.net/npm/xtal-element@0.0.59/",
            "trans-render/":        "https://cdn.jsdelivr.net/npm/trans-render@0.0.111/",
            "p-d":                  "https://cdn.jsdelivr.net/npm/p-et-alia@0.0.6/p-d.js",
            "if-diff":              "https://cdn.jsdelivr.net/npm/if-diff@0.0.30/if-diff.js"
          }
        }
        </script>
      <script  type="module-shim">
        import 'xtal-sip';
      </script>
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
    <iframe src=https://bahrus.github.io/wc-info/syntax.html?npmPackage=if-diff style="width:100%;border:none;height:600px"></iframe>
</template>
</custom-element-demo>
```
-->

## Commonality with p-et-alia (a kind of dom-bind alternative)

Not only does if-diff share the same fetish for unidirectional data flow as [p-et-alia](https://github.com/bahrus/p-et-alia), they share a number of common modules.  

<!--As a result, while if-diff and p-d weighs around 3kb, combine them together, and, due to the magic of code reuse, the combined size is ~2.5kb minified and gzipped.-->

## How to treat non visible content

What should we do with previously activated content that is now no longer applicable for the time being?  I.e. what should happen on Wednesday?

if-diff's bias is towards hiding rather than deleting.

But if-diff agrees with dom-if's wisdom as far as the no-right-answer / difficult trade-offs, and envies how dom-if empowers developers to be able to choose [if ending DOM support is the more humane thing to do](https://polymer-library.polymer-project.org/2.0/docs/devguide/templates#dom-if).

<!--But as we will see, we do provide an extension of if-diff that supports the more austere approach.-->

### Go to sleep mode

It is quite common to have a user interface with multiple tabs, each tab depending on some common filters / inputs.  if-diff can be used in this scenario, and to help improve performance, it can toggle the disabled attribute on the target elements.  If the elements themselves know how to "go to sleep" when disabled, and then sync up with the new filters / inputs when disabled is removed, that could provide the most optimal performance in a desktop / well-equipped tablet.

You can specify which elements to disable/enable based on the evaluation:

```html
<if-diff if -lhs equals -rhs data-key-name=manicMonday m=1 enable="my-sleeping-element"></if-diff>
```

The enable attribute will cause if-diff to find all elements matching the enable value (via css querySelectorAll), and remove all disabled attributes from matching nodes, when the test is true, and add the disabled attribute when the test is false.

### Prop Passing

More info on this for a later version.

<!--
### Put to sleep mode

What if you need to deal with removing lots of DOM elements from view on a low memory device? 

So now, in order to free up memory for new DOM elements that need to display, we need to ask out of scope DOM elements that have seen better days [to throw themselves off a cliff](https://www.youtube.com/watch?v=DwD7f5ZWhAk).

A different element supports this harsh environment -- if-diff-then-stiff, a riff on a [gif](http://maryroach.net/stiff.html)

The problem is, how can we restore / reincarnate the content from the dead, including its current state of properties / attributes, when time once again fails to freeze at Sunday midnight? There are no "serializeThis", "deserializeThat" functions available in the DOM API, like there is for JSON.

Aha!  I can sense you glibly thinking via the Force.  

"See, I told you -- you need a high-powered state manager, full of stores, thunking and discombobulating, to guide you through this resurrection of the UI."

But if the purpose of this whole exercise is to reduce memory, isn't that almost defeating the purpose?  Granted, JavaScript objects often take up less memory than DOM elements, but now you have to hold on to both (more or less).

if-diff-then-stiff argues "Why would you store state of these snuffed out DOM elements in the extremely limited RAM, leaving less room for keeping additional DOM in memory?  That seems incredibly cruel. Why not store the 'state' in out-of-RAM storage areas, such as history.state (at least past states), a remote store, IndexedDB, or SessionStorage?"  
-->

## Viewing Your Element Locally

```
$ npm install
$ npm run serve
Open http://localhost:3030/demo/dev
```

## Running Tests

```
$ npm test
```
