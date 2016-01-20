/*
 AngularJS v1.2.15
 (c) 2010-2014 Google, Inc. http://angularjs.org
 License: MIT
*/
(function(F,g,P){'use strict';g.module("ngAnimate",["ng"]).factory("$$animateReflow",["$$rAF","$document",function(g,F){return function(e){return g(function(){e()})}}]).config(["$provide","$animateProvider",function(V,G){function e(e){for(var p=0;p<e.length;p++){var g=e[p];if(g.nodeType==ba)return g}}function u(p){return g.element(e(p))}var m=g.noop,p=g.forEach,ga=G.$$selectors,ba=1,h="$$ngAnimateState",J="ng-animate",r={running:!0};V.decorator("$animate",["$delegate","$injector","$sniffer","$rootElement",
"$$asyncCallback","$rootScope","$document",function(x,F,aa,K,E,H,P){function Q(a){if(a){var b=[],c={};a=a.substr(1).split(".");(aa.transitions||aa.animations)&&a.push("");for(var d=0;d<a.length;d++){var f=a[d],e=ga[f];e&&!c[f]&&(b.push(F.get(e)),c[f]=!0)}return b}}function L(a,b,c){function d(a,b){var c=a[b],d=a["before"+b.charAt(0).toUpperCase()+b.substr(1)];if(c||d)return"leave"==b&&(d=c,c=null),y.push({event:b,fn:c}),l.push({event:b,fn:d}),!0}function f(b,d,e){var f=[];p(b,function(a){a.fn&&f.push(a)});
var n=0;p(f,function(b,p){var C=function(){a:{if(d){(d[p]||m)();if(++n<f.length)break a;d=null}e()}};switch(b.event){case "setClass":d.push(b.fn(a,q,z,C));break;case "addClass":d.push(b.fn(a,q||c,C));break;case "removeClass":d.push(b.fn(a,z||c,C));break;default:d.push(b.fn(a,C))}});d&&0===d.length&&e()}var e=a[0];if(e){var h="setClass"==b,r=h||"addClass"==b||"removeClass"==b,q,z;g.isArray(c)&&(q=c[0],z=c[1],c=q+" "+z);var s=a.attr("class")+" "+c;if(S(s)){var t=m,v=[],l=[],w=m,n=[],y=[],s=(" "+s).replace(/\s+/g,
".");p(Q(s),function(a){!d(a,b)&&h&&(d(a,"addClass"),d(a,"removeClass"))});return{node:e,event:b,className:c,isClassBased:r,isSetClassOperation:h,before:function(a){t=a;f(l,v,function(){t=m;a()})},after:function(a){w=a;f(y,n,function(){w=m;a()})},cancel:function(){v&&(p(v,function(a){(a||m)(!0)}),t(!0));n&&(p(n,function(a){(a||m)(!0)}),w(!0))}}}}}function A(a,b,c,d,f,e,r){function m(d){var e="$animate:"+d;w&&(w[e]&&0<w[e].length)&&E(function(){c.triggerHandler(e,{event:a,className:b})})}function q(){m("before")}
function z(){m("after")}function s(){m("close");r&&E(function(){r()})}function t(){t.hasBeenRun||(t.hasBeenRun=!0,e())}function v(){if(!v.hasBeenRun){v.hasBeenRun=!0;var d=c.data(h);d&&(l&&l.isClassBased?B(c,b):(E(function(){var d=c.data(h)||{};A==d.index&&B(c,b,a)}),c.data(h,d)));s()}}var l=L(c,a,b);if(l){b=l.className;var w=g.element._data(l.node),w=w&&w.events;d||(d=f?f.parent():c.parent());var n=c.data(h)||{};f=n.active||{};var y=n.totalActive||0,C=n.last;if(l.isClassBased&&(n.disabled||C&&!C.isClassBased)||
N(c,d))t(),q(),z(),v();else{d=!1;if(0<y){n=[];if(l.isClassBased)"setClass"==C.event?(n.push(C),B(c,b)):f[b]&&(x=f[b],x.event==a?d=!0:(n.push(x),B(c,b)));else if("leave"==a&&f["ng-leave"])d=!0;else{for(var x in f)n.push(f[x]),B(c,x);f={};y=0}0<n.length&&p(n,function(a){a.cancel()})}!l.isClassBased||(l.isSetClassOperation||d)||(d="addClass"==a==c.hasClass(b));if(d)q(),z(),s();else{if("leave"==a)c.one("$destroy",function(a){a=g.element(this);var b=a.data(h);b&&(b=b.active["ng-leave"])&&(b.cancel(),B(a,
"ng-leave"))});c.addClass(J);var A=O++;y++;f[b]=l;c.data(h,{last:l,active:f,index:A,totalActive:y});q();l.before(function(d){var e=c.data(h);d=d||!e||!e.active[b]||l.isClassBased&&e.active[b].event!=a;t();!0===d?v():(z(),l.after(v))})}}}else t(),q(),z(),v()}function T(a){if(a=e(a))a=g.isFunction(a.getElementsByClassName)?a.getElementsByClassName(J):a.querySelectorAll("."+J),p(a,function(a){a=g.element(a);(a=a.data(h))&&a.active&&p(a.active,function(a){a.cancel()})})}function B(a,b){if(e(a)==e(K))r.disabled||
(r.running=!1,r.structural=!1);else if(b){var c=a.data(h)||{},d=!0===b;!d&&(c.active&&c.active[b])&&(c.totalActive--,delete c.active[b]);if(d||!c.totalActive)a.removeClass(J),a.removeData(h)}}function N(a,b){if(r.disabled)return!0;if(e(a)==e(K))return r.disabled||r.running;do{if(0===b.length)break;var c=e(b)==e(K),d=c?r:b.data(h),d=d&&(!!d.disabled||d.running||0<d.totalActive);if(c||d)return d;if(c)break}while(b=b.parent());return!0}var O=0;K.data(h,r);H.$$postDigest(function(){H.$$postDigest(function(){r.running=
!1})});var U=G.classNameFilter(),S=U?function(a){return U.test(a)}:function(){return!0};return{enter:function(a,b,c,d){this.enabled(!1,a);x.enter(a,b,c);H.$$postDigest(function(){a=u(a);A("enter","ng-enter",a,b,c,m,d)})},leave:function(a,b){T(a);this.enabled(!1,a);H.$$postDigest(function(){A("leave","ng-leave",u(a),null,null,function(){x.leave(a)},b)})},move:function(a,b,c,d){T(a);this.enabled(!1,a);x.move(a,b,c);H.$$postDigest(function(){a=u(a);A("move","ng-move",a,b,c,m,d)})},addClass:function(a,
b,c){a=u(a);A("addClass",b,a,null,null,function(){x.addClass(a,b)},c)},removeClass:function(a,b,c){a=u(a);A("removeClass",b,a,null,null,function(){x.removeClass(a,b)},c)},setClass:function(a,b,c,d){a=u(a);A("setClass",[b,c],a,null,null,function(){x.setClass(a,b,c)},d)},enabled:function(a,b){switch(arguments.length){case 2:if(a)B(b);else{var c=b.data(h)||{};c.disabled=!0;b.data(h,c)}break;case 1:r.disabled=!a;break;default:a=!r.disabled}return!!a}}}]);G.register("",["$window","$sniffer","$timeout",
"$$animateReflow",function(h,r,u,K){function E(a,k){R&&R();W.push(k);R=K(function(){p(W,function(a){a()});W=[];R=null;M={}})}function H(a,k){var b=e(a);a=g.element(b);Y.push(a);b=Date.now()+1E3*k;b<=fa||(u.cancel(ea),fa=b,ea=u(function(){J(Y);Y=[]},k,!1))}function J(a){p(a,function(a){(a=a.data(n))&&(a.closeAnimationFn||m)()})}function Q(a,k){var b=k?M[k]:null;if(!b){var c=0,d=0,e=0,f=0,n,Z,$,g;p(a,function(a){if(a.nodeType==ba){a=h.getComputedStyle(a)||{};$=a[I+s];c=Math.max(L($),c);g=a[I+t];n=a[I+
v];d=Math.max(L(n),d);Z=a[q+v];f=Math.max(L(Z),f);var k=L(a[q+s]);0<k&&(k*=parseInt(a[q+l],10)||1);e=Math.max(k,e)}});b={total:0,transitionPropertyStyle:g,transitionDurationStyle:$,transitionDelayStyle:n,transitionDelay:d,transitionDuration:c,animationDelayStyle:Z,animationDelay:f,animationDuration:e};k&&(M[k]=b)}return b}function L(a){var k=0;a=g.isString(a)?a.split(/\s*,\s*/):[];p(a,function(a){k=Math.max(parseFloat(a)||0,k)});return k}function A(a){var k=a.parent(),b=k.data(w);b||(k.data(w,++da),
b=da);return b+"-"+e(a).className}function T(a,k,b,c){var d=A(k),f=d+" "+b,p=M[f]?++M[f].total:0,g={};if(0<p){var h=b+"-stagger",g=d+" "+h;(d=!M[g])&&k.addClass(h);g=Q(k,g);d&&k.removeClass(h)}c=c||function(a){return a()};k.addClass(b);var h=k.data(n)||{},l=c(function(){return Q(k,f)});c=l.transitionDuration;d=l.animationDuration;if(0===c&&0===d)return k.removeClass(b),!1;k.data(n,{running:h.running||0,itemIndex:p,stagger:g,timings:l,closeAnimationFn:m});a=0<h.running||"setClass"==a;0<c&&B(k,b,a);
0<d&&(0<g.animationDelay&&0===g.animationDuration)&&(e(k).style[q]="none 0s");return!0}function B(a,b,c){"ng-enter"!=b&&("ng-move"!=b&&"ng-leave"!=b)&&c?a.addClass(y):e(a).style[I+t]="none"}function N(a,b){var c=I+t,d=e(a);d.style[c]&&0<d.style[c].length&&(d.style[c]="");a.removeClass(y)}function O(a){var b=q;a=e(a);a.style[b]&&0<a.style[b].length&&(a.style[b]="")}function U(a,b,c,f){function g(a){b.off(y,h);b.removeClass(r);d(b,c);a=e(b);for(var X in u)a.style.removeProperty(u[X])}function h(a){a.stopPropagation();
var b=a.originalEvent||a;a=b.$manualTimeStamp||b.timeStamp||Date.now();b=parseFloat(b.elapsedTime.toFixed(C));Math.max(a-A,0)>=x&&b>=v&&f()}var l=e(b);a=b.data(n);if(-1!=l.className.indexOf(c)&&a){var r="";p(c.split(" "),function(a,b){r+=(0<b?" ":"")+a+"-active"});var q=a.stagger,m=a.timings,t=a.itemIndex,v=Math.max(m.transitionDuration,m.animationDuration),w=Math.max(m.transitionDelay,m.animationDelay),x=w*ca,A=Date.now(),y=z+" "+G,s="",u=[];if(0<m.transitionDuration){var B=m.transitionPropertyStyle;
-1==B.indexOf("all")&&(s+=D+"transition-property: "+B+";",s+=D+"transition-duration: "+m.transitionDurationStyle+";",u.push(D+"transition-property"),u.push(D+"transition-duration"))}0<t&&(0<q.transitionDelay&&0===q.transitionDuration&&(s+=D+"transition-delay: "+S(m.transitionDelayStyle,q.transitionDelay,t)+"; ",u.push(D+"transition-delay")),0<q.animationDelay&&0===q.animationDuration&&(s+=D+"animation-delay: "+S(m.animationDelayStyle,q.animationDelay,t)+"; ",u.push(D+"animation-delay")));0<u.length&&
(m=l.getAttribute("style")||"",l.setAttribute("style",m+" "+s));b.on(y,h);b.addClass(r);a.closeAnimationFn=function(){g();f()};l=(t*(Math.max(q.animationDelay,q.transitionDelay)||0)+(w+v)*V)*ca;a.running++;H(b,l);return g}f()}function S(a,b,c){var d="";p(a.split(","),function(a,X){d+=(0<X?",":"")+(c*b+parseInt(a,10))+"s"});return d}function a(a,b,c,e){if(T(a,b,c,e))return function(a){a&&d(b,c)}}function b(a,b,c,e){if(b.data(n))return U(a,b,c,e);d(b,c);e()}function c(c,d,e,f){var g=a(c,d,e);if(g){var h=
g;E(d,function(){N(d,e);O(d);h=b(c,d,e,f)});return function(a){(h||m)(a)}}f()}function d(a,b){a.removeClass(b);var c=a.data(n);c&&(c.running&&c.running--,c.running&&0!==c.running||a.removeData(n))}function f(a,b){var c="";a=g.isArray(a)?a:a.split(/\s+/);p(a,function(a,d){a&&0<a.length&&(c+=(0<d?" ":"")+a+b)});return c}var D="",I,G,q,z;F.ontransitionend===P&&F.onwebkittransitionend!==P?(D="-webkit-",I="WebkitTransition",G="webkitTransitionEnd transitionend"):(I="transition",G="transitionend");F.onanimationend===
P&&F.onwebkitanimationend!==P?(D="-webkit-",q="WebkitAnimation",z="webkitAnimationEnd animationend"):(q="animation",z="animationend");var s="Duration",t="Property",v="Delay",l="IterationCount",w="$$ngAnimateKey",n="$$ngAnimateCSS3Data",y="ng-animate-block-transitions",C=3,V=1.5,ca=1E3,M={},da=0,W=[],R,ea=null,fa=0,Y=[];return{enter:function(a,b){return c("enter",a,"ng-enter",b)},leave:function(a,b){return c("leave",a,"ng-leave",b)},move:function(a,b){return c("move",a,"ng-move",b)},beforeSetClass:function(b,
c,d,e){var g=f(d,"-remove")+" "+f(c,"-add"),h=a("setClass",b,g,function(a){var e=b.attr("class");b.removeClass(d);b.addClass(c);a=a();b.attr("class",e);return a});if(h)return E(b,function(){N(b,g);O(b);e()}),h;e()},beforeAddClass:function(b,c,d){var e=a("addClass",b,f(c,"-add"),function(a){b.addClass(c);a=a();b.removeClass(c);return a});if(e)return E(b,function(){N(b,c);O(b);d()}),e;d()},setClass:function(a,c,d,e){d=f(d,"-remove");c=f(c,"-add");return b("setClass",a,d+" "+c,e)},addClass:function(a,
c,d){return b("addClass",a,f(c,"-add"),d)},beforeRemoveClass:function(b,c,d){var e=a("removeClass",b,f(c,"-remove"),function(a){var d=b.attr("class");b.removeClass(c);a=a();b.attr("class",d);return a});if(e)return E(b,function(){N(b,c);O(b);d()}),e;d()},removeClass:function(a,c,d){return b("removeClass",a,f(c,"-remove"),d)}}}])}])})(window,window.angular);
//# sourceMappingURL=angular-animate.min.js.map