sntRover.controller('RVReservationBaseSearchCtrl', ['$rootScope', '$scope', 'baseSearchData', 'RVReservationBaseSearchSrv', 'dateFilter','ngDialog',
    function($rootScope, $scope, baseSearchData, RVReservationBaseSearchSrv, dateFilter,ngDialog){
        BaseCtrl.call(this, $scope);

        //company card search query text
        $scope.companySearchText = "";
        $scope.companyLastSearchText = "";
        $scope.companyCardResults = [];

        // default max value if max_adults, max_children, max_infants is not configured
        var defaultMaxvalue = 5;

        var init = function(){
            $scope.reservationData.arrivalDate = dateFilter(new Date(), 'yyyy-MM-dd');
            $scope.setDepartureDate();
            $scope.otherData.roomTypes = baseSearchData.roomTypes;
            $scope.otherData.maxAdults = (baseSearchData.settings.max_guests.max_adults === null) ? defaultMaxvalue : baseSearchData.settings.max_guests.max_adults;
            $scope.otherData.maxChildren = (baseSearchData.settings.max_guests.max_children === null) ? defaultMaxvalue : baseSearchData.settings.max_guests.max_children;
            $scope.otherData.maxInfants = (baseSearchData.settings.max_guests.max_infants === null) ? defaultMaxvalue : baseSearchData.settings.max_guests.max_infants;
        };

        $scope.setDepartureDate = function(){
            if($scope.reservationData.numNights > 0){
                var tmpDate = new Date($scope.reservationData.arrivalDate);
                $scope.reservationData.departureDate = tmpDate.setDate(tmpDate.getDate() + parseInt($scope.reservationData.numNights));
            }
        }

        /*
        * company card search text entered
        */
        $scope.companySearchTextEntered = function(){
            if($scope.companySearchText.length === 0){
                $scope.companyCardResults = [];
                $scope.companyLastSearchText = "";
            }
            else{
                companyCardFetchInterval = window.setInterval(function() {
                    displayFilteredResults();
                }, 500);
            }
        };

        var displayFilteredResults = function(){
            if($scope.companySearchText !='' && $scope.companyLastSearchText != $scope.companySearchText){

                var successCallBackOfCompanySearch = function(data){
                    $scope.$emit("hideLoader");
                    angular.forEach(data.accounts, function(item){
                        var eachItem = {};
                        eachItem = {label: item.account_first_name+" "+item.account_last_name, value: item.id, image: item.company_logo}
                        $scope.companyCardResults.push(eachItem);
                    });
                }
                var paramDict = {'query': $scope.companySearchText.trim()};
                $scope.invokeApi(RVReservationBaseSearchSrv.fetchCompanyCard, paramDict, successCallBackOfCompanySearch);
                // we have changed data, so we dont hit server for each keypress
                $scope.companyLastSearchText = $scope.companySearchText;
                clearInterval(companyCardFetchInterval);
            }
        };

        $scope.autocompleteOptions = {
            delay: 0,
            position: { 
                my : 'left bottom', 
                at: 'left top',
                collision: 'flip'
            },
            source: $scope.companyCardResults,
        }

        // init call to set data for view 
        init();

        $scope.popupCalendar = function(){
            ngDialog.open({
             template: '/assets/partials/reservation/rvReservationCalendarPopup.html',
             controller: 'RVReservationDatePickerController',
             className: 'ngdialog-theme-default calendar-modal',
             closeByDocument: true,
             scope:$scope
    });
};
    }
]);
