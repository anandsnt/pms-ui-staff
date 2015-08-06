sntRover.controller('RVPaymentGuestCtrl',['$rootScope', '$scope', '$state', 'RVPaymentSrv','ngDialog','RVReservationCardSrv', function($rootScope, $scope, $state, RVPaymentSrv, ngDialog, RVReservationCardSrv){
	BaseCtrl.call(this, $scope);


	$scope.$on('clearNotifications',function(){
    	$scope.errorMessage ="";
    	$scope.successMessage ="";
    });

	/*
	 * To open new payment modal screen from guest card
	 */

	$scope.updateErrorMessage = function(message){
		$scope.errorMessage = message;
	};
	$scope.openAddNewPaymentModel = function(data){

	 	var passData = {
 		"guest_id": $scope.guestCardData.contactInfo.user_id,
 		"isFromGuestCard": true,
 		"details":{
 			"firstName" : $scope.guestCardData.contactInfo.first_name,
 			"lastName" : $scope.guestCardData.contactInfo.last_name
 		}
	 	};
	 	var paymentData = $scope.paymentData;
	 	$scope.openPaymentDialogModal(passData, paymentData);

  	 };
  	 /*
	 * To open set as as primary or delete payment
	 */
  	 $scope.openDeleteSetAsPrimaryModal = function(id, index){
  	 	  $scope.paymentData.payment_id = id;
  	 	  $scope.paymentData.index = index;

		  ngDialog.open({
	               template: '/assets/partials/payment/rvDeleteSetAsPrimary.html',
	               controller: 'RVDeleteSetAsPrimaryCtrl',
	               scope:$scope
	          });
  	 };
  	 var scrollerOptions = {preventDefault: false};
  	$scope.setScroller('paymentList', scrollerOptions);
  	$scope.$on("$viewContentLoaded", function(){
		$scope.refreshScroller('paymentList');
	});
   	$scope.$on("REFRESHLIKESSCROLL", function(){
		$scope.refreshScroller('paymentList');
	});


	 $scope.$on('ADDEDNEWPAYMENTTOGUEST', function(event, data){
	 	if(typeof $scope.paymentData.data === "undefined"){
	 			$scope.paymentData.data = [];
	 	};
	 	$scope.paymentData.data.push(data);
	 	$scope.refreshScroller('paymentList');
	 });




}]);