[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/if-diff)

<a href="https://nodei.co/npm/if-diff/"><img src="https://nodei.co/npm/if-diff.png"></a>

<!--
<img src="https://badgen.net/bundlephobia/minzip/if-diff">
-->

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

1.  The "data-key-name" attribute refers to a data-* attribute / dataset.* property.  The case is based on the property name.
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
    <div>
        <wc-info package-name="npm.if-diff" href="https://unpkg.com/if-diff@0.0.33/html.json"></wc-info>
        <script type="module" src="https://unpkg.com/wc-info@0.0.32/wc-info.js?module"></script>
    </div>
</template>
</custom-element-demo>
```
-->

## Commonality with p-et-alia (a kind of dom-bind alternative)

Not only does if-diff share the same fetish for unidirectional data flow as [p-et-alia](https://github.com/bahrus/p-et-alia), they share a number of common modules.  As a result, while if-diff weighs around 1.6kb and p-d weighs around 1.9kb, combine them together, and, due to the magic of code reuse, the combined size is ~2.5kb minified and gzipped.

## How to treat non visible content

What should we do with a previously activated content that is now no longer applicable?  I.e. what should happen on Wednesday?

My bias is towards hiding it, as I tend to work more with VM PC's, but with lots of memory. Especially when you are using an expensive to initialize component, like a fancy, virtual grid.  So if-diff currently only supports that option.  [The gas guzzling framework in the room's](https://www.infoq.com/news/2019/04/real-world-framework-benchmark/?utm_source=sumome&utm_medium=twitter&utm_campaign=sumome_share) routing solutions tend to perform abysmally in such a setting (even if caching data, etc), in my experience.  For that reason, I lacked the enthusiasm to consider the wider community in the opposite direction, which isn't good.

if-diff agrees with dom-if's wisdom as far as the no-right-answer / difficult trade-offs, and envies how it empowers developers to be able to choose [if ending DOM support is the more humane thing to do](https://polymer-library.polymer-project.org/2.0/docs/devguide/templates#dom-if).

So the plan is sketched below.

### Go to sleep mode

It is quite common to have a user interface with multiple tabs, each tab depending on some common filters / inputs.  if-diff can be used in this scenario, and to help improve performance, it can toggle the disabled attribute on the target elements.  If the elements themselves know how to "go to sleep" when disabled, and then sync up with the new filters / inputs when disabled is removed, that could provide the most optimal performance in a desktop / well-equipped tablet.

You can specify which elements to disable/enable based on the evaluation:

```html
<if-diff if -lhs equals -rhs data-key-name=manicMonday m=1 enable="my-sleeping-element"></if-diff>
```

The enable attribute will cause if-diff to find all elements matching the enable value (via css querySelectorAll), and remove all disabled attributes from matching nodes, when the test is true, and add the disabled attribute when the test is false.

### Put to sleep mode [WIP]

What if the situation is reversed -- lots of DOM elements, requiring lots of repainting / css queries overhead, on a low memory device? 

I plan to support one approach to this situation that is consistent with the general philosophy underlying this component and some of its kindred elements.

I plan to do so with a different element -- if-diff-then-stiff, a riff on a [gif](http://maryroach.net/stiff.html)

The problem is, how can we restore / reincarnate the content from the dead, including its current state of properties / attributes, when time once again fails to freeze at Sunday midnight? There are no "serializeThis", "deserializeThat" functions available in the DOM API, like there is for JSON.

Aha!  I can sense you glibly thinking via the Force.  

"See, I told you -- you need a high-powered state manager, full of stores, thunking and discombobulating, to guide you through this resurrection of the UI."

But if the purpose of this whole exercise is to reduce memory, isn't that almost defeating the purpose?  Granted, JavaScript objects often take up less memory than DOM elements, but now you have to hold on to both.

Well, the solution if-diff-then-stiff proposes isn't too far off from that, but its focus will be on being flexible, and making sure history.state and other out-of-RAM storage / experience areas, including a remote store, can be used to preserve and restore state, along [these](https://github.com/bahrus/bi-st) [lines](https://github.com/bahrus/purr-sist)

In fact, as far as I can see at the moment, if you stick to the data-centric approaches of those last links above, this component doesn't have to do much of anything (but we'll see).

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
