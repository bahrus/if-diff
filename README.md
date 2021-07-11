[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/if-diff)

<a href="https://nodei.co/npm/if-diff/"><img src="https://nodei.co/npm/if-diff.png"></a>

[![Actions Status](https://github.com/bahrus/p-et-alia/workflows/CI/badge.svg)](https://github.com/bahrus/p-et-alia/actions?query=workflow%3ACI)

<img src="https://badgen.net/bundlephobia/minzip/if-diff">

# \<if-diff\>


\<if-diff\> is an alternative to Polymer's [dom-if](https://polymer-library.polymer-project.org/3.0/docs/devguide/templates#dom-if) element that allows comparison between two operands, as well as progressive enhancement.  See [if-else](https://github.com/matthewp/if-else) for another data-centric alternative. And [iff-diff](https://github.com/bahrus/iff-diff) for something extremely light and simple, both size-wise and feature-wise.

if-diff shares with Polymer's dom-if the appreciate for the benefits of lazy loading content -- The content to display is normally tucked inside a template, where it doesn't impose a tax on memory or cpu, until the condition(s) are satisfied.  Only then is the template cloned and added into the live DOM tree.

if-diff adds additional, experimental support for an extra condition on rendering the contents -- it can be made to only load the content into the live DOM tree when the content scrolls or is clicked into view.  This can be specified by setting property lazyDisplay to true (or adding attribute lazy-display).   

if-diff also goes to some lengths to make the resulting DOM structure as flat as possible.  It does this by way of [lazy-mt](https://github.com/bahrus/lazy-mt).

if-diff also allows media queries to serve as an additional criteria.

## Syntax

The simplest, client-centric approach to using if-diff is demonstrated below:

```html
<div> 
  Type in the text boxes, and see what happens when value in the left textbox matches or doesn't match the right textbox.
</div>
<label for=lhs>LHS:</label><input id=lhs>
<!-- p-d = "pass down" --> 
<p-d on=input to=[-lhs] val=target.value m=2 init-val=value></p-d>
<label for=rhs>RHS:</label><input id=rhs>
<p-d on=input to=[-rhs] val=target.value m=2 init-val=value></p-d>
<if-diff iff -lhs equals -rhs>
    <template>
      <div>LHS == RHS</div>
    </template>
</if-diff>
<p-d observe=if-diff on=value-changed to=[data-lhs-equals-rhs] prop=textContent></p-d>
<if-diff iff -lhs not-equals -rhs>
    <template>
      <div>LHS != RHS</div>
    </template>
</if-diff>
<p-d observe=if-diff on=value-changed to=[data-lhs-not-equals-rhs] prop=textContent></p-d>

LHS Equals RHS: 
<div data-lhs-equals-rhs></div>
LHS Doesn't equal RHS:
<div data-lhs-not-equals-rhs></div>
```

"p-d", a kind of dom-bind alternative, is discussed [here](https://github.com/bahrus/pass-down).

## [API Reference](https://bahrus.github.io/wc-info/cdn-base.html?npmPackage=if-diff)

## Progressive Enhancement / Server-side rendering (SSR)

if-diff can optionally allow the server to display content that should be initially displayed, then adjusts what is displayed as conditions in the browser change.

For example, suppose today is Monday.  The server could generate the syntax below based on that fact:


```html
<!-- Framework-neutral pseudo code:  Assume some framework / library sets property "lhs" based on lhs:=dayOfWeek attribute --> 
<if-diff iff lhs='"Monday"' equals rhs='"Monday"' owned-sibling-count=1></if-diff>
<div>
  I wish it was Sunday
</div>
<if-diff iff lhs:=dayOfWeek equals rhs='"Tuesday"' owned-sibling-count=1></if-diff>
<template>
  <div>Who could hang a name on you</div>
</template>
```

"owned-sibling-count" indicates how many nextSiblingElements if-diff "owns".  This follows the same pattern used by [ib-id](https://github.com/bahrus/ib-id).

The user will immediately see the desired text "I wish it was Sunday" before a single byte of JS is downloaded.  Since the text for Tuesday is not yet applicable, embedding the content inside a template tag will allow the browser to ignore whatever is inside until needed.  Only if the day changes to Tuesday would we need to display Tuesday.  At that point, the template is cloned, and the clone replaces the template. 

One other thing:  When the server renders the content for Monday, this still leaves some slightly unnecessary processing -- we need to pass down the values of lhs, rhs, etc, in order for changes to the properties to evaluate consistently.  That causes if-diff to calculate the value of the logical expression, and then make sure the visibility of the owned content is compatible with the values.

But if the server made sure that the original HTML matches the correct initial value, there's a way the server can set the properties without forcing the component to do any of its client-side work:

```html
<if-diff sync-props-from-server='{"iff": true, "lhs": "Monday", "equals": true, "rhs": "Monday", "ownedSiblingCount": 1}'></if-diff>
<div>
  I wish it was Sunday
</div>
```

The server is saying:  "Don't worry about doing anything with the initial property values I'm providing, trust me, it's Monday, and the content is appropriate for Monday.  But these values I'm giving you will prove useful if something changes on the client."

## NextUnownedSibling

Since if-diff generates sibling elements on the fly, this could cause issues for other web components which generate content dynamically.

To help simplify some subtle issues related to this dilemma, a convenience read-only property is available:  $0.NextUnownedSibling.

## Purpose of "iff" property/attribute

The "iff" attribute / property is actually an active participant in the logical evaluation.  If that attribute / property is absent / false, then the evaluation will be false no matter what.  And as the demo below indicates, not-equals is also supported, as is "includes."  Additional / alternative evaluation logic can be inserted by overriding method async evaluate();


## [Demo](https://jsfiddle.net/bahrus/w24t0ra1/)

## [Syntax](https://bahrus.github.io/api-viewer/index.html?npmPackage=if-diff)


## How to treat non visible content

What should we do with previously activated content that is now no longer applicable for the time being?  I.e. what should happen on Wednesday?

if-diff's bias is towards hiding rather than deleting.

But if-diff agrees with dom-if's wisdom as far as the no-right-answer / difficult trade-offs, and envies how dom-if empowers developers to be able to choose [if ending DOM support is the more humane thing to do](https://polymer-library.polymer-project.org/2.0/docs/devguide/templates#dom-if).

But as we will see, we do provide an extension of if-diff that supports the more austere approach.

### Go to sleep mode

It is quite common to have a user interface with multiple tabs or menu items, each tab or menu item depending on some common filters / inputs.  if-diff can be used in this scenario, and to help improve performance, it makes the critical assumption that elements with disabled attribute won't do anything -- if properties change (like the values of the common filters), the new property values are dutifully stored locally, but nothing is done about it, until the disabled attribute is removed.  If the elements themselves know how to "go to sleep" when disabled in this way, and then sync up with the new filters / inputs when disabled is removed, that could provide the most optimal performance in a desktop / well-equipped handheld device.

<details>
  <summary>Customizing how content is hidden</summary>
  By default, hidden content is hidden via display:none.  This may not be the right way in all cases.  Property "hiddenStyle" can adjust this (first instance per ShadowDOMRoot).

  In addition, properties/attributes setAttr/set-attr, setClass/set-class, setPart/set-part can be used to set the specified attribute, class, or part, respectively. If the value is true add the attribute/class/part.  If the value is false, remove the attribute / class / part.
</details>

### Put to sleep mode

What if you need to deal with removing lots of DOM elements from view on a low memory device? And suppose those DOM elements are instances of custom elements, which specialize in main thread bitcoin mining operations?  And suppose they provide no ability to pause their operations?

So now, in order to free up memory / liberate the CPU, clearing the way for new DOM elements which need to display, we need to ask out of scope DOM elements that have seen better days [to throw themselves off a cliff](https://www.youtube.com/watch?v=DwD7f5ZWhAk).

A different element supports this harsh environment -- if-diff-then-stiff, a riff on a [gif](http://maryroach.net/stiff.html).

The problem is, how can we restore / reincarnate the content from the dead, including its current state of properties / attributes, when time once again fails to freeze at Sunday midnight? There are no "serializeThis", "deserializeThat" functions available in the DOM API, like there are for JS Objects <=> JSON.

Aha!  I can sense you glibly thinking via the Force.  

"See, I told you -- you need a high-powered state manager, full of stores, thunking and discombobulating, to guide you through this resurrection of the UI."

But if the purpose of this whole exercise is to reduce memory, isn't that almost defeating the purpose?  Granted, JavaScript objects often take up less memory than DOM elements, but now you have to hold on to both (more or less).

if-diff-then-stiff argues "Why would you store state of these snuffed out DOM elements in the extremely limited RAM, leaving less room for keeping additional DOM in memory?  That seems incredibly cruel. Why not store the 'state' in out-of-RAM storage areas, such as history.state (at least past states), a remote store, IndexedDB, or SessionStorage?"

##  Alternative "Go To Sleep" Approach [TODO]

if-diff can also proxy property changes, and will only allow those proxy values to pass through to the element when the if condition is satisfied

Syntax:

```html
<if-diff iff -lhs equals -rhs -my-grid-element-proxy -my-chart-element-proxy><template>
  <my-grid></my-grid>
  <my-chart></my-chart>
</template></if-diff>
```

## Viewing Your Element Locally

1.  Install git.
2.  Fork/clone this repo.
3.  Install node.
4.  Open command window to folder where you cloned this repo.
5.  > npm install
6.  > npm run serve
7.  Open http://localhost:3030/demo/dev in a modern browser.

## Running Tests

```
> npm test
```
