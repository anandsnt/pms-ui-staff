// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//= require modernizr
//= require jquery.min
//= require jquery_ujs
//= require ./jquery-ui/core/jquery.ui.core.min
//= require ./jquery-ui/core/jquery.ui.widget.min
//= require ./jquery-ui/core/jquery.ui.mouse.min
//= require ./jquery-ui/interactions/jquery.ui.resizable.min
//= require ./jquery-ui/interactions/jquery.ui.draggable.min
//= require ./jquery-ui/interactions/jquery.ui.droppable.min
//= require ./jquery-ui/interactions/jquery.ui.sortable.min
//= require ./jquery-ui/widgets/jquery.ui.tabs.min
//= require ./jquery-ui/widgets/jquery.ui.datepicker.min
//= require ./jquery-ui/jquery.ui.touch-punch.min

// staff app scripts
//= require_tree ./app/plugins
//= require_tree ./app/signature

//= require_tree ./app
//= require_tree ./admin/plugins
//= require_tree ./admin
//= require main

(function() {
    var method;
    var noop = function noop() {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});
 
    while (length--) {
        method = methods[length];
 
        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());