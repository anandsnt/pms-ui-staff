sntRover.controller('RVJournalController', ['$scope','$filter','$stateParams',	function($scope,$filter,$stateParams) {
		
	BaseCtrl.call(this, $scope);	
	// Setting up the screen heading.
	$scope.$emit('HeaderChanged', $filter('translate')('MENU_JOURNAL'));
	
	$scope.activeTab = $stateParams.id=='' ? 0 : $stateParams.id;
	$scope.printBoxClass = '';
	var resizableMinHeight = 0;
	var resizableMaxHeight = 90;

	$scope.resizableOptions = {
			minHeight: resizableMinHeight,
			maxHeight: resizableMaxHeight,
			handles: 's',
			resize: function(event, ui) {
				$scope.printBoxClass = 'open';
			},
			stop: function(event, ui) {
				preventClicking = true;
				$scope.eventTimestamp = event.timeStamp;
			}
	};

	$scope.closeDrawer = function(event){
		console.log("clicked closeDrawer");
		$scope.printBoxHeight = resizableMinHeight;
		$scope.printBoxClass = '';
	};


}]);