sntRover.controller('rvAccountSummaryCtrl', ['$scope', '$rootScope', '$filter', '$stateParams', 'rvAccountsConfigurationSrv', 'RVReservationSummarySrv', 'ngDialog',
	function($scope, $rootScope, $filter, $stateParams, rvAccountsConfigurationSrv, RVReservationSummarySrv, ngDialog) {
		BaseCtrl.call(this, $scope);

		$scope.setScroller("rvAccountSummaryScroller");

		$scope.accountSummaryData = {
			promptMandatoryDemographics: false,
			isDemographicsPopupOpen: false,
			newNote: ""
		}

		var summaryMemento = {};

		var initAccountSummaryView = function() {
			// Have a handler to update the summary - IFF in edit mode
			if (!$scope.isInAddMode()) {
				$scope.$on("OUTSIDECLICKED", function(event, targetElement) {
					if (!angular.equals(summaryMemento, $scope.accountConfigData.summary) && !$scope.accountSummaryData.isDemographicsPopupOpen) {
						//data has changed
						summaryMemento = angular.copy($scope.accountConfigData.summary);
						//call the updateGroupSummary method from the parent controller
						$scope.updateAccountSummary();
					}
				});
			}
		}

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
		 * Place holder method for future implementation of mandatory demographic data
		 * @return {Boolean} Currently hardcoded to true
		 */
		$scope.isDemographicsFormValid = function() {
			return true;
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
						closeByEscape: false,
						preCloseCallback: function() {
							$scope.accountSummaryData.isDemographicsPopupOpen = false;
						}
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
				// If the group has not been saved yet, prompt user for the same
				$scope.errorMessage = ["Please save the group to save Demographics"];
				return;
			}

			$scope.updateAccountSummary();
			$scope.closeDialog();
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
				// If the group has not been saved yet, prompt user for the same
				$scope.errorMessage = ["Please save the group to Post Note"];
				return;
			}

			$scope.errorMessage = "";

			if ($scope.accountSummaryData.newNote) {
				var onSaveGroupNoteSuccess = function(data) {
						$scope.accountConfigData.summary.notes = data.notes;
						$scope.accountSummaryData.newNote = "";
						$scope.refreshScroller("rvAccountSummaryScroller");
					},
					onSaveGroupNoteFailure = function(errorMessage) {
						$scope.errorMessage = errorMessage;
					};

				$scope.callAPI(rvAccountsConfigurationSrv.saveAccountNote, {
					successCallBack: onSaveGroupNoteSuccess,
					failureCallBack: onSaveGroupNoteFailure,
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
			var onRemoveGroupNoteSuccess = function(data, params) {
					$scope.accountConfigData.summary.notes = _.without($scope.accountConfigData.summary.notes, _.findWhere($scope.accountConfigData.summary.notes, {
						note_id: params.noteId
					}));
					$scope.refreshScroller("rvAccountSummaryScroller");
				},
				onRemoveGroupNoteFailure = function(errorMessage) {
					$scope.errorMessage = errorMessage;
				};

			$scope.callAPI(rvAccountsConfigurationSrv.removeAccountNote, {
				successCallBack: onRemoveGroupNoteSuccess,
				failureCallBack: onRemoveGroupNoteFailure,
				params: {
					"note_id": noteId,
				},
				successCallBackParameters: {
					"noteId": noteId,
				}
			});
		}

		$scope.onAccountStatusModification = function() {
			$scope.updateAccountSummary();
		}

		initAccountSummaryView();
	}
]);