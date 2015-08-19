admin.controller('ADDeviceMappingsCtrl',['ngTableParams', '$scope', '$state', 'ADDeviceSrv', '$timeout', '$location', '$anchorScroll',
					function(ngTableParams, $scope, $state, ADDeviceSrv, $timeout, $location, $anchorScroll){

	$scope.errorMessage = '';
	ADBaseTableCtrl.call(this, $scope, ngTableParams);
	$scope.mapping = {};
	$scope.isAddMode = false;
	$scope.addEditTitle = "";
	$scope.isEditMode = false;
   /*
    * To fetch list of device mappings
    */
	$scope.listDevices = function($defer, params){
		var getParams = $scope.calculateGetParams(params);
		var fetchSuccessOfItemList = function(data){
			$scope.$emit('hideLoader');
			//No expanded rate view
			$scope.currentClickedElement = -1;
			$scope.totalCount = data.total_count;
			$scope.totalPage = Math.ceil(data.total_count/$scope.displyCount);
			$scope.data = data.work_stations;
			$scope.currentPage = params.page();
        	params.total(data.total_count);
        	$scope.isAddMode = false;
            $defer.resolve($scope.data);
		};
		$scope.invokeApi(ADDeviceSrv.fetch, getParams, fetchSuccessOfItemList);
	};


	$scope.loadTable = function(){
		$scope.tableParams = new ngTableParams({
		        page: 1,  // show first page
		        count: $scope.displyCount, // count per page
		        sorting: {
		            name: 'asc' // initial sorting
		        }
		    }, {
		        total: 0, // length of data
		        getData: $scope.listDevices
		    }
		);
	};

	$scope.loadTable();
	//To list device mappings
	/*
    * To render edit device mapping screen
    * @param {index} index of selected device mapping
    * @param {id} id of the device mapping
    */
	$scope.editDeviceMapping = function(index, id)	{
		$scope.mapping = {};
		$scope.currentClickedElement = index;
		$scope.isAddMode = false;
		$scope.isEditMode = true;
		$scope.addEditTitle = "EDIT";
	 	var successCallbackRender = function(data){
	 		$scope.mapping = data;
	 		$scope.$emit('hideLoader');
	 	};
	 	$scope.mapping.id = id;
	 	var data = {"id":id };
	 	$scope.invokeApi(ADDeviceSrv.getDeviceMappingDetails, data , successCallbackRender);
	};
   /*
    * Render add device mapping screen
    */
	$scope.addNewDeviceMapping = function()	{
		$scope.mapping={};
		$scope.currentClickedElement = "new";
		$scope.isAddMode = true;
		$scope.addEditTitle = "ADD";
		$scope.mapping = {};
		$timeout(function() {
            $location.hash('new-form-holder');
            $anchorScroll();
    	});
	};
   /*
    * To get the template of edit screen
    * @param {int} index of the selected department
    * @param {string} id of the department
    */
	$scope.getTemplateUrl = function(index, id){
		if(typeof index === "undefined" || typeof id === "undefined") {
			return "";
		}
		if($scope.currentClickedElement === index){
			 	return "/assets/partials/deviceMapping/adDeviceMappingDetails.html";
		}
	};

   /*
    * To handle click event
    */
	$scope.clickCancel = function(){
		$scope.isEditMode = false;
		$scope.currentClickedElement = -1;
	};
   /*
    * To delete department
    * @param {int} index of the selected department
    * @param {string} id of the selected department
    */
	$scope.deleteDeviceMapping = function(index, id){
		var successCallbackDelete = function(data){
	 		$scope.$emit('hideLoader');
	 		$scope.data.splice(index, 1);
	 		$scope.currentClickedElement = -1;
	 		$scope.totalCount--;
	 	};
		$scope.invokeApi(ADDeviceSrv.deleteDeviceMapping, id , successCallbackDelete);
	};
	/*
	 * To save mapping
	 */
	$scope.saveMapping = function(){
		var successCallbackSave = function(successData){
    		$scope.$emit('hideLoader');
			 if($scope.isAddMode){
				// // To add new data to scope
				var pushData = {
					"id":successData.id,
					"station_identifier": $scope.mapping.station_identifier,
					"name": $scope.mapping.name
				};
    			 $scope.data.push(pushData);
    			 $scope.totalCount++;
	    	 } else {
	    		// To update data with new value
	    		 $scope.data[parseInt($scope.currentClickedElement)].name = $scope.mapping.name;
	    		 $scope.data[parseInt($scope.currentClickedElement)].station_identifier = $scope.mapping.station_identifier;
	    	 }
    		$scope.currentClickedElement = -1;
    		$scope.isEditMode = false;
    	};
		var data = {
			"name": $scope.mapping.name,
			"identifier": $scope.mapping.station_identifier
		};
		if($scope.isAddMode){
			$scope.invokeApi(ADDeviceSrv.createMapping, data , successCallbackSave);
		} else {
			data.id = $scope.mapping.id;
			$scope.invokeApi(ADDeviceSrv.updateMapping, data , successCallbackSave);
		}
	};
}]);

