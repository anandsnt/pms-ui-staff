searchResults = {};
searchResults.guests = [];

// Capitalize first letter
jQuery.fn.capitalize = function() {
    $(this[0]).keyup(function(event) {
        var box = event.target;
        var txt = $(this).val();
        var start = box.selectionStart;
        var end = box.selectionEnd;
        $(this).val(txt.replace(/^(.)|(\s|\-)(.)/g, function($1) {
            return $1.toUpperCase();
        }));
        box.setSelectionRange(start, end);
    });

   return this;
};







