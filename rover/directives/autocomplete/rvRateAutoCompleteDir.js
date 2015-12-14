// This code will be assimilated, resistance is futile
// Code will be assimilated to become part of a better IMH234
// auto complete feature
sntRover.directive('autoCompleteRate', ['highlightFilter',
    function(highlightFilter) {
        return {
            restrict: 'A',
            scope: {
                autoOptions: '=autoCompleteOptions',
                ngModel: '=',
                ulClass: '@ulClass'
            },
            link: function(scope, el, attrs) {
                $(el).autocomplete(scope.autoOptions)
                    .data('ui-autocomplete')
                    ._renderItem = function(ul, item) {
                        ul.addClass(scope.ulClass);

                        var $content = highlightFilter(item.label, scope.ngModel),
                            $result = $("<a></a>").html($content),
                            defIconText = '',
                            $image = '';

                        switch (item.type) {
                            case 'PUBLIC':
                                defIconText = 'Public';
                                break;

                            case 'CORP':
                                defIconText = 'Corporate';
                                break;

                            default:
                                break;
                        };

                        $image = '<span class="label ' + defIconText + '">' + defIconText + '</span>';

                        if (item.type) {
                            $($image).appendTo($result);
                        }
                        return $('<li></li>').append($result).appendTo(ul);
                    };
            }
        };
    }
]);