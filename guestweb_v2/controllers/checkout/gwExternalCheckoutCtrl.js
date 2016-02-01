/*
	External verification Ctrl 
	The landing page when the guestweb is accessed without the link from the email.
	This is accessed using URL set in admin settings WEB CHECK OUT URL in admin -> zest -> Checkout
*/


sntGuestWeb.controller('gwExternalCheckoutVerificationCtrl', ['$scope','$state',
 function($scope,$state) {

	// Calendar toggle actions and date select action
	$scope.showCalender = function(){
		loseFocus();// focusout the input fields , so as to fix cursor being shown above the calendar
		$scope.calendarView = true;
	};
	$scope.closeCalender = function(){
		$scope.calendarView = false;
	};
	$scope.dateChoosen = function(){
		$scope.stayDetails.arrival_date = ($filter('date')($scope.date, $rootScope.dateFormat));
		dateToSend = dclone($scope.date,[]);
		dateToSend = ($filter('date')(dateToSend,'yyyy-MM-dd'));
		$scope.closeCalender();
	};

	// On submitting we will be checking if the details eneterd matches any reservations
	// If matches will return the reservation details and we save it for future usage
	$scope.submit = function(){

	};

}]);

// sntGuestWeb.controller('verificationErrorController', ['$scope', function($scope) {

// 	$scope.doneClicked = function(){

// 	};

// }]);

// // controller for the modal

//   var verificationModalCtrl = function ($scope, $modalInstance,$state) {

//     $scope.closeDialog = function () {
//       $modalInstance.dismiss('cancel');
//     };

//   };