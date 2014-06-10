sntRover.controller('RVReservationSummaryAndConfirmCtrl', ['$scope', 'RVReservationSummarySrv', 
					function($scope, RVReservationSummarySrv){
	BaseCtrl.call(this, $scope);

	$scope.init = function(){
		$scope.data = {};
		$scope.data.isConfirmationEmailSameAsGuestEmail = true;
		$scope.data.paymentMethods = [];

		$scope.$parent.myScrollOptions = {		
		    'reservationSummary': {
		    	scrollbars: true,
		        snap: false,
		        hideScrollbar: false,
		        preventDefault: false
		    }, 
		    'paymentInfo': {
		    	scrollbars: true,
		        snap: false,
		        hideScrollbar: false,
		        preventDefault: false
		    }, 
		};
		fetchPaymentMethods();
		
	}

	var fetchPaymentMethods = function(){
		var paymentFetchSuccess = function(data) {
			$scope.data.paymentMethods = data;
			console.log(JSON.stringify($scope.data.paymentMethods));
			$scope.$emit('hideLoader');
		};
		
		$scope.invokeApi(RVReservationSummarySrv.fetchPaymentMethods, {}, paymentFetchSuccess);

	};

	$scope.confirmEmailCheckboxClicked = function(){

		$scope.reservationData.guest.sendConfirmMailTo = '';
		if($scope.data.isConfirmationEmailSameAsGuestEmail) {
			$scope.reservationData.guest.sendConfirmMailTo = $scope.reservationData.guest.email;
		} 
	};

	var computeReservationDataToSave = function() {

	};

	$scope.clickedConfirmAndGoToDashboard = function() {
		var postData = computeReservationDataToSave();

	};

	$scope.init();

}]);