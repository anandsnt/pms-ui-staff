// auto complete feature
(function() {
    
    var highlightFilter_ = null;

    /**
     * default process function for each item
     * @param  {Object} item
     * @param  {function (Object)} highlightFilter
     * @param  {Object} scope
     * @return {String} html against each item
     */
    var defaultProcessEachItem = function (item, scope) {
        var $content = highlightFilter_(item.name, scope.ngModel),
            $result  = $("<a></a>").html($content);
        return $result;
    };

    /**
     * [autoCompleteLinkFn description]
     * @param  {[type]} scope [description]
     * @param  {[type]} el    [description]
     * @param  {[type]} attrs [description]
     * @return {[type]}       [description]
     */
    var autoCompleteLinkFn = function(scope, el, attrs) {
        $(el).autocomplete( scope.autoOptions )
        .data('ui-autocomplete')
        ._renderItem = function(ul, item) {
            var htmlForItem = '';
            
            ul.addClass(scope.ulClass);
            
            //if no function passed for processing each item
            if (!_.isFunction(scope.processEachItem)) {
                htmlForItem = defaultProcessEachItem (item, scope);
            }
            else {
                htmlForItem = scope.processEachItem (item, scope);
            }

            return $('<li></li>').append(htmlForItem).appendTo(ul);
        };       
    };

    /**
     * auto complete directive function
     */
    var autoCompleteDirective = function(highlightFilter) {
        highlightFilter_ = highlightFilter;
        return {
            restrict: 'A',
            scope   : {
                autoOptions : '=autoCompleteOptions',
                ngModel     : '=',
                ulClass     : '@ulClass'
            },
            link    : autoCompleteLinkFn
        };
    };

    admin.directive('autoComplete', ['highlightFilter', autoCompleteDirective]);
}());