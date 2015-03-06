sntRover.controller('rvActivityLogCtrl',[
	'$scope',
	'$rootScope',
	'$filter', 
	function($scope, $rootScope ,$filter){
	$scope.reportUpdateVisible = false;
	
	var resizableMinWidth = 30;
    var resizableMaxWidth = 260;
    $scope.reportUpdateWidth = resizableMinWidth;
    /**
     * scroller options
     */
    $scope.resizableOptions = {
        minWidth: resizableMinWidth,
        maxWidth: resizableMaxWidth,
        handles: 'e',
        resize: function(event, ui) {

        },
        stop: function(event, ui) {
            preventClicking = true;
            $scope.eventTimestamp = event.timeStamp;
        }
    }

    $scope.accordionInitiallyNotCollapsedOptions = {
        header: 'a.toggle',
        heightStyle: 'content',
        collapsible: true,
        activate: function(event, ui) {
            if (isEmpty(ui.newHeader) && isEmpty(ui.newPanel)) { //means accordion was previously collapsed, activating..
                ui.oldHeader.removeClass('active');
            } else if (isEmpty(ui.oldHeader)) { //means activating..
                ui.newHeader.addClass('active');
            }
            $scope.refreshScroll();
        }

    };

	// set a back button on header
	$rootScope.setPrevState = {
		title: $filter('translate')('STAY_CARD'),
		callback: 'backToStayCard',
		scope: $scope
	};
		
	BaseCtrl.call(this, $scope);
	$scope.errorMessage = '';
	var title = $filter('translate')('ROOM_ASSIGNMENT_TITLE');
	$scope.setTitle(title);

	/**
	* function to go back to reservation details
	*/
	$scope.backToStayCard = function(){
		
		$state.go("rover.reservation.staycard.reservationcard.reservationdetails", {id:$scope.reservationData.reservation_card.reservation_id, confirmationId:$scope.reservationData.reservation_card.confirmation_num});
		
	};

	$scope.clickedOnReportUpdate = function($event) {
        if (getParentWithSelector($event, document.getElementsByClassName("ui-resizable-e")[0])) {
            if ($scope.reportUpdateVisible) {
                $scope.reportUpdateWidth = resizableMinWidth;
                $scope.reportUpdateVisible = false;
            } else {
                $scope.reportUpdateVisible = true;
                $scope.reportUpdateWidth = resizableMaxWidth;
            }
        }
    };

    $scope.$on('closeSidebar', function() {
        $scope.reportUpdateWidth = resizableMinWidth;
        $scope.reportUpdateVisible = false;
    });

	$scope.init = function(){
		$scope.$emit('HeaderChanged', $filter('translate')('ACTIVITY_LOG_TITLE'));
	};
	$scope.init();

}]);