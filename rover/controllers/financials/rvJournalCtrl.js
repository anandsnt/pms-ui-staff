sntRover.controller('RVJournalController', ['$scope','$filter','$stateParams', 'ngDialog', '$rootScope',	function($scope,$filter,$stateParams, ngDialog, $rootScope) {
		
	BaseCtrl.call(this, $scope);	
	// Setting up the screen heading.
	$scope.$emit('HeaderChanged', $filter('translate')('MENU_JOURNAL'));
	$scope.activeTab = $stateParams.id=='' ? 0 : $stateParams.id;

	$scope.isDrawerOpened = false;
	var resizableMinHeight = 0;
	var resizableMaxHeight = 90;
	$scope.eventTimestamp ='';
	$scope.printBoxHeight =	resizableMinHeight;
	// Drawer resize options.
	$scope.resizableOptions = {
		minHeight: resizableMinHeight,
		maxHeight: resizableMaxHeight,
		handles: 's',
		resize: function(event, ui) {
			var height = $(this).height();
			$scope.printBoxHeight = height;
			if (height > 5){
				$scope.isDrawerOpened = true;
			}
			else if(height < 5){
				$scope.isDrawerOpened = false;
			}
		},
		stop: function(event, ui) {
			preventClicking = true;
			$scope.eventTimestamp = event.timeStamp;
		}
	};
	// To handle click on drawer handle - open/close.
	$scope.clickedDrawer = function($event){
		$event.stopPropagation();
		$event.stopImmediatePropagation();
		if(getParentWithSelector($event, document.getElementsByClassName("ui-resizable-handle")[0])){
			if(parseInt($scope.eventTimestamp)) {
				if(($event.timeStamp - $scope.eventTimestamp)<2){
					return;
				}
			}
			if($scope.printBoxHeight == resizableMinHeight || $scope.printBoxHeight == resizableMaxHeight) {
				if ($scope.isDrawerOpened) {
					$scope.printBoxHeight = resizableMinHeight;
					$scope.isDrawerOpened = false;
				}
				else if(!$scope.isDrawerOpened) {
					$scope.printBoxHeight = resizableMaxHeight;
					$scope.isDrawerOpened = true;
				}
			}
			else{
				// mid way click : close guest card
				$scope.printBoxHeight = resizableMinHeight;
				$scope.isDrawerOpened = false;
			}
		}
	};
	// Calendar popup.
	$scope.popupCalendar = function() {
      	ngDialog.open({
	        template: '/assets/partials/financials/rvJournalCalendarPopup.html',
	        controller: 'RVJournalDatePickerController',
	        className: 'single-date-picker',
	        scope: $scope
      	});
    };

    $scope.date = $rootScope.businessDate;

}]);