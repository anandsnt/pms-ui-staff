admin.controller('ADFloorsListCtrl',
    [   '$scope',
        '$state',
        'ADFloorSetupSrv',
        'ngTableParams',
        '$filter',
        '$anchorScroll',
        '$timeout',
        '$location',
        '$state',
    function(
        $scope,
        $state,
        ADFloorSetupSrv,
        ngTableParams,
        $filter,
        $anchorScroll,
        $timeout,
        $location,
        $state){

	BaseCtrl.call(this, $scope);

	/**
	* set of initial settings
	*/
	var initializeMe = function() {
        $scope.errorMessage = '';
		//To list room types
		$scope.listFloorTypes();

        //show Table
        $scope.showTableDetails = false;

        $scope.stateVariables = {
            activeTab: "MANAGE", // possible values are MANAGE for 'Manage Floors' & 'ASSIGN' for 'Assign Rooms'
            areUncommitedSelectedRoomsPresent: false
        };

	};

    /**
    * go to add screen
    */
    $scope.gotoAddFloor = function() {
        $state.go ('admin.addFloor');
    };

    /**
    * Edit Floor screen
    */
    $scope.gotoEditFloor = function(id) {
        $state.go ('admin.editFloor', {id: id});
    };

    /**
    * initialize table in view
    */
    $scope.setUptable = function(){
        $scope.tableParams = new ngTableParams({
           page: 1,            // show first page
            count:  $scope.data.floors.length,    // count per page - Need to change when on pagination implemntation
            sorting: { floor_number: 'asc'     // initial sorting
            }
        }, {
            total: $scope.data.floors.length,
            counts: [], // hides page sizes
            getData: function($defer, params) {
                // use build-in angular filter
                var orderedData = params.sorting() ?
                                    $filter('orderBy')($scope.data.floors, params.orderBy()) :
                                    $scope.data.floors;

                $scope.orderedData =  $scope.data.floors;

                $defer.resolve(orderedData);
                $scope.showTableDetails = true;
            }
        });
    };

    /**
    * To fetch list of room types
    */
	$scope.listFloorTypes = function(){
		var successCallbackFetch = function(data){
			$scope.data = data;
            $scope.floorsList = $scope.data.floors;
            $scope.setUptable ();
		};

        var options = {
            successCallBack:    successCallbackFetch
        };
        $scope.callAPI(ADFloorSetupSrv.fetch, options);
	};

    /*
    * To delete a floor
    */
    $scope.deleteFloor = function(index){

        var unwantedKeys = [];
        var data = {};
        data.id = $scope.orderedData[index].id;
        var successCallbackSave = function(){
            $scope.$emit('hideLoader');
            var pos = $scope.data.floors.indexOf($scope.orderedData[index]);
            $scope.data.floors.splice(pos, 1);
            $scope.tableParams.reload();
        };
        $scope.invokeApi(ADFloorSetupSrv.deleteFloor, data , successCallbackSave);
    };

    $scope.$on("ASSIGNMENT_CHANGED",function(){
         $scope.listFloorTypes();
    });

    $scope.$on("UNCOMMITED_SELECTED_ROOMS_IN_FLOOR_ASSIGNEMENT",function(){
         $scope.stateVariables.areUncommitedSelectedRoomsPresent = true;
    });

    $scope.$on("ZERO_SELECTED_ROOMS_IN_FLOOR_ASSIGNEMENT",function(){
         $scope.stateVariables.areUncommitedSelectedRoomsPresent = false;
    });

    $scope.toggleAssignFloors = function(){
        if($scope.stateVariables.activeTab === 'ASSIGN' && $scope.stateVariables.areUncommitedSelectedRoomsPresent){
            $scope.$broadcast('CONFIRM_USER_ACTION', "MANAGE_FLOORS");
        }else{            
            $scope.stateVariables.activeTab = $scope.stateVariables.activeTab === 'MANAGE' ?  'ASSIGN' : 'MANAGE';
        }
    }

	initializeMe();

}]);

