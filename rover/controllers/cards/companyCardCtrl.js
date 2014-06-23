sntRover.controller('RVCompanyCardCtrl', ['$scope', 'RVCompanyCardSrv',
	function($scope, RVCompanyCardSrv) {

		$scope.searchMode = false;
		$scope.currentSelectedTab = 'cc-contact-info';


		// $scope.contactInformation = $scope.companyContactInformation;


		$scope.switchTabTo = function($event, tabToSwitch) {
			$event.stopPropagation();
			$event.stopImmediatePropagation();
			$scope.currentSelectedTab = tabToSwitch;
		};

		var presentContactInfo = {};


		$scope.initCompanyCard = function() {

			var successCallbackOfInitialFetch = function(data) {
				$scope.$emit("hideLoader");
				$scope.contactInformation = data;
				// if (typeof $stateParams.id !== 'undefined' && $stateParams.id !== "") {
				// 	$scope.companyContactInformation.id = $stateParams.id;
				// }
				//taking a deep copy of copy of contact info. for handling save operation
				//we are not associating with scope in order to avoid watch
				presentContactInfo = JSON.parse(JSON.stringify($scope.contactInformation));
			};
			var data = {
				'id': $scope.reservationDetails.companyCard.id
			};

			$scope.invokeApi(RVCompanyCardSrv.fetchContactInformation, data, successCallbackOfInitialFetch);
		}


		/**
		 * remaining portion will be the Controller class of company card's contact info
		 */
		/**
		 * success callback of initial fetch data
		 */


		$scope.initCompanyCard();


	}
]);