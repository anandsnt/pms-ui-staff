sntRover.controller('RVReservationBaseSearchCtrl', ['$scope', 'RVReservationBaseSearchSrv', 
    function($scope, RVReservationBaseSearchSrv){
        BaseCtrl.call(this, $scope);

        $scope.reservation.selectedRoomType = '';
        $scope.reservation.selectedMaxAdults = '';
        $scope.reservation.selectedMaxChildren = '';
        $scope.reservation.selectedMaxinfants = '';
        //company card search query text
        $scope.companySearchText = "";
        $scope.companyLastSearchText = "";
        $scope.companyCardResults = [];

        var fetchBaseSearchData = function(){
            var fetchBaseSearchDataSuccess = function(data){
                $scope.$emit('hideLoader');
                $scope.roomTypes = data.roomTypes;
                $scope.maxAdults = (data.settings.max_guests.max_adults === null) ? '' : data.settings.max_guests.max_adults;
                $scope.maxChildren = (data.settings.max_guests.max_children === null) ? '' : data.settings.max_guests.max_children;
                $scope.maxInfants = (data.settings.max_guests.max_infants === null) ? '' : data.settings.max_guests.max_infants;
            }
            $scope.invokeApi(RVReservationBaseSearchSrv.fetchHotelDetails, {}, fetchBaseSearchDataSuccess);
        }

        $scope.range = function(min, max){
            var input = [];
            for (var i=min; i<=max; i++) input.push(i);
            return input;
        };

        /**
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
                    $scope.companyCardResults = data.accounts;
                }
                var paramDict = {'query': $scope.companySearchText.trim()};
                $scope.invokeApi(RVReservationBaseSearchSrv.fetchCompanyCard, paramDict, successCallBackOfCompanySearch);
                // we have changed data, so we dont hit server for each keypress
                $scope.companyLastSearchText = $scope.companySearchText;
                clearInterval(companyCardFetchInterval);
            }
        };

        $scope.autocompleteOptions = {
            source: $scope.companyCardResults
        }

        fetchBaseSearchData();
    }
]);
