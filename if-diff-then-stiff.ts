import {IfDiff} from './if-diff2.js';
import {def} from 'trans-render/lib/def.js';
import {LazyMTProps} from 'lazy-mt/types.d.js';

/**
 * Alternative to Polymer's dom-if element that allows comparison between two operands, as well as progressive enhancement.
 * DOM deletion takes place on non matching elements.
 * @element if-diff-then-stiff
 */
export class IfDiffThenStiff extends IfDiff{
    static is = 'if-diff-then-stiff';
    override addStyle = ({}: this) => {  
        //no need for styles to hide things.
    };
    override configureLazyMt(lazyMT: LazyMTProps){
        lazyMT.minMem = true;
    }
}

def(IfDiffThenStiff);