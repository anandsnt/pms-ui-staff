admin.controller('ADRatesAddConfigureCtrl', ['$scope', '$rootScope', 'ADRatesConfigureSrv', 'ADRatesAddRoomTypeSrv', 'ADRatesRangeSrv','ngDialog', '$state',
    function ($scope, $rootScope, ADRatesConfigureSrv, ADRatesAddRoomTypeSrv, ADRatesRangeSrv, ngDialog, $state) {
        //expand first set
        $scope.currentClickedSet = 0;

        $scope.init = function(){
            // in edit mode last date range data will be expanded and details can't fetch by click
            // so intiating fetch data
            if($scope.rateMenu === ("dateRange." + $scope.dateRange.id)){
                fetchData($scope.dateRange.id);
            }
        };


        $scope.$on("needToShowDateRange", function(e, id){
            // webservice call to fetch each date range details
            fetchData(id);
        });

        // data range set expanded view
        $scope.setCurrentClickedSet = function (index) {
            $scope.currentClickedSet = index;
        };

        // data range set collapsed view
        $scope.unsetCurrentClickedSet = function (index) {
            $scope.currentClickedSet = -1;
        };

        // collapse current active date range set view
        $scope.cancelClick = function () {
            $scope.currentClickedSet = -1;
        };

        $scope.getDateRangeData = function(id){
            // webservice call to fetch each date range details
            fetchData(id);
            $scope.$emit('changeMenu', id)
        };

        /**
        * @retun true {Boolean} If all the sets are saved
        */
        $scope.isAllSetsSaved = function(){
            if($scope.data.sets != undefined){
                var isSaved = true;
                console.log($scope.data.sets);
                console.log($scope.data.sets[$scope.data.sets.length - 1]);
                if($scope.data.sets[$scope.data.sets.length - 1].id == null){
                    isSaved = false;
                }
                return isSaved;    
            }else{
                return true;    
            }
            

        };

        $scope.createNewSetClicked = function(){

            if(!$scope.isAllSetsSaved()){
                return false;
            }
            var newSet = {};
            newSet.id = null;
            newSet.name = '';
            
            newSet.monday = true;
            newSet.tuesday = true;
            newSet.wednesday = true;
            newSet.thursday = true;
            newSet.friday = true;
            newSet.saturday = true;
            newSet.sunday = true;

            for(var i in $scope.data.sets){
                if($scope.data.sets[i].monday == true){
                    newSet.monday = false;
                }
                if($scope.data.sets[i].tuesday == true){
                    newSet.tuesday = false;
                }
                if($scope.data.sets[i].wednesday == true){
                    newSet.wednesday = false;
                }
                if($scope.data.sets[i].thursday == true){
                    newSet.thursday = false;
                }
                if($scope.data.sets[i].friday == true){
                    newSet.friday = false;
                }
                if($scope.data.sets[i].saturday == true){
                    newSet.saturday = false;
                }
                if($scope.data.sets[i].sunday == true){
                    newSet.sunday = false;
                }
            }

            newSet.room_rates = [];

            for(var i in $scope.data.room_types){
                var roomType = {};
                roomType.id = $scope.data.room_types[i].id;
                roomType.name = $scope.data.room_types[i].name;
                roomType.child = '';
                roomType.double = '';
                roomType.extra_adult = '';
                roomType.single = '';
                newSet.room_rates.push(roomType);
            }

            $scope.data.sets.push(newSet);
            //Expand the current set
            $scope.setCurrentClickedSet($scope.data.sets.length - 1);
        };

        var fetchData = function (dateRangeId) {

            var fetchSetsInDateRangeSuccessCallback = function (data) {
                $scope.$emit('hideLoader');

                $scope.data = data;

                // Manually build room rates dictionary - if Add Rate
                angular.forEach($scope.data.sets, function (value, key) {


                    room_rates = []
                    if (value.room_rates.length === 0) {
                        angular.forEach($scope.data.room_types, function (room_type, key) {
                            data = {
                                "id": room_type.id,
                                "name": room_type.name,
                                "single": "",
                                "double": "",
                                "extra_adult": "",
                                "child": "",
                                "isSaved": false
                            }
                            room_rates.push(data);
                        });
                        value.room_rates = room_rates;
                    }
                });

            };
            // $scope.dateRange.id
            $scope.invokeApi(ADRatesConfigureSrv.fetchSetsInDateRange,
                {
                    "id": dateRangeId
                }, fetchSetsInDateRangeSuccessCallback);
        };



        $scope.saveSet = function (index) {

            var saveSetSuccessCallback = function (data) {
                $scope.$emit('hideLoader');
                $scope.data.sets[index].isSaved = true;
                $scope.data.sets[index].id = data.id;
            };

            var saveSetFailureCallback = function (errorMessage) {
                $scope.$emit('hideLoader');
                $scope.errorMessage = errorMessage;
                $scope.$emit("errorReceived", errorMessage);
            };

            // API request do not require all keys except room_types
            var unwantedKeys = ["room_types"];
            var setData = dclone($scope.data.sets[index], unwantedKeys);
            console.log(setData.id);
            //if set id is null, then it is a new set - save it
            if(setData.id == null){
                $scope.invokeApi(ADRatesConfigureSrv.saveSet, setData, saveSetSuccessCallback, saveSetFailureCallback);
            //Already existing set - update
            }else{
                $scope.invokeApi(ADRatesConfigureSrv.updateSet, setData, saveSetSuccessCallback, saveSetFailureCallback);
            }


        };

        $scope.moveAllSingleToDouble = function (index) {
            angular.forEach($scope.data.sets[index].room_rates, function (value, key) {
                if (value.hasOwnProperty("single") && value.single != "") {
                    value.double = value.single;
                }
            });
        };

        $scope.moveSingleToDouble = function (parentIndex, index) {
            if ($scope.data.sets[parentIndex].room_rates[index].single != "" && $scope.data.sets[parentIndex].room_rates[index].hasOwnProperty("single")) {
                $scope.data.sets[parentIndex].room_rates[index].double = $scope.data.sets[parentIndex].room_rates[index].single;
            }
        };

        $scope.confirmDeleteSet = function (id, index, setName) {
            $scope.deleteSetId = id;
            $scope.deleteSetIndex = index;
            $scope.deleteSetName = setName;
            ngDialog.open({
                template: '/assets/partials/rates/confirmDeleteSetDialog.html',
                controller: 'ADRatesAddConfigureCtrl',
                className: 'ngdialog-theme-default',
                scope: $scope
            });
        };

        $scope.closeConfirmDeleteSet = function(){
            ngDialog.close();
        };

        $scope.deleteSet = function () {
            var successDeleteCallBack = function () {
                $scope.$emit('hideLoader');
                $scope.$parent.data.sets.splice($scope.deleteSetIndex, 1);
                if ($scope.$parent.data.sets.length == 0){
                    $scope.$emit('deletedAllDateRangeSets', $scope.dateRange.id);
                }
                $scope.closeConfirmDeleteSet();
            };
            $scope.invokeApi(ADRatesConfigureSrv.deleteSet, $scope.deleteSetId, successDeleteCallBack);
        };


        $scope.checkFieldEntered = function (index) {
            var enableSetUpdateButton = false;
            angular.forEach($scope.data.sets[index].room_rates, function (value, key) {
                if (value.hasOwnProperty("single") && value.single != "") {
                    enableSetUpdateButton = true;
                }
                if (value.hasOwnProperty("double") && value.double != "") {
                    enableSetUpdateButton = true;
                }
                if (value.hasOwnProperty("extra_adult") && value.extra_adult != "") {
                    enableSetUpdateButton = true;
                }
                if (value.hasOwnProperty("child") && value.child != "") {
                    enableSetUpdateButton = true;
                }
            });
            if (enableSetUpdateButton) {
                $scope.data.sets[index].isEnabled = true;
            } else {
                $scope.data.sets[index].isEnabled = false;
            }
            return enableSetUpdateButton;
        };

        $scope.saveDateRange = function () {
            angular.forEach($scope.data.sets, function (value, key) {
                $scope.saveSet(key);
            });
        };

        $scope.popupCalendar = function () {
            ngDialog.open({
                template: '/assets/partials/rates/adAddRatesCalendarPopup.html',
                controller: 'ADDateRangeModalCtrl',
                className: 'ngdialog-theme-default calendar-modal',
                scope: $scope
            });
        };

        $scope.toggleDays = function (index, mod) {
            angular.forEach($scope.data.sets, function (value, key) {
                $scope.data.sets[key][mod] = false;
            });
            $scope.data.sets[index][mod] = true;
        };

        // check whether date range is past
        $scope.is_date_range_editable = function(date_range_end_date){
            if($scope.is_edit){
                if ($scope.rateData.based_on.id && $scope.rateData.rate_type.name != 'Specials & Promotions') { return false; }
                if (date_range_end_date && $scope.hotel_business_date){
                    return Date.parse(date_range_end_date) > Date.parse($scope.hotel_business_date)
                }
            }
            return true;
        };

        $scope.init();
    }
]);
