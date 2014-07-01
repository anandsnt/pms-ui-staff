admin.controller('adRatesEndDateValidationPopupController',['$scope','ngDialog',function($scope,ngDialog){

$scope.proceedSave = function(){
	ngDialog.close();
	$scope.$parent.startSave();
};
$scope.cancelClicked = function(){
	$scope.$parent.rateData.end_date = "";
	ngDialog.close();
};

}]);