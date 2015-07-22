// This code will be assimilated, resistance is futile
// Code will be assimilated to become part of a better IMH234
// auto complete feature
sntRover.directive('autoComplete', ['highlightFilter',
    function(highlightFilter) {
        return {
            restrict: 'A',
            scope: {
                autoOptions: '=autoOptions',
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
                            defIcon = '',
                            defIconText = '',
                            $image = '';

                        switch ( item.type ) {
                            case 'COMPANY':
                                defIcon = 'icon-company';
                                break;

                            case 'TRAVELAGENT':
                                defIcon = 'icon-travel-agent';
                                break;

                            case 'GROUP':
                                defIcon = 'icon-group-large';
                                defIconText = 'G';
                                break;
                            case 'PROMO':
                                defIcon = 'icon-group-large';
                                defIconText = 'P';
                                break;
                            default:
                                break;
                        };

                        if (item.image) {
                            $image = '<img src="' + item.image + '">';
                        } else {
                            $image = '<span class="icons ' + defIcon + '">' + defIconText + '</span>';
                        }

                        if (item.type) {
                            $($image).prependTo($result);
                        }
                        return $('<li></li>').append($result).appendTo(ul);
                    };
            }
        };
    }
]);