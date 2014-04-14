admin.controller('ADaddRatesDetailCtrl',['$scope','ADRatesAddDetailsSrv',  function($scope,ADRatesAddDetailsSrv){

	$scope.init = function(){
		$scope.rateTypes = [];
		$scope.basedOn = [];
		$scope.basedOnRateList = [];
		$scope.basedOnRateTypeSelected = '';
		$scope.rateTypeselected ='';
		$scope.rate_name = '';
		$scope.rate_description = '';
		$scope.based_on_plus_minus ='+';
		$scope.based_on_value ='';
		$scope.based_on_type = 'amount';
		$scope.isFirstTime = true;
	
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
			// angular.forEach($scope.basedOn,function(item, index) {
 		// 	if (item.rate_type !== null) {
 		// 		$scope.basedOnRateList.push(item);
 		// 	}
 		// });

		};
		var fetchBasedOnFailureCallback = function(data){
			$scope.$emit('hideLoader');
		};
		$scope.invokeApi(ADRatesAddDetailsSrv.fetchBasedOnTypes, {},fetchBasedOnSuccessCallback,fetchBasedOnFailureCallback);	
	}	

	$scope.fetchData();

	$scope.saveStep1 = function(){

		var amount = $scope.based_on_plus_minus + $scope.based_on_value;
		var data = 
		{   'name': $scope.rate_name,
			'description': $scope.rate_description,
			'rate_type_id': $scope.rateTypeselected.id,
			'based_on_rate_id': $scope.basedOnRateTypeSelected.id,
			'based_on_type': $scope.based_on_type,
			'based_on_value': amount
		};

		//createNewRate


		var createNewRateSuccessCallback = function(data){
			
			$scope.newRateId = data.id;
			$scope.isFirstTime = false;
			$scope.$emit('hideLoader');
			$scope.$emit("updateIndex","1");
		};
		var createNewRateFailureCallback = function(data){
			$scope.$emit('hideLoader');
		};

		var createUpdateRateSuccessCallback = function(data){
			$scope.$emit('hideLoader');
			$scope.$emit("updateIndex","1");
		};
		var createUpdateRateFailureCallback = function(data){
			$scope.$emit('hideLoader');
		};
		if($scope.isFirstTime)
		 $scope.invokeApi(ADRatesAddDetailsSrv.createNewRate,data,createUpdateRateSuccessCallback,createUpdateRateFailureCallback);	
		else{

		 var updatedData = {'updatedData': data,
							'rateId':$scope.newRateId
						 };
		 $scope.invokeApi(ADRatesAddDetailsSrv.updateNewRate,updatedData,createNewRateSuccessCallback,createNewRateFailureCallback);	
	     }	
	}


}]);

