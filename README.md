[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/if-diff)

# \<if-diff\>

\<if-diff\> is an alternative to Polymer's dom-if element that allows comparison between two operands, as well as progressive enhancement.

if-diff allows the server to display content that should be initially displayed, then adjusts what is displayed as conditions in the browser change.

## Syntax


```html
<!-- Polymer notation -->
<if-diff if lhs="[[dayOfWeek]]" equals rhs="Monday" tag="manicMonday"></if-diff>
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
