sntRover.controller('rvAccountsConfigurationCtrl', [
	'$scope',
	'$rootScope',
	'rvGroupSrv',
	'$filter',
	'$stateParams',
	'rvAccountsConfigurationSrv',
	'accountData',
	'$state',
	'rvPermissionSrv',
	function($scope, $rootScope, rvGroupSrv, $filter, $stateParams, rvAccountsConfigurationSrv, accountData, $state, rvPermissionSrv) {

		BaseCtrl.call(this, $scope);

		/**
		 * to run angular digest loop,
		 * will check if it is not running
		 * return - None
		 */
		var runDigestCycle = function() {
			if (!$scope.$$phase) {
				$scope.$digest();
			}
		};

		/**
		 * whether current screen is in Add Mode
		 * @return {Boolean}
		 */
		$scope.isInAddMode = function() {
			return ($stateParams.id === "NEW_ACCOUNT");
		};


		/**
		 * function to set title and things
		 * @return - None
		 */
		var setTitle = function() {
			var title = $filter('translate')('ACCOUNT_DETAILS');

			// we are changing the title if we are in Add Mode
			if ($scope.isInAddMode()) {
				title = $filter('translate')('NEW_ACCOUNT');
			}

			//yes, we are setting the headting and title
			$scope.setHeadingTitle(title);
		};

		/**
		 * function to set Back Navigation params
		 */
		var setBackNavigation = function() {
			// TODO : Currently hardcoded to go to groups search.. 
			// Change the same according to the requirements
			$rootScope.setPrevState = {
				title: $filter('translate')('ACCOUNTS'),
				name: 'rover.accounts.search'
			};

			//setting title and things
			setTitle();
		}

		/**
		 * Function to check the mandatory values while saving the reservation
		 * Handling in client side owing to alleged issues on import if handled in the server side
		 * @return boolean [true if all the mandatory values are present]
		 */
		var ifMandatoryValuesEntered = function() {
			var summary = $scope.accountConfigData.summary;
			return !!summary.posting_account_name;
		}

		/**
		 * function to form data model for add/edit mode
		 * @return - None
		 */
		$scope.initializeDataModelForSummaryScreen = function() {
			$scope.accountConfigData = {
				activeTab: $stateParams.activeTab, // Possible values are ACCOUNT, TRANSACTIONS, ACTIVITY
				summary: accountData
			};
		};

		/**
		 * TAB - to swicth tab
		 * @return - None
		 */
		$scope.switchTabTo = function(tab) {

			//if there was any error message there, we are clearing
			$scope.errorMessage = '';

			var isInAccountsTab = $scope.accountConfigData.activeTab == "ACCOUNT";

			// we will restrict tab swithing if we are in add mode
			var tryingFromAccountsToOther = isInAccountsTab && tab !== 'ACCOUNT';
			if ($scope.isInAddMode() && tryingFromAccountsToOther) {
				$scope.errorMessage = ['Sorry, Please save the entered information and try to switch the tab'];
				return;
			}

			//Save summary data on tab switch (UI)
			if (isInAccountsTab && !$scope.isInAddMode()) {
				$scope.updateAccountSummary();
			}

			$scope.accountConfigData.activeTab = tab;
		};

		/**
		 * to get the current tab url
		 * @return {String}
		 */
		$scope.getCurrentTabUrl = function() {
			var tabAndUrls = {
				'ACCOUNT': '/assets/partials/accounts/accountsTab/rvAccountsSummary.html',
				'TRANSACTIONS': '/assets/partials/groups/transactions/rvGroupConfigurationTransactionsTab.html',
				'ACTIVITY': '/assets/partials/groups/activity/rvGroupConfigurationActivityTab.html'
			};

			return tabAndUrls[$scope.accountConfigData.activeTab];
		};

		/**
		 * Save the new Group
		 * @return undefined
		 */
		$scope.saveNewAccount = function() {
			$scope.errorMessage = "";
			if (rvPermissionSrv.getPermissionValue('CREATE_ACCOUNT')) {
				if (ifMandatoryValuesEntered()) {
					var onAccountSaveSuccess = function(data) {
							$scope.accountConfigData.summary.posting_account_id = data.posting_account_id;
							$state.go('rover.accounts.config', {
								id: data.posting_account_id
							})
							$stateParams.id = data.posting_account_id;
						},
						onAccountSaveFailure = function(errorMessage) {
							$scope.errorMessage = errorMessage;
						};

					$scope.callAPI(rvAccountsConfigurationSrv.saveAccountSummary, {
						successCallBack: onAccountSaveSuccess,
						failureCallBack: onAccountSaveFailure,
						params: {
							summary: $scope.accountConfigData.summary
						}
					});
				} else {
					$scope.errorMessage = ["Account's name is mandatory"];
				}
			} else {
				console.warn('No Permission for CREATE_GROUP_SUMMARY');
			}

		}


		/**
		 * Update the group data
		 * @return undefined
		 */
		$scope.updateAccountSummary = function() {
			if (rvPermissionSrv.getPermissionValue('EDIT_ACCOUNT')) {
				var onAccountUpdateSuccess = function(data) {
						//client controllers should get an infromation whether updation was success
						$scope.$broadcast("UPDATED_ACCOUNT_INFO");
						console.log(data);
					},
					onAccountUpdateFailure = function(errorMessage) {
						//client controllers should get an infromation whether updation was a failure
						$scope.$broadcast("FAILED_TO_UPDATE_ACCOUNT_INFO");
						console.log(errorMessage);
					};

				$scope.callAPI(rvAccountsConfigurationSrv.updateAccountSummary, {
					successCallBack: onAccountUpdateSuccess,
					failureCallBack: onAccountUpdateFailure,
					params: {
						summary: $scope.accountConfigData.summary
					}
				});
			} else {
				console.warn('No Permission for EDIT_GROUP_SUMMARY');
			}
		}


		/**
		 * Discard the new Group
		 * @return undefined
		 */
		$scope.discardNewAccount = function() {
			$scope.accountConfigData.summary = angular.copy(rvAccountsConfigurationSrv.baseAccountSummaryData);
		}


		/**
		 * function to initialize things for group config.
		 * @return - None
		 */
		var initGroupConfig = function() {

			//forming the data model if it is in add mode or populating the data if it is in edit mode
			$scope.initializeDataModelForSummaryScreen();

			//back navigation
			setBackNavigation();
		};

		initGroupConfig();
	}
]);