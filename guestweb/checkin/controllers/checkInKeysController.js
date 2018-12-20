/*
	Checkin keys Ctrl 
	This is the final screen for the checkin operations.
	It will have two types of responses. Some hotels may have QR code facility, so the HTML will
	display the QR code ,else the text enterd in room key delivery in the admin setting will be shown as text.
*/
(function() {
	var checkInKeysController = function($scope, $rootScope, $http, $location, checkinDetailsService, checkinKeysService, $state, sntIDCollectionUtilsSrv) {

	$scope.pageValid = false;
	$rootScope.userEmail = ($rootScope.userEmail === null ) ? "" : $rootScope.userEmail;
	// CICO-30872 ..this need to be done in a better way when doing octopus
	// now the variable names are confusing
	// this has to be set to false as the CC page is expecting that variable to do
	// checkin now or later
	$rootScope.isAutoCheckinOn = false;

	// CICO-34045 we should allow the user to enter their email address if it is not on the database
	var originsNeedEmailEntering = ["SMS", "EMAIL", "URL"];

    // collect oustanding stay total
    if ($state.href('balancePaymentCCCollection') !== null && parseFloat($rootScope.outStandingBalance) > 0 &&
        $rootScope.isMLI && $rootScope.collectOutStandingBalance && !$rootScope.skipBalanceCollection) {
        $state.go('balancePaymentCCCollection');
    }
	// sell addons
	else if ($state.href("offerAddonOptions") !== null && $rootScope.isAddonUpsellActive && !$rootScope.skipedAddons) {
		$state.go('offerAddonOptions', {
			'isFrom': 'checkinNow'
		});
	}
	// if prompt for cc is turned on
	// we will always ask for CC addition in case of MLI
	else if ($state.href('checkinCcVerification') !== null && $rootScope.collectCCOnCheckin && $rootScope.isMLI && !$rootScope.isCcAttachedFromGuestWeb ) {
		$state.go('checkinCcVerification');
	}
	// CICO-34045 we should allow the user to enter their email address if it is not on the database
	else if ($state.href('emailAddition') !== null && $rootScope.offerRoomDeliveryOptions && !$rootScope.userEmailEntered && originsNeedEmailEntering.indexOf($rootScope.application) > -1) {
		$state.go('emailAddition', {'isFrom': 'checkinNow'});// if user has not attached an email
	}
	else if ($rootScope.isCheckedin) {
		$state.go('checkinSuccess');
	}
	// Collect guest ID
	else if ($state.href('sntIDScan') !== null && $rootScope.id_collection_enabled && !$rootScope.idScanComplete && sntIDCollectionUtilsSrv.isInMobile()) {
		$state.go('sntIDScan', {
				params: JSON.stringify({"mode": "CHECKIN"})
			});
	}
	else {
		$scope.pageValid = true;
	}

	if ($scope.pageValid) {

	// set up flags related to webservice
	$scope.isPosting     = true;
	$rootScope.netWorkError  = false;
	$scope.responseData  = [];
	$scope.reservationData = checkinDetailsService.getResponseData();
	var url = '/guest_web/checkin.json';
	var data = {'reservation_id': $rootScope.reservationID};

	checkinKeysService.checkin(url, data).then(function(response) {
		if (response.status === "failure") {
			$rootScope.netWorkError  = true;
		}
		else {
			$rootScope.isCheckedin = true;
			$scope.responseData = response.data;
		}
		$scope.isPosting = false;

	}, function() {
		$scope.isPosting = false;
		$rootScope.netWorkError  = true;     
	});

}

};

var dependencies = [
'$scope', '$rootScope', '$http', '$location', 'checkinDetailsService', 'checkinKeysService', '$state', 'sntIDCollectionUtilsSrv',
checkInKeysController
];

sntGuestWeb.controller('checkInKeysController', dependencies);
})();
