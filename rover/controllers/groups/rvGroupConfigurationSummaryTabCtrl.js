sntRover.controller('rvGroupConfigurationSummaryTab', ['$scope', '$rootScope', 'rvGroupSrv', '$filter', '$stateParams', 'rvGroupConfigurationSrv', 'dateFilter', 'RVReservationSummarySrv', 'ngDialog', 'RVReservationAddonsSrv',
	function($scope, $rootScope, rvGroupSrv, $filter, $stateParams, rvGroupConfigurationSrv, dateFilter, RVReservationSummarySrv, ngDialog, RVReservationAddonsSrv) {
		BaseCtrl.call(this, $scope);

		$scope.setScroller("groupSummaryScroller");

		$scope.groupSummaryData = {
			releaseOnDate: $rootScope.businessDate,
			demographics: null,
			promptMandatoryDemographics: false,
			isDemographicsPopupOpen: false
		}

		var summaryMemento = {};

		var initGroupSummaryView = function() {
			// Have a handler to update the summary - IFF in edit mode
			if (!$scope.isInAddMode()) {
				$scope.$on("OUTSIDECLICKED", function(event, targetElement) {
					if (!angular.equals(summaryMemento, $scope.groupConfigData.summary) && !$scope.groupSummaryData.isDemographicsPopupOpen) {
						//data has changed
						summaryMemento = angular.copy($scope.groupConfigData.summary);
						//call the updateGroupSummary method from the parent controller
						$scope.updateGroupSummary();
					}
				});
			}
		}



		$scope.fromDateOptions = {
			showOn: 'button',
			dateFormat: $rootScope.jqDateFormat,
			numberOfMonths: 1,
			yearRange: '-1:',
			minDate: tzIndependentDate($rootScope.businessDate),
			beforeShow: function(input, inst) {
				$('<div id="ui-datepicker-overlay" class="transparent" />').insertAfter('#ui-datepicker-div');
			},
			onClose: function(dateText, inst) {
				$('#ui-datepicker-overlay').remove();
			},
			onSelect: function() {
				$scope.groupConfigData.summary.block_from = dateFilter($scope.groupConfigData.summary.block_from, 'yyyy-MM-dd');
				if (!$scope.groupConfigData.summary.release_date) {
					$scope.groupConfigData.summary.release_date = $scope.groupConfigData.summary.block_from;
				}
			}
		};

		$scope.toDateOptions = {
			showOn: 'button',
			dateFormat: $rootScope.jqDateFormat,
			numberOfMonths: 1,
			yearRange: '-1:',
			minDate: tzIndependentDate($rootScope.businessDate),
			beforeShow: function(input, inst) {
				$('<div id="ui-datepicker-overlay" class="transparent" />').insertAfter('#ui-datepicker-div');
			},
			onClose: function(dateText, inst) {
				$('#ui-datepicker-overlay').remove();
			},
			onSelect: function() {
				$scope.groupConfigData.summary.block_to = dateFilter($scope.groupConfigData.summary.block_to, 'yyyy-MM-dd');
			}
		};

		$scope.releaseDateOptions = {
			showOn: 'button',
			dateFormat: $rootScope.jqDateFormat,
			numberOfMonths: 1,
			yearRange: '-1:',
			minDate: tzIndependentDate($rootScope.businessDate),
			beforeShow: function(input, inst) {
				$('<div id="ui-datepicker-overlay" class="transparent" />').insertAfter('#ui-datepicker-div');
			},
			onClose: function(dateText, inst) {
				$('#ui-datepicker-overlay').remove();
			},
			onSelect: function() {
				$scope.groupConfigData.summary.release_date = dateFilter($scope.groupConfigData.summary.release_date, 'yyyy-MM-dd');
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
			var showDemographicsPopup = function() {
					$scope.groupSummaryData.isDemographicsPopupOpen = true;
					demographicsMemento = angular.copy($scope.groupConfigData.summary.demographics);
					ngDialog.open({
						template: '/assets/partials/groups/groupDemographicsPopup.html',
						className: '',
						scope: $scope,
						closeByDocument: false,
						closeByEscape: false,
						preCloseCallback: function() {
							$scope.groupSummaryData.isDemographicsPopupOpen = false;
						}
					});
				},
				onFetchDemographicsSuccess = function(demographicsData) {
					$scope.groupSummaryData.demographics = demographicsData.demographics;
					showDemographicsPopup();
				},
				onFetchDemographicsFailure = function(errorMessage) {
					console.log(errorMessage);
				};

			if ($scope.groupSummaryData.demographics === null) {
				$scope.callAPI(RVReservationSummarySrv.fetchInitialData, {
					successCallBack: onFetchDemographicsSuccess,
					failureCallBack: onFetchDemographicsFailure
				});

			} else {
				showDemographicsPopup();
			}

		}


		$scope.cancelDemographicChanges = function() {
			$scope.groupConfigData.summary.demographics = demographicsMemento;
		}

		/**
		 * Warn release the rooms
		 * @return undefined
		 */
		$scope.warnReleaseRooms = function() {
			ngDialog.open({
				template: '/assets/partials/groups/warnReleaseRoomsPopup.html',
				className: '',
				scope: $scope,
				closeByDocument: false,
				closeByEscape: false
			});
		}


		/**
		 * Handle release rooms
		 * @return undefined
		 */
		$scope.releaseRooms = function() {
			//TODO : HANDLE RELEASE ROOMS
		}


		/**
		 * Method to show addons popup
		 * @return undefined
		 */
		$scope.viewAddons = function() {
			ngDialog.open({
				template: '/assets/partials/groups/groupAddonsPopup.html',
				className: '',
				scope: $scope,
				closeByDocument: false,
				closeByEscape: false
			});
		}


		/**
		 * manage addons selection/ updates
		 * @return undefined
		 */
		$scope.manageAddons = function() {
			// ADD ONS button: pop up standard Add On screen - same functionality as on Stay Card, select new or show small window and indicator for existing Add Ons
			var onFetchAddonsSuccess = function(addonsData) {
					console.log(addonsData);
					$scope.groupConfigData.addons = addonsData;
					$scope.openGroupAddonsScreen();
				},
				onFetchAddonsFailure = function(errorMessage) {
					console.log(errorMessage);
				};

			$scope.callAPI(RVReservationAddonsSrv.fetchAddonData, {
				successCallBack: onFetchAddonsSuccess,
				failureCallBack: onFetchAddonsFailure,
				params: {
					from_date: $scope.groupConfigData.summary.block_from,
					to_date: $scope.groupConfigData.summary.block_to,
					is_active: true,
					is_not_rate_only: true
				}
			})
		}
		initGroupSummaryView();
	}
]);