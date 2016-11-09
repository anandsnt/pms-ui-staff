/*
	email entry Ctrl where the email is added
*/

(function() {
	var mobileEntryController = function($scope, $modal, guestDetailsService, $state, $rootScope) {
		


    var invalidMobileAlert = {
      backdrop: true,
      backdropClick: true,
      templateUrl: '/assets/checkin/partials/ccErrorModal.html',
      controller: ccVerificationModalCtrl,
      resolve: {
        errorMessage: function() {
          return "Please Enter a valid Mobile Number.";
        }
      }
    };
    var mobileNumberSaveFailedAlert = {
      backdrop: true,
      backdropClick: true,
      templateUrl: '/assets/checkin/partials/ccErrorModal.html',
      controller: ccVerificationModalCtrl,
      resolve: {
        errorMessage: function() {
          return "There is a problem saving your mobile number. Please retry.";
        }
      }
    };

    $scope.guestDetails = { "mobile": ""};
    $scope.mobileUpdated = false;
    $scope.country_code  = "";

    $scope.countryChanged = function() {
      $scope.dial = _.find($scope.countryDetails, function(countryDetails) { return countryDetails.countrycode === $scope.country_code;}).dial;
    };


    
    guestDetailsService.fetchCountryCode().then(function(response) {
      $scope.countryDetails = response;
      $scope.isLoading = false;
    }, function() {
      $scope.netWorkError = true;
      $scope.isLoading = false;
    });

    function ValidateNo() {
        var val = $scope.guestDetails.mobile;

        if (/^[0-9]{1,15}$/.test(val)) {
            return true;
        } else {
            $modal.open(invalidMobileAlert);
            return false;
        }
    }

    $scope.mobileSubmitted = function() {

    	if(ValidateNo()) {
        guestDetailsService.postGuestDetails({"mobile": $scope.dial+"-"+$scope.guestDetails.mobile}).then(function(response) {
          $scope.isLoading = false;
          $scope.mobileUpdated = true;
          $rootScope.userMobile = $scope.guestDetails.mobile;
        }, function() {
          $scope.isLoading = false;
          $modal.open(mobileNumberSaveFailedAlert);
        });
    	}
    };

    $scope.continueClicked =  function() {
      $rootScope.userMobileSkipped = true;
      $state.go('preCheckinStatus');
    };
    $scope.changeMobile =  function() {
       $scope.mobileUpdated = false;
    };
};

var dependencies = [
'$scope', '$modal', 'guestDetailsService', '$state', '$rootScope',
mobileEntryController
];

sntGuestWeb.controller('mobileEntryController', dependencies);
})();