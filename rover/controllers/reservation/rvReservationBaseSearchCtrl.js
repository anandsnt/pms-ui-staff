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
            $scope.otherData.fromSearch = true;
        };



        $scope.setDepartureDate = function() {
            if ($scope.reservationData.numNights > 0) {

                //TO DO:Delete the 2 lines,if the below one works is right

                // var tmpDate = new Date($scope.reservationData.arrivalDate);
                // $scope.reservationData.departureDate = tmpDate.setDate(tmpDate.getDate() + parseInt($scope.reservationData.numNights));


                var newDate = new Date($scope.reservationData.arrivalDate);
                newDay = newDate.getDate() + parseInt($scope.reservationData.numNights);
                newDate.setDate(newDay);
                $scope.reservationData.departureDate = dateFilter(new Date(newDate), 'yyyy-MM-dd');

            } else {
                $scope.reservationData.departureDate = "";
            }
        }

        $scope.arrivalDateChanged = function(){
                $scope.setDepartureDate();
        };

        /*
         * company card search text entered
         */
        $scope.companySearchTextEntered = function() {

            // var notBackSpace = (arguments[0].keyCode || arguments[0].which !== 8) ? true : false;

            if ($scope.companySearch.label.length === 0) {
                $scope.companyCardResults = [];
                $scope.companyLastSearchText = "";
            } else if ($scope.companySearch.label.length > 1) {
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


        $scope.arrivalDateOptions = {
        
             showOn          : 'button',
             dateFormat      : 'mm-dd-yy',
             numberOfMonths  : 2,
             yearRange       : '-0:+0',
             minDate         : 0,
            beforeShow: function(input, inst){
                $('#ui-datepicker-div').addClass('reservation arriving');
                $('<div id="ui-datepicker-overlay" class="transparent" />').insertAfter('#ui-datepicker-div');
            },

            onClose: function(dateText, inst){ 
                $('#ui-datepicker-div').removeClass('reservation arriving');
                $('#ui-datepicker-overlay').remove();
            }

        };

        $scope.departureDateOptions = {
        
            showOn          : 'button',
            dateFormat      : 'mm-dd-yy',
            numberOfMonths  : 2,
            yearRange       : '-0:+0',
            minDate         : 0,
            beforeShow: function(input, inst){
                $('#ui-datepicker-div').addClass('reservation departing');
                $('<div id="ui-datepicker-overlay" class="transparent" />').insertAfter('#ui-datepicker-div');
            },

            onClose: function(dateText, inst){ 
                $('#ui-datepicker-div').removeClass('reservation departing');
                $('#ui-datepicker-overlay').remove();
            }

        };

    }
]);

// This code will be assimilated, resistance is futile
// Code will be assimilated to become part of a better 
// auto complete feature
sntRover.directive('autoComplete', ['highlightFilter', function(highlightFilter) {
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
                        $image = '<img src="' + item.image + '" />';

                    $($image).prependTo($result);

                    return $('<li></li>').append($result).appendTo(ul);
            };
        }
    };
}]);
