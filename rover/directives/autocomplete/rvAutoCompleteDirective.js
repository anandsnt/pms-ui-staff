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
                ulClass: '@ulClass',
                insertEmail: '=insertEmail'
            },
            link: function(scope, el, attrs) {
                // CICO-26513
                var ulElement = null;

                $(el).autocomplete(scope.autoOptions)
                    .data('ui-autocomplete')
                    ._renderItem = function(ul, item) {
                        ul.addClass(scope.ulClass);

                        // CICO-26513
                        ulElement = ul;
                        ul.off('touchmove').on('touchmove', function(e) {
                            e.stopPropagation();
                        });

                        var $content = highlightFilter(item.label, scope.ngModel),
                            $result = $("<a></a>").html($content),
                            defIcon = '',
                            defIconText = '',
                            $image = '';
                        
                        switch (item.type) {
                            case 'COMPANY':
                                defIcon = 'icon-company';
                                $result.addClass("autocomplete-result");
                                if (item.address !== '') {
                                    var address = $("<span></span>").html(item.address);

                                    address.addClass("location");
                                    $result.append(address);
                                }
                                break;

                            case 'ALLOTMENT':
                                defIcon = 'icon-allotment';
                                break;

                            case 'TRAVELAGENT':
                                defIcon = 'icon-travel-agent';
                                $result.addClass("autocomplete-result");
                                if (item.address !== '') {
                                    var address = $("<span></span>").html(item.address);

                                    address.addClass("location");
                                    $result.append(address);
                                }
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
                        }

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

                $(el).autocomplete("instance")._resizeMenu = function() {
                    this.menu.element.css('height', 'auto');
                    if (($(el).offset().top - $(document).scrollTop() - this.menu.element.outerHeight()) <= 0) {
                        this.menu.element.outerHeight($(el).offset().top - $(document).scrollTop() - 10);
                    }
                };


                var isEmail = function(email) {
                    var regex = /\S+@\S+\.\S+/;

                    return regex.test(email);
                };
                var inst;

                if ( scope.insertEmail ) {
                    $(el).on('keypress', function(e) {
                        inst = $(el).autocomplete("instance");
                        if ( e.which === 13 ) {
                            if ( isEmail(inst.term) ) {
                                inst.options
                                    .select(e, {
                                        item: {
                                            label: inst.term,
                                            value: inst.term
                                        }
                                    });
                                inst.element.val('');
                            } else {
                                inst.element.val('');
                            }
                        }
                    });
                }
                

                scope.$on('$destroy', function() {
                    $(el).autocomplete( "destroy" );
                    scope.insertEmail && $(el).off('keypress');
                    // unbinding the touch move
                    if (ulElement instanceof HTMLElement) {
                        ulElement.off('touchmove');
                    }                    
                });                    
            }
        };
    }
]);