sntRover.controller('RVReservationBaseSearchCtrl', ['$rootScope', '$scope', 'baseSearchData', 'RVReservationBaseSearchSrv', 'dateFilter', 'ngDialog', '$state',

    function($rootScope, $scope, baseSearchData, RVReservationBaseSearchSrv, dateFilter, ngDialog, $state) {
        BaseCtrl.call(this, $scope);

        //company card search query text
        $scope.companySearch = {
            label: '',
            id: '',
        }
        $scope.companyLastSearchText = "";
        $scope.companyCardResults = [];

        // default max value if max_adults, max_children, max_infants is not configured
        var defaultMaxvalue = 5;

        var companyCardFetchInterval = null;

        var init = function() {
            $scope.reservationData.arrivalDate = dateFilter(new Date(), 'yyyy-MM-dd');
            $scope.setDepartureDate();
            $scope.otherData.roomTypes = baseSearchData.roomTypes;
            $scope.otherData.maxAdults = (baseSearchData.settings.max_guests.max_adults === null) ? defaultMaxvalue : baseSearchData.settings.max_guests.max_adults;
            $scope.otherData.maxChildren = (baseSearchData.settings.max_guests.max_children === null) ? defaultMaxvalue : baseSearchData.settings.max_guests.max_children;
            $scope.otherData.maxInfants = (baseSearchData.settings.max_guests.max_infants === null) ? defaultMaxvalue : baseSearchData.settings.max_guests.max_infants;
            $scope.otherData.fromSearch = false;
        };

        $scope.setDepartureDate = function() {
            if ($scope.reservationData.numNights > 0) {

                //TO DO:Delete the 2 lines,if the below one works is right

                // var tmpDate = new Date($scope.reservationData.arrivalDate);
                // $scope.reservationData.departureDate = tmpDate.setDate(tmpDate.getDate() + parseInt($scope.reservationData.numNights));


                var newDate = new Date();
                newDay = newDate.getDate() + parseInt($scope.reservationData.numNights);
                newDate.setDate(newDay);
                $scope.reservationData.departureDate = dateFilter(new Date(newDate), 'yyyy-MM-dd');

            } else {
                $scope.reservationData.departureDate = "";
            }
        }

        /*
         * company card search text entered
         */
        $scope.companySearchTextEntered = function() {

            // var notBackSpace = (arguments[0].keyCode || arguments[0].which !== 8) ? true : false;

            if ($scope.companySearch.label.length === 0) {
                $scope.companyCardResults = [];
                $scope.companyLastSearchText = "";
            } else if ($scope.companySearch.label.length > 2) {
                companyCardFetchInterval = window.setInterval(function() {
                    displayFilteredResults();
                }, 500);
            }
        };

        $scope.navigate = function() {
            var successCallBack = function() {
                $state.go('rover.reservation.mainCard.roomType');
            }
            $scope.invokeApi(RVReservationBaseSearchSrv.chosenDates, {
                fromDate: $scope.reservationData.arrivalDate,
                toDate: $scope.reservationData.departureDate
            }, successCallBack);
        }

        var displayFilteredResults = function() {
            if ($scope.companySearch.label != '' && $scope.companyLastSearchText != $scope.companySearch.label) {

                var successCallBackOfCompanySearch = function(data) {
                    $scope.$emit("hideLoader");

                    angular.forEach(data.accounts, function(item) {
                        var eachItem = {};
                        eachItem = {
                            label: item.account_first_name + " " + item.account_last_name,
                            value: item.account_first_name + " " + item.account_last_name,
                            image: item.company_logo
                        }
                        $scope.companyCardResults.push(eachItem);

                        // remove duplicates
                        // and woohoo it worked
                        // thanks again underscore.js
                        $scope.companyCardResults = _.unique($scope.companyCardResults);
                    });
                }
                var paramDict = {
                    'query': $scope.companySearch.label.trim()
                };
                $scope.invokeApi(RVReservationBaseSearchSrv.fetchCompanyCard, paramDict, successCallBackOfCompanySearch);
                // we have changed data, so we dont hit server for each keypress
                $scope.companyLastSearchText = $scope.companySearch.label;
                clearInterval(companyCardFetchInterval);
            }
        };

        $scope.autocompleteOptions = {
            delay: 0,
            position: {
                my: 'left bottom',
                at: 'left top',
                collision: 'flip'
            },
            source: $scope.companyCardResults,
            select: function(event, ui) {
                $scope.companySearch.label = ui.item.label;
                $scope.companySearch.id = ui.item.id;
                return false;
            }
        }

        // init call to set data for view 
        init();

        $scope.popupArrivalDateCalendar = function() {
            ngDialog.open({
                template: '/assets/partials/reservation/rvReservationCalendarPopup.html',
                controller: 'RVReservationArrivalDatePickerController',
                className: 'ngdialog-theme-default calendar-modal reservation-calendar',
                closeByDocument: true,
                scope: $scope
            });
        };

        $scope.popupDepartureDateCalendar = function() {
            ngDialog.open({
                template: '/assets/partials/reservation/rvReservationCalendarPopup.html',
                controller: 'RVReservationDepartureDatePickerController',
                className: 'ngdialog-theme-default calendar-modal reservation-calendar',
                closeByDocument: true,
                scope: $scope
            });
        };


    }
]);

// This code will be assimilated, resistance is futile
// Code will be assimilated to become part of a better 
// auto complete feature
sntRover.directive('autoComplete', function() {
    return {
        restrict: 'A',
        scope: {
            autoOptions: '=autoOptions'
        },
        link: function(scope, el, attrs) {
            $(el).autocomplete(scope.autoOptions)
                .data('ui-autocomplete')
                ._renderItem = function(ul, item) {
                    ul.addClass('find-cards');

                    var $result = $("<a></a>").text(item.label),
                        $image = '<img src="../images/' + item.image + '" />';

                    $($image).prependTo($result);

                    return $('<li></li>').append($result).appendTo(ul);
            };
        }
    };
});