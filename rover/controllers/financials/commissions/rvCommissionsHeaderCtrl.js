sntRover.controller('RVCommisionsHeaderCtrl', ['$scope', 'ngDialog', '$log', '$timeout','RVCommissionsSrv', function($scope, ngDialog, $log, $timeout, RVCommissionsSrv) {
	BaseCtrl.call(this, $scope);

	var setParamsInCurrentPage = function(params) {
		params.selected_agents = [];
		_.each($scope.selectedAgentIds, function(id) {
			params.selected_agents.push({
				'id': id,
				'update_all': true
			});
		});
		return params;
	};

	var setParamsInCurrentPageAndOtherPages = function(params) {
		params.un_selected_agents = [];
		_.each($scope.commissionsData.accounts, function(account) {
			if (!account.isSelected) {
				params.un_selected_agents.push(account.id);
			}
		});
		return params;
	};

	var generateParams = function() {
		var params = {};

		params.no_of_bills_selected = $scope.noOfTASelected;

		if ($scope.areAllAgentsSelected()) {
			params.update_all_bill = true;
		} else {
			params.partialy_selected_agents = [];
			// if only items in the existing page are selected
			if (params.no_of_bills_selected <= $scope.filterData.perPage) {
				params = setParamsInCurrentPage(params);
			} else {
				// when more than per page items are selected and
				// some of the current page items are unchecked
				params = setParamsInCurrentPageAndOtherPages(params);
			}
			_.each($scope.commissionsData.accounts, function(account) {
				if (account.isExpanded && account.selectedReservations.length && account.selectedReservations.length !== account.reservationsData.total_count) {
					var data = {
						'id': account.id,
						'selected_res_ids': account.selectedReservations
					};

					params.partialy_selected_agents.push(data);
				}
			});

			if (!params.partialy_selected_agents.length) {
				delete params.partialy_selected_agents;
			}
		}
		return params;
	};

	var setExportStatus = function(inProgress, failed, success) {
		$scope.exportSuccess = success;
		$scope.exportFailed = failed;
		$scope.exportInProgess = inProgress;
	};

	$scope.exportCommisions = function() {

		var options = {
			params: generateParams(),
			successCallBack: function() {
				// for now we will only show in progress status and then dismiss the
				// popup
				$timeout(function() {
					setExportStatus(false, false, true);
					ngDialog.close();
				}, 1000);
			},
			failureCallBack: function() {
				setExportStatus(false, true, false);
			}
		};

		setExportStatus(true, false, false);
		$scope.callAPI(RVCommissionsSrv.exportCommissions, options);
	};

	$scope.showExportPopup = function() {
		setExportStatus(false, false, false);
		ngDialog.open({
			template: '/assets/partials/financials/commissions/rvCommissionsExport.html',
			className: '',
			scope: $scope
		});
	};

	$scope.popupBtnAction = function(action) {
		var params = generateParams();

		params.action = action;
		var successCallBack = function() {
			ngDialog.close();
			$scope.fetchAgentsData();
		};

		successCallBack();
	};

	var calculateAmountOwingForCurrentPage = function() {
		var amountOwing = 0;

		_.each($scope.commissionsData.accounts, function(account) {
			_.each($scope.selectedAgentIds, function(id) {
				if (id === account.id) {
					amountOwing = amountOwing + parseInt(account.amount_owing);
				}
			});
		});
		return amountOwing;
	};

	var calculateAmountOwingForCurrentPageAndOtherPages = function() {
		var amountOwing = parseInt($scope.commissionsData.amount_totals.unpaid);

		_.each($scope.commissionsData.accounts, function(account) {
			if (!account.isSelected) {
				amountOwing = amountOwing - parseInt(account.amount_owing);
			}
		});
		return amountOwing;
	};

	var openNgDialogWithTemplate = function(template){
		ngDialog.open({
			template: '/assets/partials/financials/commissions/' + template + '.html',
			className: '',
			scope: $scope
		});
	}

	$scope.openPopupWithTemplate = function(template) {
		// TO DO: handle for release from ON_HOLD TAB - minor updates

		if ($scope.filterData.filterTab === 'PAYABLE') {
			if ($scope.areAllAgentsSelected()) {
				$scope.eligibleForPayment = $scope.commissionsData.amount_totals.unpaid;
			} else {
				var amountOwing;

				// if only items in the existing page are selected
				if ($scope.noOfTASelected <= $scope.filterData.perPage) {
					amountOwing = calculateAmountOwingForCurrentPage();
				} else {
					// when more than per page items are selected and
					// some of the current page items are unchecked
					// subtract unselected amount from total
					amountOwing = calculateAmountOwingForCurrentPageAndOtherPages();
				}

				// apart from main TA, add partially selected TA
				_.each($scope.commissionsData.accounts, function(account) {
					if (account.isExpanded && account.selectedReservations.length && account.selectedReservations.length !== account.reservationsData.total_count) {
						_.each(account.reservationsData.reservations, function(reservation) {
							if (reservation.isSelected) {
								amountOwing = amountOwing + parseInt(reservation.amount_owing);
							}
						});
					}
				});
				$scope.eligibleForPayment = amountOwing;
			}
		}
		openNgDialogWithTemplate(template);
	};


}]);
