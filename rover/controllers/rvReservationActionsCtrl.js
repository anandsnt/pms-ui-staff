sntRover.controller('reservationActionsController', 
	[
		'$rootScope',
		'$scope',
		'ngDialog',
		'rvChargeItems',
		function($rootScope, $scope, ngDialog, rvChargeItems) {
			BaseCtrl.call(this, $scope);
			
			$scope.displayTime = function(status){
				var display = false;
				if(status == 'CHECKEDIN' || status == 'CHECKING_OUT'){
					display = true;
				}
				return display;
			};
			$scope.displayBalance = function(status){
				var display = false;
				if(status == 'CHECKING_IN' || status == 'CHECKEDIN' || status == 'CHECKING_OUT'){
					display = true;
				}
				return display;
			};
			$scope.getBalanceAmountColor = function(balance){
				var balanceClass = "";
				if(balance == 0 || balance == 0.00 || balance == 0.0){
					balanceClass = "green";
				} else {
					balanceClass = "red";
				}
				return balanceClass;
			};
			
			$scope.displayAddon = function(status){
				var display = false;
				if(status == 'RESERVED' || status == 'CHECKING_IN' || status == 'CHECKEDIN' || status == 'CHECKING_OUT'){
					display = true;
				}
				return display;
			};
			
			$scope.displayAddCharge = function(status){
				var display = false;
				
				if(status == 'RESERVED' || status == 'CHECKING_IN' || status == 'CHECKEDIN' || status == 'CHECKING_OUT' || status == 'NOSHOW_CURRENT'){
					display = true;
				}
				return display;
			};
			
			$scope.displayArrivalTime = function(status){
				var display = false;
				if(status == 'CHECKING_IN' || status == 'NOSHOW_CURRENT' ){
					display = true;
				}
				return display;
			};
			
			$scope.getArrivalTimeColor = function(time){
				var timeColor = "";
				if(time!=null){
					timeColor = "time";
				}
				return timeColor;
			};
			$scope.openPostCharge = function() {
				var reservation_id = $scope.reservationData.reservation_card.reservation_id;
				var callback = function(data) {
				    $scope.$emit( 'hideLoader' );

				    $scope.fetchedData = data;

		    		ngDialog.open({
		        		template: '/assets/partials/postCharge/postCharge.html',
		        		controller: 'RVPostChargeController',
		        		scope: $scope
		        	});
				};

				$scope.invokeApi(rvChargeItems.fetch, reservation_id, callback);
			};
		
		}
	]
);