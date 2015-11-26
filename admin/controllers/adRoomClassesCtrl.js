admin.controller('ADRoomClassListCtrl',['$scope', '$state', 'ADRoomClassesSrv', '$location', '$anchorScroll', '$timeout',  function($scope, $state, ADRoomClassesSrv, $location, $anchorScroll, $timeout){

	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);
	$scope.departmentData = {};
	$scope.isAddMode = false;
   /*
    * To fetch list of room class
    */
	$scope.listRoomClass = function(){
		var successCallbackFetch = function(data){
			$scope.$emit('hideLoader');
			console.log(data);
			$scope.roomClasses = data;
			$scope.currentClickedElement = -1;
			$scope.isAddMode = false;
		};
		$scope.invokeApi(ADRoomClassesSrv.fetch, {} , successCallbackFetch);
	};
	//To list room class
	$scope.listRoomClass();
   /*
    * To render edit room class screen
    * @param {index} index of selected room class
    * @param {id} id of the room class
    */
	$scope.editRoomClass = function(index, id)	{
		$scope.roomClassData = {};
		$scope.currentClickedElement = index;
		$scope.isAddMode = false;
	 	var successCallbackRender = function(data){
	 		$scope.roomClassData = data;
	 		$scope.$emit('hideLoader');
	 	};
	 	var data = {"id":id };
	 	$scope.invokeApi(ADRoomClassesSrv.fetchDetailsOfRoomClass, data , successCallbackRender);
	};
   /*
    * Render add room class screen
    */
	$scope.addNew = function()	{
		$scope.roomClassData={};
		$scope.currentClickedElement = "new";
		$scope.isAddMode = true;
		$timeout(function() {
            $location.hash('new-form-holder');
            $anchorScroll();
    	});
	};
   /*
    * To get the template of edit screen
    * @param {int} index of the selected room class
    * @param {string} id of the room class
    */
	$scope.getTemplateUrl = function(index, id){
		if(typeof index === "undefined" || typeof id === "undefined") {
			return "";
		}
		if($scope.currentClickedElement === index){
			return "/assets/partials/roomClass/adRoomClassEdit.html";
		}
	};
  /*
   * To save/update room class details
   */
   $scope.saveRoomClass = function(){
    	var successCallbackSave = function(response){
    		$scope.$emit('hideLoader');
			if($scope.isAddMode){
				// To add new data to scope
    			$scope.roomClasses.push(response.data);
	    	} else {
	    		//To update data with new value
	    		$scope.roomClasses[parseInt($scope.currentClickedElement)].code = $scope.roomClassData.code;
	    		$scope.roomClasses[parseInt($scope.currentClickedElement)].description = $scope.roomClassData.description;
	    	}
    		$scope.currentClickedElement = -1;
    	};
    	if($scope.isAddMode){
    		$scope.invokeApi(ADRoomClassesSrv.saveClassRoom, $scope.roomClassData , successCallbackSave);
    	} else {
    		$scope.invokeApi(ADRoomClassesSrv.updateClassRoom, $scope.roomClassData , successCallbackSave);
    	}
    };
   /*
    * To handle click event
    */
	$scope.clickCancel = function(){
		$scope.currentClickedElement = -1;
	};
   /*
    * To delete room class
    * @param {int} index of the selected room class
    * @param {string} id of the selected room class
    */
	$scope.deleteRoomClass = function(index, id){
		var successCallbackDelete = function(data){
	 		$scope.$emit('hideLoader');
	 		$scope.roomClasses.splice(index, 1);
	 		$scope.currentClickedElement = -1;
	 	};
		$scope.invokeApi(ADRoomClassesSrv.deleteClassRoom, id , successCallbackDelete);
	};
}]);

