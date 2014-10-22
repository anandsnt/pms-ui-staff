sntRover.controller('RVJournalController', ['$scope','$filter','$stateParams', 'ngDialog', '$rootScope',	function($scope,$filter,$stateParams, ngDialog, $rootScope) {
		
	BaseCtrl.call(this, $scope);	
	// Setting up the screen heading.
	$scope.$emit('HeaderChanged', $filter('translate')('MENU_JOURNAL'));
	$scope.activeTab = $stateParams.id=='' ? 0 : $stateParams.id;
	$scope.data = {};
	$scope.fromDate = $rootScope.businessDate;
    $scope.toDate 	= $rootScope.businessDate;
    $scope.isActiveRevenueFilter = false;

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
			if (height > 5){
				$scope.isDrawerOpened = true;
				$scope.printBoxHeight = height;
			}
			else if(height < 5){
				$scope.isDrawerOpened = false;
				$scope.printBoxHeight = 0;
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
	$scope.clickedRevenueFilter = function(){
		$scope.isActiveRevenueFilter = !$scope.isActiveRevenueFilter;
	};
	// Calendar popup.
	$scope.popupCalendar = function() {
      	ngDialog.open({
	        template: '/assets/partials/financials/journal/rvJournalCalendarPopup.html',
	        controller: 'RVJournalDatePickerController',
	        className: 'single-date-picker',
	        scope: $scope
      	});
    };

}]);