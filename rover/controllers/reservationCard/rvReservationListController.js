sntRover.controller('reservationListController',['$scope', function($scope){
	BaseCtrl.call(this, $scope);
	var scrollerOptions = {click: true, preventDefault: false};
	$scope.setScroller('resultListing', scrollerOptions);


	 //update left nav bar
	$scope.$emit("updateRoverLeftMenu","");

	$scope.$on('RESERVATIONLISTUPDATED', function(event) {
		setTimeout(function(){
			$scope.refreshScroller('resultListing');
			},
		500);

	});

}]);