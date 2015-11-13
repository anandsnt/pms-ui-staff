admin.controller('ADFloorsListCtrl',
    [   '$scope',
        '$state',
        'ADFloorSetupSrv',
        'ngTableParams',
        '$filter',
        '$anchorScroll',
        '$timeout',
        '$location',
        'adTransactionCenterSrv',
    function(
        $scope,
        $state,
        ADFloorSetupSrv,
        ngTableParams,
        $filter,
        $anchorScroll,
        $timeout,
        $location,
        adTransactionCenterSrv){

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
            activeTab: "MANAGE" // possible values are MANAGE for 'Manage Floors' & 'ASSIGN' for 'Assign Rooms'
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

    $scope.toggleAssignFloors = function(){
        if(adTransactionCenterSrv.isTransactionRunning('SELECT_ROOMS_IN_ASSIGN_FLOORS')){
            $scope.$broadcast('CONFIRM_USER_ACTION', {
                userAction : "MANAGE_FLOORS"
            });
        }else{            
            $scope.stateVariables.activeTab = $scope.stateVariables.activeTab === 'MANAGE' ?  'ASSIGN' : 'MANAGE';
        }
    }

	initializeMe();

}]);

