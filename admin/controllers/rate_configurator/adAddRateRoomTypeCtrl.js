admin.controller('ADAddRateRoomTypeCtrl',['$scope','ADRatesAddRoomTypeSrv', '$rootScope',
    function($scope,ADRatesAddRoomTypeSrv, $rootScope){



    var lastDropedTime = '';

    $scope.init = function () {
        $scope.selectedAssignedRoomIndex =-1;
        $scope.selectedUnAssignedRoomIndex =-1;
        $scope.nonAssignedroomTypes = [];
        $scope.assignedRoomTypes = [];
        $scope.availableRoomTypes = [];
        $scope.fetchAllRoomTypes();
    };

    /**
    * Method to fetch the list of room types available.
    * Assigned rooms and non assigned rooms are calculated using the roomlist ids in parent scope
    */
    $scope.fetchAllRoomTypes = function(){
        var fetchRoomTypesSuccessCallback = function(data){
            $scope.availableRoomTypes = data.results;
            $scope.calculateRoomLists();
            $scope.$emit('hideLoader');
        };

        $scope.invokeApi(ADRatesAddRoomTypeSrv.fetchRoomTypes, {},fetchRoomTypesSuccessCallback);

    };

    /*
    * Method ivoked after fetching the rate details
    */
    $scope.$on("ratesChanged", function(e){
        $scope.calculateRoomLists();
    });

    /*
    * Method ivoked after fetching the basedon rates
    */
    $scope.$on("basedonRatesChanged", function(e){
        $scope.calculateRoomLists();
    });

    /**
    * Method to calculate the assigned and non assigne roomlist.
    * Using the basedon defaults and rate defaults
    */
    $scope.calculateRoomLists = function(){
        $scope.nonAssignedroomTypes = [];
        $scope.assignedRoomTypes = [];
        angular.forEach($scope.availableRoomTypes, function(room_type){
        	//CICO-15809 : Exclude psudo roomtypes
        	if(room_type.is_pseudo){
				return true;
        	}

            if ($scope.rateData.room_type_ids.indexOf(room_type.id) >=0){
                $scope.assignedRoomTypes.push(room_type);
            } else if($scope.rateData.based_on.id === "" || $scope.rateData.based_on.is_copied){
                $scope.nonAssignedroomTypes.push(room_type);
            } else if($scope.basedonRateData.name !== undefined){
                //CICO-31088 - Added the based_on room types only for rates that are not copied from other rates(ie;only for based on rates)
                if($scope.rateData.based_on && !$scope.rateData.based_on.is_copied && $scope.basedonRateData.room_type_ids.indexOf(room_type.id) >= 0){
                    $scope.nonAssignedroomTypes.push(room_type);
                }
            }
       });

    };


    /**
    * Method to save the selected room types
    */

    $scope.saveRoomTypes = function(){
        var roomIdArray =[];
        var roomTypes = [];
        angular.forEach($scope.assignedRoomTypes, function(item){
            roomTypeItem = {"id": item.id, "name": item.name};
            roomTypes.push(roomTypeItem);
            roomIdArray.push(item.id);
        });
        var data = {
            'room_type_ids': roomIdArray,
            'id' : $scope.rateData.id
        };
        var saveRoomTypesSuccessCallback = function(data){
            $scope.$emit('hideLoader');
            $scope.rateData.room_types = roomTypes;
            $scope.rateData.room_type_ids = roomIdArray;
            //Navigate to next level. If date ranges are available move to config rate screen
            //If no date range added, move to add_date_range screen
            var menuName = "ADD_NEW_DATE_RANGE";
            if($scope.rateData.date_ranges.length > 0){
                var dateRangeId = $scope.rateData.date_ranges[$scope.rateData.date_ranges.length - 1].id;
                var menuName = dateRangeId;
                $rootScope.$broadcast("needToShowDateRange", dateRangeId);
            }
            $scope.$emit("changeMenu", menuName);
        };

        $scope.invokeApi(ADRatesAddRoomTypeSrv.saveRoomTypes, data, saveRoomTypesSuccessCallback);
    };

    /**
     * To handle drop success event
     *
     */
    $scope.dropSuccessHandler = function($event, index, array) {
        array.splice(index, 1);
    };
    /**
     * To handle on drop event
     *
     */
    $scope.onDrop = function($event, $data, array) {
        array.push($data);
    };

    /*
     * To check if any room is assigned
     *
     */
    $scope.anyRoomSelected = function(){

        if($scope.assignedRoomTypes.length >0) {
            return true;
        }
        else {
            return false;
        }
    };
    /*
     * To register selected assigned room
     *
     */

    $scope.assignedRoomSelected = function($event, index){

        if(lastDropedTime === ''){
            if(index === $scope.selectedAssignedRoomIndex) {
                $scope.selectedAssignedRoomIndex = -1;
            }
            else {
                $scope.selectedAssignedRoomIndex =index;
            }
        }
        else if(typeof lastDropedTime === 'object') { //means date
            var currentTime = new Date();
            var diff = currentTime - lastDropedTime;
            if(diff <= 100){
                $event.preventDefault();
            }
            else{
                lastDropedTime = '';
            }
        }


    };
    /*
     * To register selected unassigned room
     *
     */

    $scope.unAssignedRoomSelected = function($event, index){
    	//If base rate is selected, restrict the room types to the base rate
    	if($scope.hasBaseRate){
    		return false;
    	}
        if(lastDropedTime === ''){
            if(index === $scope.selectedUnAssignedRoomIndex) {
                $scope.selectedUnAssignedRoomIndex =-1;
            }
            else{
                $scope.selectedUnAssignedRoomIndex =index;
            }
        }
        else if(typeof lastDropedTime === 'object') { //means date
            var currentTime = new Date();
            var diff = currentTime - lastDropedTime;
            if(diff <= 100){
                $event.preventDefault();
            }
            else{
                lastDropedTime = '';
            }
        }


    };
    /*
     * To handle click action for selected room type
     *
     */

    $scope.topMoverightClicked = function(){

        if($scope.selectedUnAssignedRoomIndex !== -1){
            var temp = $scope.nonAssignedroomTypes[$scope.selectedUnAssignedRoomIndex];
            $scope.assignedRoomTypes.push(temp);
            $scope.nonAssignedroomTypes.splice($scope.selectedUnAssignedRoomIndex,1);
            $scope.selectedUnAssignedRoomIndex =-1;
        }
    };
    /*
     * To handle click action for selected room type
     *
     */
    $scope.topMoveleftClicked = function(){
        if($scope.selectedAssignedRoomIndex !== -1){
            var temp = $scope.assignedRoomTypes[$scope.selectedAssignedRoomIndex];
            $scope.nonAssignedroomTypes.push(temp);
            $scope.assignedRoomTypes.splice($scope.selectedAssignedRoomIndex,1);
            $scope.selectedAssignedRoomIndex =-1;
         }
    };
    /*
     * To handle click action to move all assigned room types
     *
     */

    $scope.bottomMoverightClicked = function(){
        if($scope.nonAssignedroomTypes.length>0){
            angular.forEach($scope.nonAssignedroomTypes, function(item){
            $scope.assignedRoomTypes.push(item);
     	});
            $scope.nonAssignedroomTypes = [];
        }
        $scope.selectedUnAssignedRoomIndex =-1;
    };
    /*
     * To handle click action to move all unassigned room types
     *
     */
    $scope.bottomMoveleftClicked = function(){
        if($scope.assignedRoomTypes.length>0){
            angular.forEach($scope.assignedRoomTypes, function(item){
               $scope.nonAssignedroomTypes.push(item);
             });
            $scope.assignedRoomTypes = [];
        }
        $scope.selectedAssignedRoomIndex =-1;

        };
    $scope.reachedAssignedRoomTypes = function(){
        $scope.selectedAssignedRoomIndex = -1;
        lastDropedTime = new Date();
    };
    $scope.reachedUnAssignedRoomTypes = function(){
        $scope.selectedUnAssignedRoomIndex = -1;
        lastDropedTime = new Date();
    };


    $scope.init();

}]);

