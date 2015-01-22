admin.controller('ADTemplateConfigurationCtrl',['$scope', '$state', 'ADHotelListSrv', 'ADHotelConfigurationSrv', 'ngTableParams','$filter', '$anchorScroll', '$timeout', '$location',
  function($scope, $state, ADHotelListSrv, ADHotelConfigurationSrv, ngTableParams, $filter, $anchorScroll, $timeout, $location){
	
	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);
	
    /*
    * Variables set to show/hide forms 
    */ 	
	$scope.isAddmode = false;
	$scope.isEditmode = false;
   /*
    * Method to fetch all hotel brands
    */
	$scope.fetchHotelList = function(){
		var fetchSuccess = function(data) {
			$scope.$emit('hideLoader');
			$scope.data = data.hotels;
		};
		$scope.invokeApi(ADHotelListSrv.fetch, {}, fetchSuccess);
	};
	$scope.fetchHotelList();
	/*
    * To get brand details form - used for both add and edit
    */
	$scope.getTemplateUrl = function(){
		return "/assets/partials/templateConfiguration/adHotelConfigurationEdit.html";
	};
	$scope.editHotelConfiguration = function(index, hotelId){
		// $scope.currentClickedElement = index;
		// $scope.isEditmode = true;
		
		$scope.isAddmode = false;
		$scope.errorMessage ="";
		$scope.currentClickedElement = index;
		// $scope.editId = id;
		var postData = { 'hotel_id' : hotelId };
		var editHotelConfigurationSuccessCallback = function(data) {
			$scope.$emit('hideLoader');
			$scope.brandDetails   = data;
			$scope.formTitle = $scope.brandDetails.name;//To show brand name in title
			$scope.isEditmode = true;
		};		
		$scope.invokeApi(ADHotelConfigurationSrv.editHotelConfiguration,postData,editHotelConfigurationSuccessCallback);
		
		
		
	};
   
}]);

