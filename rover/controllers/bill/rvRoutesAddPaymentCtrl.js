sntRover.controller('rvRoutesAddPaymentCtrl',['$scope','$rootScope','$filter', 'ngDialog', function($scope, $rootScope,$filter, ngDialog){
	BaseCtrl.call(this, $scope);
	
		$scope.cancelClicked = function(){
			$scope.showPaymentList();
		};
		/**
	* setting the scroll options for the add payment view
	*/
	var scrollerOptions = { preventDefault: false};
  	$scope.setScroller('newpaymentview', scrollerOptions);	

  	setTimeout(function(){
				$scope.refreshScroller('newpaymentview');					
				}, 
			3000);
	
}]);