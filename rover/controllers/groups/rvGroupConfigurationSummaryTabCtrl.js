sntRover.controller('rvGroupConfigurationSummaryTab', ['$scope', '$rootScope', 'rvGroupSrv', '$filter', '$stateParams', 'rvGroupConfigurationSrv', 'dateFilter', 'RVReservationSummarySrv', 'ngDialog', 'RVReservationAddonsSrv',
	function($scope, $rootScope, rvGroupSrv, $filter, $stateParams, rvGroupConfigurationSrv, dateFilter, RVReservationSummarySrv, ngDialog, RVReservationAddonsSrv) {
		BaseCtrl.call(this, $scope);

		$scope.setScroller("groupSummaryScroller");

		$scope.groupSummaryData = {
			releaseOnDate: $rootScope.businessDate,
			demographics: null,
			promptMandatoryDemographics: false
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
			}
		};

		$scope.fromDateChanged = function() {
			$scope.groupConfigState.summary.block_from = dateFilter($scope.groupConfigState.summary.block_from, 'yyyy-MM-dd');
		}

		$scope.toDateChanged = function() {
			$scope.groupConfigState.summary.block_to = dateFilter($scope.groupConfigState.summary.to_from, 'yyyy-MM-dd');
		}

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
		$scope.openDemographicsPopup = function() {
			var showDemographicsPopup = function() {
					ngDialog.open({
						template: '/assets/partials/groups/groupDemographicsPopup.html',
						className: '',
						scope: $scope,
						closeByDocument: false,
						closeByEscape: false
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

		/**
		 * manage addons selection/ updates
		 * @return undefined
		 */
		$scope.manageAddons = function() {
			// ADD ONS button: pop up standard Add On screen - same functionality as on Stay Card, select new or show small window and indicator for existing Add Ons


			var onFetchAddonsSuccess = function(addonsData) {
					console.log(addonsData);					
					$scope.groupConfigData.addons = addonsData;
					$scope.groupConfigData.selectAddons = true;
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


	}
]);