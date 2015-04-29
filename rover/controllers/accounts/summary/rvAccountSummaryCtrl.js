sntRover.controller('rvAccountSummaryCtrl', ['$scope', '$rootScope', '$filter', '$stateParams', 'rvAccountsConfigurationSrv', 'RVReservationSummarySrv', 'ngDialog', 'rvPermissionSrv',
	function($scope, $rootScope, $filter, $stateParams, rvAccountsConfigurationSrv, RVReservationSummarySrv, ngDialog, rvPermissionSrv) {
		BaseCtrl.call(this, $scope);

		$scope.setScroller("rvAccountSummaryScroller");

		$scope.accountSummaryData = {
			promptMandatoryDemographics: false,
			isDemographicsPopupOpen: false,
			newNote: "",
			demographics: null
		}

		var summaryMemento = {};



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
		 * Update the account data
		 * @return undefined
		 */
		$scope.updateAccountSummary = function() {
			if (rvPermissionSrv.getPermissionValue('EDIT_ACCOUNT')) {
				var onAccountUpdateSuccess = function(data) {
						//client controllers should get an infromation whether updation was success
						$scope.$broadcast("UPDATED_ACCOUNT_INFO");
						$scope.$emit('hideloader');
					},
					onAccountUpdateFailure = function(errorMessage) {
						//client controllers should get an infromation whether updation was a failure
						$scope.$broadcast("FAILED_TO_UPDATE_ACCOUNT_INFO");
						$scope.$emit('hideloader');
					};

				$scope.callAPI(rvAccountsConfigurationSrv.updateAccountSummary, {
					successCallBack: onAccountUpdateSuccess,
					failureCallBack: onAccountUpdateFailure,
					params: {
						summary: $scope.accountConfigData.summary
					}
				});
			} else {
				console.warn('No Permission for EDIT_ACCOUNT');
			}
		}

		var initAccountSummaryView = function() {
			// Have a handler to update the summary - IFF in edit mode
			var callUpdate = function() {
				if (!angular.equals(summaryMemento, $scope.accountConfigData.summary) && !$scope.accountSummaryData.isDemographicsPopupOpen) {
					//data has changed
					summaryMemento = angular.copy($scope.accountConfigData.summary);
					//call the updateAccountSummary method from the parent controller
					$scope.updateAccountSummary();
				}
			}

			if (!$scope.isInAddMode()) {
				$scope.$on("OUTSIDECLICKED", function(event, targetElement) {
					callUpdate();
				});
				$scope.$on("UPDATE_ACCOUNT_SUMMARY", function(event, targetElement) {
					callUpdate();
				});
			}
		}

		/**
		 * get Balance Amount in format
		 * @return {undefined}
		 */
		$scope.getBalanceAmount = function(amount) {
			if (typeof amount === 'undefined') {
				return "";
			}
			return $rootScope.currencySymbol + $filter('number')(amount, 2)
		}


		/**
		 * Place holder method for future implementation of mandatory demographic data
		 * @return {Boolean} Currently hardcoded to true
		 */
		$scope.isDemographicsFormValid = function() {
			return true;
		}

		$scope.closeDemographicsPopup = function() {
			$scope.accountSummaryData.isDemographicsPopupOpen = false;
			$scope.closeDialog();
		}

		/**
		 * Demographics Popup Handler
		 * @return undefined
		 */
		var demographicsMemento = {};
		$scope.openDemographicsPopup = function() {
			$scope.errorMessage = "";
			var showDemographicsPopup = function() {
					$scope.accountSummaryData.isDemographicsPopupOpen = true;
					demographicsMemento = angular.copy($scope.accountConfigData.summary.demographics);
					ngDialog.open({
						template: '/assets/partials/accounts/accountsTab/rvAccountDemographics.html',
						className: '',
						scope: $scope,
						closeByDocument: false,
						closeByEscape: false
					});
				},
				onFetchDemographicsSuccess = function(demographicsData) {
					$scope.accountSummaryData.demographics = demographicsData.demographics;
					showDemographicsPopup();
				},
				onFetchDemographicsFailure = function(errorMessage) {
					console.log(errorMessage);
				};

			if ($scope.accountSummaryData.demographics === null) {
				$scope.callAPI(RVReservationSummarySrv.fetchInitialData, {
					successCallBack: onFetchDemographicsSuccess,
					failureCallBack: onFetchDemographicsFailure
				});

			} else {
				showDemographicsPopup();
			}

		}

		$scope.saveDemographicsData = function() {
			if ($scope.isInAddMode()) {
				// If the account has not been saved yet, prompt user for the same
				$scope.errorMessage = ["Account needs to be saved first"];
				return;
			}

			$scope.updateAccountSummary();
			$scope.closeDemographicsPopup();
		}

		$scope.cancelDemographicChanges = function() {
			$scope.accountConfigData.summary.demographics = demographicsMemento;
		}

		/**
		 * Method to save a note
		 * @return undefined
		 */
		$scope.saveAccountNote = function() {
			if ($scope.isInAddMode()) {
				// If the account has not been saved yet, prompt user for the same
				$scope.errorMessage = ["Account needs to be saved first'"];
				return;
			}

			$scope.errorMessage = "";

			if ($scope.accountSummaryData.newNote) {
				var onSaveAccountNoteSuccess = function(data) {
						$scope.accountConfigData.summary.notes = data.notes;
						$scope.accountSummaryData.newNote = "";
						$scope.refreshScroller("rvAccountSummaryScroller");
					},
					onSaveAccountNoteFailure = function(errorMessage) {
						$scope.errorMessage = errorMessage;
					};

				$scope.callAPI(rvAccountsConfigurationSrv.saveAccountNote, {
					successCallBack: onSaveAccountNoteSuccess,
					failureCallBack: onSaveAccountNoteFailure,
					params: {
						"notes": $scope.accountSummaryData.newNote,
						"posting_account_id": $scope.accountConfigData.summary.posting_account_id
					}
				});
			} else {
				console.warn("Trying to save empty Note!");
			}
		}

		$scope.removeAccountNote = function(noteId) {
			var onRemoveAccountNoteSuccess = function(data, params) {
					$scope.accountConfigData.summary.notes = _.without($scope.accountConfigData.summary.notes, _.findWhere($scope.accountConfigData.summary.notes, {
						note_id: params.noteId
					}));
					$scope.refreshScroller("rvAccountSummaryScroller");
				},
				onRemoveAccountNoteFailure = function(errorMessage) {
					$scope.errorMessage = errorMessage;
				};

			$scope.callAPI(rvAccountsConfigurationSrv.removeAccountNote, {
				successCallBack: onRemoveAccountNoteSuccess,
				failureCallBack: onRemoveAccountNoteFailure,
				params: {
					"note_id": noteId,
				},
				successCallBackParameters: {
					"noteId": noteId,
				}
			});
		}

		$scope.onCloseWarningPopup = function() {
			$scope.accountConfigData.summary.posting_account_status = "OPEN";
			$scope.closeDialog();
		}

		$scope.onAccountTypeModification = function() {
			$scope.updateAccountSummary();
		}

		$scope.onAccountStatusModification = function() {
			//  dont allow to close account with balance -gt 0
			if (!!parseFloat($scope.accountConfigData.summary.balance) && "CLOSED" === $scope.accountConfigData.summary.posting_account_status) {
				ngDialog.open({
					template: '/assets/partials/accounts/accountsTab/rvAccountAlertCloseWithBalance.html',
					className: '',
					scope: $scope,
					closeByDocument: false,
					closeByEscape: false
				});
			} else {
				$scope.updateAccountSummary();
			}
		}

		initAccountSummaryView();
	}
]);