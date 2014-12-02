admin.controller('ADDeviceMappingsCtrl',['$scope', '$state', 'ADDeviceSrv', '$timeout', '$location', '$anchorScroll', function($scope, $state, ADDeviceSrv, $timeout, $location, $anchorScroll){
	
	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);
	$scope.mapping = {};
	$scope.isAddMode = false;
	$scope.addEditTitle = "";
   /*
    * To fetch list of device mappings
    */
	$scope.listDevices = function(){
		var successCallbackFetch = function(data){
			$scope.$emit('hideLoader');
			$scope.data = data;
			$scope.currentClickedElement = -1;
			$scope.isAddMode = false;
		};
		$scope.invokeApi(ADDeviceSrv.fetch, {} , successCallbackFetch);	
	};
	//To list device mappings
	$scope.listDevices(); 
   /*
    * To render edit device mapping screen
    * @param {index} index of selected device mapping
    * @param {id} id of the device mapping
    */	
	$scope.editDeviceMapping = function(index, id)	{
		$scope.mapping = {};
		$scope.currentClickedElement = index;
		$scope.isAddMode = false;
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
		if(typeof index === "undefined" || typeof id === "undefined") return "";
		if($scope.currentClickedElement == index){ 
			 	return "/assets/partials/deviceMapping/adDeviceMappingDetails.html";
		}
	};
 
   /*
    * To handle click event
    */	
	$scope.clickCancel = function(){
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
	 		$scope.data.work_stations.splice(index, 1);
	 		$scope.currentClickedElement = -1;
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
					"station_identifier": $scope.mapping.name,
					"name":$scope.mapping.station_identifier
				};
    			 $scope.data.work_stations.push(pushData);
	    	 } else {
	    		// To update data with new value
	    		 $scope.data.work_stations[parseInt($scope.currentClickedElement)].name = $scope.mapping.name;
	    		 $scope.data.work_stations[parseInt($scope.currentClickedElement)].station_identifier = $scope.mapping.station_identifier;
	    	 }
    		$scope.currentClickedElement = -1;
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

