/*!
 * v0.11.0
 *
 * MIT License
 *
 * Copyright (c) 2017 Vijay Dev (http://vijaydev.com/)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */
!function(e){function t(r){if(o[r])return o[r].exports;var n=o[r]={exports:{},id:r,loaded:!1};return e[r].call(n.exports,n,n.exports,t),n.loaded=!0,n.exports}var o={};return t.m=e,t.c=o,t.p="",t(0)}([function(e,t,o){"use strict";var r=o(1);r.module("ngAugmentNativeScroll",[]).factory("augNsUtils",o(2)).value("augNsOptions",o(3)).value("kineticEngine",o(4)).directive("connectScrolls",o(5)).directive("scrollArea",o(6)).directive("kineticScroll",o(7))},function(e,t){e.exports=angular},function(e,t){function o(){return function(){for(var e=0,t=["ms","moz","webkit","o"],o=0;o<t.length&&!window.requestAnimationFrame;++o)window.requestAnimationFrame=window[t[o]+"RequestAnimationFrame"],window.cancelAnimationFrame=window[t[o]+"CancelAnimationFrame"]||window[t[o]+"CancelRequestAnimationFrame"];window.requestAnimationFrame||(window.requestAnimationFrame=function(t){var o=(new Date).getTime(),r=Math.max(0,16-(o-e)),n=window.setTimeout(function(){t(o+r)},r);return e=o+r,n}),window.cancelAnimationFrame||(window.cancelAnimationFrame=function(e){clearTimeout(e)})}(),{findMatchingTarget:function(e,t){var o;return t.length&&"BODY"!==e.tagName?(o=t.find(function(t){return t.id===e.id}),o?e.id:this.findMatchingTarget(e.parentElement,t)):"BODY"},getPoint:function(e,t){var o;return o=t&&event.touches.length?{x:event.touches[0].clientX,y:event.touches[0].clientY}:{x:event.clientX,y:event.clientY}},getTime:Date.now||function(){return(new Date).utils.getTime()},preventDefaultException:function(e,t){for(var o in t)if(t[o].test(e[o]))return!0;return!1}}}e.exports=o},function(e,t){"use strict";var o={enableKinetics:!0,movingAverage:.1,preventDefaultException:{tagName:/^(INPUT|TEXTAREA|BUTTON|SELECT)$/}};e.exports=o},function(e,t){"use strict";function o(e,t){e.scrollLeft=0,e.scrollTop=0,e.lastScrollLeft=0,e.lastScrollTop=0,e.targetTop=0,e.targetLeft=0,e.velocityTop=0,e.velocityLeft=0,e.amplitudeTop=0,e.amplitudeLeft=0,e.timeStamp=0,e.referenceX=0,e.referenceY=0,e.pressed=!1,e.autoScrollTracker=null,e.isAutoScrolling=!1,e.leftTracker=function(){var o,r,n;o=t.getTime(),r=o-e.timeStamp,e.timeStamp=o,n=e.scrollLeft-e.lastScrollLeft,e.lastScrollLeft=e.scrollLeft,e.velocityLeft=e.userOptions.movingAverage*(1e3*n/(1+r))+.2*e.velocityLeft},e.topTracker=function(){var o,r,n;o=t.getTime(),r=o-e.timeStamp,e.timeStamp=o,n=e.scrollTop-e.lastScrollTop,e.lastScrollTop=e.scrollTop,e.velocityTop=e.userOptions.movingAverage*(1e3*n/(1+r))+.2*e.velocityTop},e.scrollTo=function(t,o){var r=Math.round(t),n=Math.round(o);e.childNodes.forEach(function(t){var o=t.children[0],l=o.scrollWidth-o.clientWidth,i=o.scrollHeight-o.clientHeight;l>0&&r>=0&&r<=l&&(o.scrollLeft=r,e.scrollLeft=r),i>0&&n>=0&&n<=i&&(o.scrollTop=n,e.scrollTop=n)})},e.autoScroll=function(){var o,r=0,n=0,l=0,i=0,c=325;o=t.getTime()-e.timeStamp,e.amplitudeTop&&(r=-e.amplitudeTop*Math.exp(-o/c)),e.amplitudeLeft&&(n=-e.amplitudeLeft*Math.exp(-o/c)),l=n>.5||n<-.5?n:0,i=r>.5||r<-.5?r:0,e.scrollTo(e.targetLeft+l,e.targetTop+i),0!==l||0!==i?e.autoScrollTracker=requestAnimationFrame(e.autoScroll):(e.isAutoScrolling=!1,e.autoScrollTracker=null)},e.cancelAutoScroll=function(){e.isAutoScrolling&&(cancelAnimationFrame(e.autoScrollTracker),e.isAutoScrolling=!1,e.autoScrollTracker=null)},e.tap=function(o){e.pressed=!0,e.referenceX=t.getPoint(o,e.hasTouch).x,e.referenceY=t.getPoint(o,e.hasTouch).y,e.velocityTop=e.amplitudeTop=0,e.velocityLeft=e.amplitudeLeft=0,e.lastScrollTop=e.scrollTop,e.lastScrollLeft=e.scrollLeft,e.timeStamp=t.getTime(),e.cancelAutoScroll(),e.$listener.addEventListener("mousemove",e.swipe,!0),e.$listener.addEventListener("mouseup",e.release,!0),t.preventDefaultException(o.target,e.userOptions.preventDefaultException)&&o.preventDefault()},e.swipe=function(o){var r,n,l,i;e.pressed&&(r=t.getPoint(o,e.hasTouch).x,n=t.getPoint(o,e.hasTouch).y,l=e.referenceX-r,i=e.referenceY-n,l>2||l<-2?e.referenceX=r:l=0,i>2||i<-2?e.referenceY=n:i=0,e.topTracker(),e.leftTracker(),e.scrollTo(e.scrollLeft+l,e.scrollTop+i))},e.release=function(){e.pressed=!1,e.timeStamp=t.getTime(),e.topTracker(),e.leftTracker(),e.velocityTop>10||e.velocityTop<-10?(e.amplitudeTop=.8*e.velocityTop,e.targetTop=Math.round(e.scrollTop+e.amplitudeTop)):e.targetTop=e.scrollTop,e.velocityLeft>10||e.velocityLeft<-10?(e.amplitudeLeft=.8*e.velocityLeft,e.targetLeft=Math.round(e.scrollLeft+e.amplitudeLeft)):e.targetLeft=e.scrollLeft,e.isAutoScrolling=!0,e.autoScrollTracker=requestAnimationFrame(e.autoScroll),e.$listener.removeEventListener("mousemove",e.swipe),e.$listener.removeEventListener("mouseup",e.release)},!e.hasTouch&&e.userOptions.enableKinetics&&e.$listener.addEventListener("mousedown",e.tap,!0),e.$on("$destroy",function(){e.$listener.removeEventListener("mousedown",e.tap)});var o=function(o,r,n){return function(){var l=0,i=0,c=0,a=0,s=0,u=0;o?(l=r?0:e.scrollLeft,i=n?0:e.scrollTop,c=r?-e.scrollLeft:0,a=n?-e.scrollTop:0):(e.childNodes.forEach(function(e){var t=e.children[0],o=t.scrollWidth-t.clientWidth,r=t.scrollHeight-t.clientHeight;o>s&&(s=o),r>u&&(u=r)}),l=r?s:e.scrollLeft,i=n?u:e.scrollTop,c=r?s-e.scrollLeft:0,a=n?u-e.scrollTop:0),0===c&&0===a||(e.cancelAutoScroll(),e.timeStamp=t.getTime(),e.targetLeft=l,e.targetTop=i,e.amplitudeLeft=c,e.amplitudeTop=a,e.isAutoScrolling=!0,e.autoScrollTracker=requestAnimationFrame(e.autoScroll))}},r=!0,n=!1,l=!0,i=!1,c=!0,a=!1;e.exposedMethods={scrollToStart:o(r,l,c),scrollToStartLeft:o(r,l,a),scrollToStartTop:o(r,i,c),scrollToEnd:o(n,l,c),scrollToEndLeft:o(n,l,a),scrollToEndTop:o(n,i,c)}}e.exports=o},function(e,t){"use strict";function o(e,t,o){return{restrict:"E",scope:{options:"="},transclude:!0,replace:!0,template:'<span data-name="conntect-scroll" ng-transclude></span>',link:function(r,n){r.hasTouch="ontouchstart"in window,r.DETECT_EVT=r.hasTouch?"touchstart":"mouseover",r.activeId=void 0,r.$listener=n[0],r.userOptions=angular.extend({},t,r.options),o.call(this,r,e),r.setActiveNode=function(t){r.activeId=e.findMatchingTarget(t.target,r.childNodes)},r.onScroll=function(e){if(r.pressed||r.isAutoScrolling)return e.preventDefault(),void e.stopPropagation();var t=e.target,o=void 0,n=void 0;t.clientWidth!==t.scrollWidth?(o=t.scrollLeft,r.lastScrollLeft=r.scrollLeft,r.scrollLeft=o):o=r.scrollLeft,t.clientHeight!==t.scrollHeight?(n=t.scrollTop,r.lastScrollTop=r.scrollTop,r.scrollTop=n):n=r.scrollTop,r.childNodes.forEach(function(e){e.id!==r.activeId&&(e.children[0].scrollLeft=o,e.children[0].scrollTop=n)})},r.$listener.addEventListener(r.DETECT_EVT,r.setActiveNode,!0),r.$listener.addEventListener("scroll",r.onScroll,!0),r.$on("$destroy",function(){r.$listener.removeEventListener(r.DETECT_EVT,r.setActiveNode),r.$listener.removeEventListener("scroll",r.onScroll)}),r.$parent.augNs=r.exposedMethods},controller:["$scope",function(e){var t=e.childNodes=[];this.addScrollArea=function(e){t.push(e)}}]}}o.$inject=["augNsUtils","augNsOptions","kineticEngine"],e.exports=o},function(e,t){"use strict";function o(){return{require:"^^connectScrolls",restrict:"E",transclude:!0,replace:!0,template:'<span  data-name="scroll-area" ng-transclude></span>',link:function(e,t,o,r){t.attr("id","PARTICIPATING_NODE_"+Math.random().toString().substring(2,15)),r.addScrollArea(t[0])}}}e.exports=o},function(e,t){"use strict";function o(e,t,o){return{restrict:"E",scope:{options:"="},transclude:!0,replace:!0,template:'<span data-name="kinetic-scroll" ng-transclude></span>',link:function(r,n){r.hasTouch="ontouchstart"in window,r.DETECT_EVT=r.hasTouch?"touchstart":"mouseover",r.$listener=n[0],r.childNodes=[r.$listener],r.userOptions=angular.extend({},t,r.options),o.call(this,r,e),r.$parent.augNs=r.exposedMethods}}}o.$inject=["augNsUtils","augNsOptions","kineticEngine"],e.exports=o}]);
