admin.controller('ADaddRatesDetailCtrl',['$scope','ADRatesAddDetailsSrv',  function($scope,ADRatesAddDetailsSrv){

	$scope.init = function(){
		$scope.rateTypes = [];
		$scope.basedOn = [];
		$scope.basedOnRateList = [];
		$scope.basedOnRateTypeSelected = '';
		$scope.rateTypeselected ='';
		$scope.rate_name = '';
		$scope.rate_description = '';
	
		$scope.step1Data = {
			'name':$scope.rate_name,
			'type':$scope.rateTypeselected,
			'basedOn':'',
			'description':$scope.rate_description
		};
	}
	$scope.init();


	$scope.allFieldsFilled = function(){

		if($scope.rate_name && $scope.rate_description && $scope.rateTypeselected){

		if(($scope.rate_name.length > 0) && ($scope.rate_description.length > 0)
			&&  ($scope.rateTypeselected.length > 0)){
			return false;
		}
		}
		else{
			return true;
		}
	};


	$scope.fetchData = function(){
		
		var fetchRateTypesSuccessCallback = function(data){
			$scope.rateTypes = data;
			$scope.$emit('hideLoader');
		};
		var fetchRateTypesFailureCallback = function(data){
			$scope.$emit('hideLoader');
		};
		$scope.invokeApi(ADRatesAddDetailsSrv.fetchRateTypes, {},fetchRateTypesSuccessCallback,fetchRateTypesFailureCallback);	

		var fetchBasedOnSuccessCallback = function(data){
			$scope.basedOn=data.results;
			$scope.$emit('hideLoader');
			angular.forEach($scope.basedOn,function(item, index) {
 			if (item.rate_type !== null) {
 				$scope.basedOnRateList.push(item);
 			}
 		});

		};
		var fetchBasedOnFailureCallback = function(data){
			$scope.$emit('hideLoader');
		};
		$scope.invokeApi(ADRatesAddDetailsSrv.fetchBasedOnTypes, {},fetchBasedOnSuccessCallback,fetchBasedOnFailureCallback);	
	}	

	$scope.fetchData();

	$scope.saveStep1 = function(){
		$scope.$emit("updateIndex","1");
		
	}

}]);

