admin.controller('ADRatesAddConfigureCtrl', ['$scope', '$rootScope', 'ADRatesConfigureSrv', 'ADRatesAddRoomTypeSrv', 'ADRatesRangeSrv','ngDialog', '$state',
    function ($scope, $rootScope, ADRatesConfigureSrv, ADRatesAddRoomTypeSrv, ADRatesRangeSrv, ngDialog, $state) {
        //expand first set
        $scope.currentClickedSet = 0;
        $scope.setChanged = false;
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
                if($scope.data.sets[$scope.data.sets.length - 1].id == null){
                    isSaved = false;
                }
                return isSaved;    
            }else{
                return true;    
            }
            

        };

        /**
        * Click handler for create new set button
        */
        $scope.createNewSetClicked = function(){

            if(!$scope.isAllSetsSaved()){
                return false;
            }
            var newSet = {};
            newSet.id = null;
            newSet.name = 'Set '+($scope.data.sets.length + 1);
            

            newSet.monday = true;
            newSet.tuesday = true;
            newSet.wednesday = true;
            newSet.thursday = true;
            newSet.friday = true;
            newSet.saturday = true;
            newSet.sunday = true;
            //The day will be enabled in current set, 
            //only if it is not enabled in any other sets in current date range 
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

            //Crate the room rates array based on the available room_types 
            for(var i in $scope.rateData.room_types){
                var roomType = {};
                roomType.id = $scope.rateData.room_types[i].id;
                roomType.name = $scope.rateData.room_types[i].name;
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

                $scope.data = updateSetsForAllSelectedRoomTypes(data);
                // Manually build room rates dictionary - if Add Rate
                angular.forEach($scope.data.sets, function (value, key) {
                    room_rates = []
                    if (value.room_rates.length === 0) {
                        angular.forEach($scope.rateData.room_types, function (room_type, key) {
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
                //Expand top set in the current date range
                $scope.setCurrentClickedSet(0);


            };
            // $scope.dateRange.id
            $scope.invokeApi(ADRatesConfigureSrv.fetchSetsInDateRange,
                {
                    "id": dateRangeId
                }, fetchSetsInDateRangeSuccessCallback);
        };

        //The Response from server may not have 
        //all the room_type details in in the set info.
        //Calculate the room_rates dict for all selected room_types (from $scope.rateData.room_types)
        var updateSetsForAllSelectedRoomTypes = function(data){
            var roomAddDetails = {};
            var roomRate = {};
            //Iterate through room types
            for(var i in $scope.rateData.room_types){

                //Iterate through sets
                for(var j in data.sets){
                    roomAddDetails = {};
                    var foundRoomType = false;

                    //Room rates in sets
                    for(var k in data.sets[j].room_rates){
                        roomRate = data.sets[j].room_rates[k];
                        //Round off the values to two decimal places
                        data.sets[j].room_rates[k].single = precisionTwo(roomRate.single);
                        data.sets[j].room_rates[k].double = precisionTwo(roomRate.double);
                        data.sets[j].room_rates[k].extra_adult = precisionTwo(roomRate.extra_adult);
                        data.sets[j].room_rates[k].child = precisionTwo(roomRate.child);

                        if($scope.rateData.room_types[i].id == roomRate.id){
                            foundRoomType = true;
                            continue;
                        }


                    }

                    //If the current room_type detail not available in the room_rates dict from server
                    //Add the room room_type to the set with details as empty.
                    if(!foundRoomType){
                        roomAddDetails.child = '';
                        roomAddDetails.double = '';
                        roomAddDetails.extra_adult = '';
                        roomAddDetails.single = '';
                        roomAddDetails.id = $scope.rateData.room_types[i].id;
                        roomAddDetails.name = $scope.rateData.room_types[i].name;
                        data.sets[j].room_rates.push(roomAddDetails);
                    }
                }
            }

            return data;
        };


        //Saves the individual set
        $scope.saveSet = function (dateRangeId, index) {

            var saveSetSuccessCallback = function (data) {
                $scope.$emit('hideLoader');
                $scope.data.sets[index].isSaved = true;
                if(typeof data.id != 'undefined' && data.id != '')
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
            setData.dateRangeId = dateRangeId;
            //if set id is null, then it is a new set - save it
            if(setData.id == null){
                $scope.invokeApi(ADRatesConfigureSrv.saveSet, setData, saveSetSuccessCallback);
            //Already existing set - update
            }else{
                $scope.invokeApi(ADRatesConfigureSrv.updateSet, setData, saveSetSuccessCallback);
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

            //if set id is null, then it is a new set - not saved, so delete directly
            if(id == null || typeof id == 'undefined'){
                $scope.data.sets.pop();
                $scope.setCurrentClickedSet($scope.data.sets.length - 1);
                return false;
            }

            //If not a new set, open a dialog to confirm the delete action    
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

        $scope.checkFieldEntered = function (index) {
            var enableSetUpdateButton = false;
            // if($scope.rateData.id == ""){
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
            // }
            if (enableSetUpdateButton && $scope.setChanged) {
                $scope.data.sets[index].isEnabled = true;
            } else {
                $scope.data.sets[index].isEnabled = false;
            }
            return enableSetUpdateButton;
        };

        $scope.popupCalendar = function () {
            ngDialog.open({
                template: '/assets/partials/rates/adAddRatesCalendarPopup.html',
                controller: 'ADDateRangeModalCtrl',
                className: 'ngdialog-theme-default calendar-modal',
                closeByDocument: false,
                scope: $scope
            });
        };

        //For a rate in a date range, a day can not be selected in more than one rate sets
        $scope.toggleDays = function (index, mod) {
            angular.forEach($scope.data.sets, function (value, key) {
                //Deselect the day in all sets other than current selected set.
                if(key != index){
                    $scope.data.sets[key][mod] = false;
                }
            });
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

        $scope.rateSetChanged = function(){
            $scope.setChanged = true;
        }

        $scope.closeDateRangeGrid = function(dateRange, index){
            $scope.activeDateRange = dateRange;
            $scope.activeDateRangeIndex = index;
            if($scope.setChanged){
                ngDialog.open({
                    template: '/assets/partials/rates/confirmRateSaveDialog.html',
                    className: 'ngdialog-theme-default',
                    scope: $scope
                });
            }
            $scope.setChanged = false;
        }

        $scope.init();
    }
]);
