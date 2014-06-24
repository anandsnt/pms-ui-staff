sntRover.controller('RVCompanyCardCtrl', ['$scope',
	function($scope) {

		$scope.searchMode = true;
		$scope.currentSelectedTab = 'cc-contact-info';
		var presentContactInfo = {};

		$scope.switchTabTo = function($event, tabToSwitch) {
			$event.stopPropagation();
			$event.stopImmediatePropagation();
			$scope.currentSelectedTab = tabToSwitch;
		};

		$scope.$on('companyCardAvailable', function() {
			$scope.searchMode = false;
			$scope.contactInformation = $scope.companyContactInformation;
			presentContactInfo = $scope.contactInformation;
		});

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