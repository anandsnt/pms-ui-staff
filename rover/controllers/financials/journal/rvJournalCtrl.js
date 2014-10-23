sntRover.controller('RVJournalController', ['$scope','$filter','$stateParams', 'ngDialog', '$rootScope','RVJournalSrv',	function($scope,$filter,$stateParams, ngDialog, $rootScope, RVJournalSrv) {
		
	BaseCtrl.call(this, $scope);	
	// Setting up the screen heading and browser title.
	$scope.$emit('HeaderChanged', $filter('translate')('MENU_JOURNAL'));
	$scope.setTitle($filter('translate')('MENU_JOURNAL'));
	$scope.activeTab = $stateParams.id=='' ? 0 : $stateParams.id;
	$scope.data = {};
	$scope.filterData = {};
	$scope.filterData = RVJournalSrv.fetchGenericData();
	console.log( $scope.filterData );
	$scope.data.fromDate = $rootScope.businessDate;
    $scope.data.toDate 	= $rootScope.businessDate;
    $scope.isActiveRevenueFilter = false;

	$scope.isDrawerOpened = false;
	var resizableMinHeight = 0;
	var resizableMaxHeight = 90;
	$scope.eventTimestamp ='';
	$scope.data.printBoxHeight =	resizableMinHeight;
	// Drawer resize options.
	$scope.resizableOptions = {
		minHeight: resizableMinHeight,
		maxHeight: resizableMaxHeight,
		handles: 's',
		resize: function(event, ui) {
			var height = $(this).height();
			if (height > 5){
				$scope.isDrawerOpened = true;
				$scope.data.printBoxHeight = height;
			}
			else if(height < 5){
				$scope.isDrawerOpened = false;
				$scope.data.printBoxHeight = 0;
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
			if($scope.data.printBoxHeight == resizableMinHeight || $scope.data.printBoxHeight == resizableMaxHeight) {
				if ($scope.isDrawerOpened) {
					$scope.data.printBoxHeight = resizableMinHeight;
					$scope.isDrawerOpened = false;
				}
				else if(!$scope.isDrawerOpened) {
					$scope.data.printBoxHeight = resizableMaxHeight;
					$scope.isDrawerOpened = true;
				}
			}
			else{
				// mid way click : close guest card
				$scope.data.printBoxHeight = resizableMinHeight;
				$scope.isDrawerOpened = false;
			}
		}
	};
	// To toggle revenue filter.
	$scope.clickedRevenueFilter = function(){
		$scope.isActiveRevenueFilter = !$scope.isActiveRevenueFilter;
	};
	$scope.clickedFromDate = function(){
		$scope.popupCalendar('FROM');
	};
	$scope.clickedToDate = function(){
		$scope.popupCalendar('TO');
	};
	// Calendar popup.
	$scope.popupCalendar = function(clickedOn) {
		$scope.clickedOn = clickedOn;
      	ngDialog.open({
	        template: '/assets/partials/financials/journal/rvJournalCalendarPopup.html',
	        controller: 'RVJournalDatePickerController',
	        className: 'single-date-picker',
	        scope: $scope
      	});
    };

}]);