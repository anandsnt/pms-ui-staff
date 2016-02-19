/*
	Checkin options Ctrl 
	There are two options 1) checkin now 2)  checkin later
*/

(function() {
	var checkinOptionsController = function($scope,$rootScope,$state) {
		$rootScope.checkinOptionShown = true;

		var earlyCheckinOn = true;
		var isInEarlyCheckinWindow = true;
		var offerEci = false;


		var assignRoom = function(type){
			var onFailre = function(){
				
			};
			var onSuccess = function(){

			};
		};



		$scope.checkinNow = function(){
			if(earlyCheckinOn && isInEarlyCheckinWindow){
				if(offerEci){
					assignRoom('offerEci');
				}
				else{
					assignRoom('noEci');
				}
			}
			else{
				assignRoom('earlyCheckinOff');
			}
		};

		$scope.checkinLater = function(){
			$state.go('checkinArrival');
		};
};

var dependencies = [
'$scope','$rootScope','$state',
checkinOptionsController
];

sntGuestWeb.controller('checkinOptionsController', dependencies);
})();