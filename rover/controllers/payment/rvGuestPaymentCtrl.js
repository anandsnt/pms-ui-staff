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

		// NOTE: Need to send payment methods from here
		$scope.callAPI(RVPaymentSrv.renderPaymentScreen, {
			params:{"direct_bill": false},
			onSuccess : function(response) {
				var creditCardPaymentTypeObj = _.find(response, function(obj){ return obj.name === 'CC' });
				var passData = {
					"guest_id": $scope.guestCardData.contactInfo.user_id,
					"isFromGuestCard": true,
					"details":{
						"firstName" : $scope.guestCardData.contactInfo.first_name,
						"lastName" : $scope.guestCardData.contactInfo.last_name
					}
				};
				var paymentData = $scope.paymentData;
				// NOTE : As of now only guest cards can be added as payment types and associated with a guest card
				paymentData.paymentTypes = [creditCardPaymentTypeObj];
				$scope.openPaymentDialogModal(passData, paymentData);
			}
		});
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