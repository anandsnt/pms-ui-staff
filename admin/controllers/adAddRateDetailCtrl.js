admin.controller('ADaddRatesDetailCtrl',['$scope','ADRatesAddDetailsSrv',  function($scope,ADRatesAddDetailsSrv){

$scope.init = function(){
	BaseCtrl.call(this, $scope);
	if (!$scope.rateId){
		$scope.rateTypesDetails = [];
		$scope.basedOnRateTypeSelected = '';
		$scope.rateTypeselected ='';
		$scope.rate_name = '';
		$scope.rate_description = '';
		$scope.based_on_plus_minus ='+';
		$scope.based_on_value ='';
		$scope.based_on_type = 'amount';
		$scope.isFirstTime = true;
		$scope.errorMessage = "";
	}	
		$scope.step1Data = {
			'name':$scope.rate_name,
			'type':$scope.rateTypeselected,
			'basedOn':'',
			'description':$scope.rate_description
		};
};
$scope.init();
/*
   * check if fields are not null
   */

$scope.allFieldsnotFilled = function(){
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

/*
   * fetch details
   */

$scope.fetchData = function(){
	
	var fetchRateTypesSuccessCallback = function(data){
		$scope.rateTypesDetails = data;
		$scope.$emit('hideLoader');
	};
	var fetchRateTypesFailureCallback = function(data){
		$scope.$emit('hideLoader');
	};
	$scope.invokeApi(ADRatesAddDetailsSrv.fetchRateTypes, {},fetchRateTypesSuccessCallback,fetchRateTypesFailureCallback);	
	
}	

$scope.fetchData();

/*
   * save step1
   */

$scope.saveStep1 = function(){

	var amount = parseInt($scope.based_on_plus_minus + $scope.based_on_value);

	if($scope.basedOnRateTypeSelected)
		var basedOn_id = $scope.basedOnRateTypeSelected;

	var data = 
	{   'name': $scope.rate_name,
		'description': $scope.rate_description,
		'rate_type_id': $scope.rateTypeselected,
		'based_on_rate_id': basedOn_id,
		'based_on_type': $scope.based_on_type,
		'based_on_value': amount
	};

	//createNewRate
	var createNewRateSuccessCallback = function(data){
		$scope.newRateId = data.id;
		$scope.isFirstTime = false;
		$scope.$emit('hideLoader');
		$scope.$emit("updateIndex",{'id':'1','rateId':$scope.newRateId});
		$scope.$emit("updateBasedonRate", basedOn_id, $scope.based_on_plus_minus, $scope.based_on_type, $scope.based_on_value);

	};
	var createNewRateFailureCallback = function(data){
		$scope.$emit('hideLoader');
		$scope.$emit("errorReceived",data);
	};
	var updateRateSuccessCallback = function(data){
		$scope.$emit('hideLoader');
		$scope.$emit("updateIndex",{'id':'1','rateId':$scope.newRateId});
		$scope.$emit("updateBasedonRate", basedOn_id, $scope.based_on_plus_minus, $scope.based_on_type, $scope.based_on_value);

	};
	var updateRateFailureCallback = function(data){
		$scope.$emit('hideLoader');
		$scope.$emit("errorReceived",data);
	};
	if($scope.isFirstTime)
	 $scope.invokeApi(ADRatesAddDetailsSrv.createNewRate,data,createNewRateSuccessCallback,createNewRateFailureCallback);	
	else{
	 var updatedData = {'updatedData': data,
						'rateId':$scope.newRateId
					 };
	 $scope.invokeApi(ADRatesAddDetailsSrv.updateNewRate,updatedData,updateRateSuccessCallback,updateRateFailureCallback);	
     }	
};
}]);

