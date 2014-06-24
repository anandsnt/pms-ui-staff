sntRover.controller('RVCompanyCardCtrl', ['$scope', 'RVReservationAllCardsSrv',
	function($scope, RVReservationAllCardsSrv) {
		$scope.searchMode = true;
		$scope.currentSelectedTab = 'cc-contact-info';

		// initialize company search fields
		$scope.companySearchIntiated = false;
		$scope.companies = [];


		var presentContactInfo = {};

		//handle tab switching in both cards
		$scope.switchTabTo = function($event, tabToSwitch) {
			$event.stopPropagation();
			$event.stopImmediatePropagation();
			if ($scope.currentSelectedTab == 'cc-contact-info' && tabToSwitch !== 'cc-contact-info') {
				saveContactInformation($scope.contactInformation);
				$scope.$broadcast("contractTabActive");
			}
			if ($scope.currentSelectedTab == 'cc-contracts' && tabToSwitch !== 'cc-contracts') {
				$scope.$broadcast("contactTabActive");
			}
			$scope.currentSelectedTab = tabToSwitch;
		};

		$scope.$on('companyCardAvailable', function() {
			$scope.searchMode = false;
			$scope.contactInformation = $scope.companyContactInformation;
			presentContactInfo = $scope.contactInformation;
			$scope.$broadcast("contactTabActive");
		});

		$scope.$on("cardDetached", function() {
			$scope.searchMode = true;
		});

		$scope.$on("companySearchInitiated", function() {
			$scope.companySearchIntiated = true;
			// console.log($scope.searchedCompanies)
			$scope.companies = $scope.searchedCompanies;
		})

		$scope.$on("companySearchStopped", function() {
			$scope.companySearchIntiated = false;
			// console.log($scope.searchedCompanies)
			$scope.companies = $scope.searchedCompanies;
		})


		/**
		 * function used to save the contact data, it will save only if there is any
		 * change found in the present contact info.
		 */
		var saveContactInformation = function(data) {
			var dataUpdated = false;
			if (!angular.equals(data, presentContactInfo)) {
				dataUpdated = true;
			}
			if (dataUpdated) {
				var dataToSend = JSON.parse(JSON.stringify(data));
				for (key in dataToSend) {
					if (typeof dataToSend[key] !== "undefined" && data[key] != null && data[key] != "") {
						//in add case's first api call, presentContactInfo will be empty object					
						if (JSON.stringify(presentContactInfo) !== '{}') {
							for (subDictKey in dataToSend[key]) {
								if (typeof dataToSend[key][subDictKey] === 'undefined' || dataToSend[key][subDictKey] === presentContactInfo[key][subDictKey]) {
									delete dataToSend[key][subDictKey];
								}
							}
						}
					} else {
						delete dataToSend[key];
					}
				}
				if (typeof dataToSend.countries !== 'undefined') {
					delete dataToSend['countries'];
				}
				dataToSend.account_type = $stateParams.type;
				console.log(dataToSend);
				$scope.invokeApi(RVCompanyCardSrv.saveContactInformation, dataToSend, successCallbackOfContactSaveData, failureCallbackOfContactSaveData);
			}
		};
	}
]);