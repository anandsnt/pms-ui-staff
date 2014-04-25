admin.controller('ADRatesAddConfigureCtrl',['$scope', 'ADRatesConfigureSrv','ADRatesAddRoomTypeSrv','ngDialog', function($scope, ADRatesConfigureSrv, ADRatesAddRoomTypeSrv, ngDialog){
   $scope.sets = "";
   $scope.currentClickedSet = 0;
   $scope.selectedCalendarInitialData = {};
   

 	var dateRangeId = $scope.$parent.step.id;
    $scope.fetchSetsInDateRangeSuccessCallback = function(data){
    	$scope.$emit('hideLoader');
    	$scope.data = data;
    	 angular.forEach($scope.data.sets, function(value, key){
			 value.room_types = data.room_types;
		 });
		 var unwantedKeys = ["room_types"];
		$scope.data = dclone($scope.data, unwantedKeys);
    };
    $scope.fetchSetsInDateRangeFailureCallback = function(errorMessage){
    	$scope.$emit('hideLoader');
    };
    $scope.setCurrentClickedSet = function(index){
    	$scope.currentClickedSet = index;
    };
    
    $scope.unsetCurrentClickedSet = function(index){
    	$scope.currentClickedSet = -1;
    };

    $scope.fetchData = function(){
    	$scope.invokeApi(ADRatesConfigureSrv.fetchSetsInDateRange, {"id":dateRangeId},$scope.fetchSetsInDateRangeSuccessCallback,$scope.fetchSetsInDateRangeFailureCallback);	
		// $scope.invokeApi(ADRatesAddRoomTypeSrv.fetchRoomTypes, {}, $scope.fetchRoomTypesSuccessCallback, $scope.fetchRoomTypesFailureCallback);	
    	
    };
    $scope.fetchData();
    $scope.saveSetSuccessCallback = function(){
    	 $scope.$emit('hideLoader');
    };
    $scope.saveSetFailureCallback = function(errorMessage){
    	 $scope.$emit('hideLoader');
    	 $scope.errorMessage = errorMessage;
    	 $scope.$emit("errorReceived",errorMessage);
    };
    $scope.cancelClick = function(){
    	$scope.currentClickedSet = -1;
    };
    $scope.saveSet = function(index){

    	var	unwantedKeys = ["room_types"];
    	var setData = dclone($scope.data.sets[index], unwantedKeys);
    	$scope.updateData = setData;
    	$scope.updateData.room_rates = $scope.data.sets[index].room_types;
    	$scope.invokeApi(ADRatesConfigureSrv.saveSet, $scope.updateData, $scope.saveSetSuccessCallback, $scope.saveSetFailureCallback);
    	
    };
    $scope.moveAllSingleToDouble = function(index){
    	 angular.forEach($scope.data.sets[index].room_types, function(value, key){
			 value.double = value.single;
		 });
    };
    $scope.moveSingleToDouble = function(parentIndex, index){
    	$scope.data.sets[parentIndex].room_types[index].double = $scope.data.sets[parentIndex].room_types[index].single;
    };
    $scope.deleteSet = function(id, index){
    	var successDeleteCallBack = function(){
    		$scope.$emit('hideLoader');
    		var sets = $scope.data.sets;
    		$scope.data.sets.splice(index, 1);
    	};
    	$scope.invokeApi(ADRatesConfigureSrv.deleteSet,id, successDeleteCallBack );	
    };
    $scope.checkFieldEntered = function(index){
    	var enableSetUpdateButton = false;
    	
    	 angular.forEach($scope.data.sets[index].room_types, function(value, key){    	 	
    	 	if(value.hasOwnProperty("single") && value.single != ""){
    	 		enableSetUpdateButton = true;
    	 	}  
    	 	if(value.hasOwnProperty("double") && value.double != ""){
    	 		enableSetUpdateButton = true;
    	 	} 
    	 	if(value.hasOwnProperty("extra_adult") && value.extra_adult != ""){
    	 		enableSetUpdateButton = true;
    	 	} 	 
    	 	if(value.hasOwnProperty("child") && value.child != ""){
    	 		enableSetUpdateButton = true;
    	 	} 	
			
		 });
		 return enableSetUpdateButton;
		
    };

    $scope.saveWholeData = function(){
    	 angular.forEach($scope.data.sets, function(value, key){
			 $scope.saveSet(key);
		 });
    };
 

    
    $scope.popupCalendar = function(){

        ADRatesConfigureSrv.setCurrentSetData({'begin_date':$scope.step.begin_date,
                                                'end_date':$scope.step.end_date});
    	ngDialog.open({
    		 template: '/assets/partials/rates/adAddRatesCalendarPopup.html',
    		 controller: 'ADDateRangeModalCtrl',
			 className: 'ngdialog-theme-default calendar-modal'
    	});
    };
    $scope.toggleDays =  function(index, mod){
    	angular.forEach($scope.data.sets, function(value, key){
			 	$scope.data.sets[key][mod] =  false;
		 });
		 $scope.data.sets[index][mod] =  true;
    };

}]);


