angular.module('sntRover').directive('autoCompleteReservations', ['RVSearchSrv', 'highlightFilter',
    function (RVSearchSrv, highlightFilter) {

        return {
            restrict: 'A',
            require: 'ngModel',
            templateUrl: "/assets/directives/autocomplete/rvAutoCompleteReservations/rvAutoCompleteReservations.html",
            link: function (scope, el, attrs, ngModel) {
                BaseCtrl.call(this, scope);

                var lastSearchText = "",
                    refreshTemplate = function () {
                        if (!scope.$$phase) {
                            scope.$digest();
                        }
                    },
                    reservationsACSourceHandler = function (request, response) {
                        if (request.term.length === 0) {
                            ngModel.$setViewValue(null);
                            scope.guestName = null;
                        } else if (request.term.length > 0 && lastSearchText !== request.term) {
                            ngModel.$setViewValue(null);
                            var onSearchReservationSuccess = function (results) {
                                lastSearchText = request.term;
                                response(results);
                            };

                            scope.callAPI(RVSearchSrv.fetch, {
                                params: {
                                    'query': request.term,
                                    'is_minimal': true
                                },
                                successCallBack: onSearchReservationSuccess
                            });
                        }
                    }, reservationsACSelectHandler = function (event, selection) {
                        scope.guestName = selection.item.lastname + ', ' + selection.item.firstname;
                        ngModel.$setViewValue(angular.copy(selection.item));
                        refreshTemplate();
                        return false;
                    };

                scope.guestName = "";

                el.find("input").autocomplete({
                    delay: scope.delay ? 600 : parseInt(scope.delay),
                    minLength: scope.minLengthToTrigger ? 0 : parseInt(scope.minLengthToTrigger),
                    position: {
                        my: "right top",
                        at: "right bottom",
                        collision: 'flip'
                    },
                    source: reservationsACSourceHandler,
                    select: reservationsACSelectHandler
                }).data('ui-autocomplete')._renderItem = function (ul, item) {
                    var reservation = angular.element('<a></a>'),
                        avatar = angular.element('<figure></figure>', {
                            class: "guest-image"
                        }),
                        guestName = angular.element('<span></span>', {
                            class: "name",
                            html: highlightFilter(item.firstname + ' ' + item.lastname, lastSearchText)
                        }),
                        roomNumber = angular.element('<span></span>', {
                            class: "room",
                            html: item.room ? "Room " + highlightFilter(item.room, lastSearchText) : ''
                        });
                    _.each(item.images, function (image) {
                        avatar.append(angular.element('<img>', {
                            src: image.guest_image
                        }));
                    });

                    ul.addClass("find-guest");
                    avatar.append(angular.element('<img>'))
                    reservation.append(avatar).append(guestName).append(roomNumber);

                    return angular.element('<li></li>').append(reservation).appendTo(ul);
                };

                scope.$on('$destroy', function () {
                    el.find("input").autocomplete("destroy");
                });

                ngModel.$render = function () {
                    // Clear up the guest name if the model is cleared from the controller end
                    if(!ngModel.$viewValue){
                        scope.guestName = null;
                    }
                };
            }
        };
    }]);

