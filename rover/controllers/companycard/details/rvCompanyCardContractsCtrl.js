sntRover.controller('companyCardContractsCtrl', ['$rootScope', '$scope', 'RVCompanyCardSrv', '$stateParams', 'ngDialog', 'dateFilter', '$timeout', 'rvPermissionSrv',
	function($rootScope, $scope, RVCompanyCardSrv, $stateParams, ngDialog, dateFilter, $timeout, rvPermissionSrv) {
		BaseCtrl.call(this, $scope);
		$scope.highchartsNG = {};
		$scope.contractList = {};
		$scope.contractData = {};
		$scope.rateValueTypes = [ { value:"%",name:"percent" },{ value: $rootScope.currencySymbol, name:"amount" } ];
		$scope.addData = {};

		$scope.contractList.contractSelected = "";
		$scope.contractList.current_contracts = [];
		$scope.contractList.future_contracts = [];
		$scope.contractList.history_contracts = [];
		$scope.contractList.isAddMode = false;
		$scope.errorMessage = "";
		$scope.autoCompleteState = {};
		var contractInfo = {};
		var ratesList = [];
		$scope.isDeleteAllowed = false;

		/* Items related to ScrollBars
		 * 1. When the tab is activated, refresh scroll.
		 * 2. Scroll is actually on a sub-scope created by ng-include.
		 *    So ng-iscroll will create the ,myScroll Array there, if not defined here.
		 */

		$scope.setScroller('cardContractsScroll');

		var refreshScroller = function() {
			$timeout(function() {
				if ($scope.myScroll && $scope.myScroll['cardContractsScroll']) {
					$scope.myScroll['cardContractsScroll'].refresh();
				}
				$scope.refreshScroller('cardContractsScroll');
			}, 500);
		};

		$scope.$on("ContactTabActivated", refreshScroller);
		$scope.$on("refreshContractsScroll", refreshScroller);

		/**** Scroll related code ends here. ****/

		$scope.hasPermisionToDeleteContract = function() {
			return rvPermissionSrv.getPermissionValue ('DELETE_CONTRACT');
		};


		var clientWidth = $(window).width();
		var clientHeight = $(window).height();
		var drawGraph = function() {
			$scope.highchartsNG = {
				options: {
					chart: {
						type: 'area',
						className: "rateMgrOccGraph",
						width: $(".cards-content").width() - 150,
						backgroundColor: null,
						zoomType: 'x',
						height: 400,
						marginTop: 50
					},
					tooltip: {
						shared: true,
						formatter: function() {
							return 'ACTUAL <b>' + ((typeof this.points[0].y === 'undefined') ? '0' : this.points[0].y) + '</b>' + '<br/>CONTRACTED <b>' + ((typeof this.points[1] === 'undefined') ? '0' : this.points[1].y) + '</b>';
						}
					},
					legend: {
						enabled: true,
						align: 'right',
						verticalAlign: 'top',
						x: 0,
						y: 0,
						floating: true
					},
					plotOptions: {
						series: {
							fillOpacity: 0.1
						}
					},
					xAxis: {
						minRange: 11,
						min: 0,
						categories: $scope.categories,
						tickWidth: 0,
						labels: {
							style: {
								'textAlign': 'center',
								'display': 'block',
								'color': '#868788',
								'fontWeight': 'bold'
							},
							useHTML: true
						}
					},
					yAxis: {
						style: {
							color: 'red'
						},
						useHTML: true,
						labels: {
							style: {
								color: '#868788',
								fontWeight: 'bold'
							}
						},
						floor: 0,
						ceiling: 100,
						tickInterval: 10,
						title: {
							text: ''
						}
					},
					title: {
						text: ''
					}
				},
				series: $scope.graphData
			};
		};

		var fetchContractsDetailsSuccessCallback = function(data) {

			$scope.contractData = data;
			$scope.contractData.rates = [];
			$scope.contractData.rates = ratesList;
			$scope.errorMessage = "";
			contractInfo = {};
			$scope.contractData.contract_name = "";
			$scope.isDeleteAllowed = data.is_delete_allowed;

			var selectedRate = _.findWhere(ratesList, {id: data.contracted_rate_selected});
			$scope.contractData.contractedRate = selectedRate? selectedRate.name : "";
			/*
			 *Nights pop up should be triggered only after contract details are saved
			 *and refetched in the case of add mode
			*/
			if($scope.contractList.isAddMode){
				ngDialog.open({
							template: '/assets/partials/companyCard/rvContractedNightsPopup.html',
							controller: 'contractedNightsCtrl',
							className: 'ngdialog-theme-default1 calendar-single1',
							scope: $scope
						});
				$scope.contractList.isAddMode = false;
			}


			if (typeof $stateParams.type !== 'undefined' && $stateParams.type !== "") {
				$scope.contractData.account_type = $stateParams.type;
			}
			contractInfo = JSON.parse(JSON.stringify($scope.contractData));
			$scope.graphData = manipulateGraphData(data.occupancy);
			$scope.$emit('hideLoader');
			drawGraph();
			// Disable contracts on selecting history
			$scope.hasOverlay = false;
			angular.forEach($scope.contractList.history_contracts, function(item, index) {
				if (item.id === $scope.contractList.contractSelected) {
					$scope.hasOverlay = true;
				}
			});

			setTimeout(function() {
				refreshScroller();
			}, 500);
		};
		var fetchFailureCallback = function(data) {
			$scope.$emit('hideLoader');
			$scope.errorMessage = data;
		};
		// To check contract list is empty
		var checkContractListEmpty = function() {

			if ($scope.contractList.current_contracts.length === 0 && $scope.contractList.future_contracts.length === 0 && $scope.contractList.history_contracts.length === 0) {
				$scope.hasOverlay = true;
				$scope.isDeleteAllowed = false;
				$scope.contractData = {};
			} else {
				$scope.hasOverlay = false;
			}
		};

		var fetchContractsListSuccessCallback = function(data) {
			$scope.contractList = data;			
			$scope.contractList.contractSelected = data.contract_selected;
			$scope.$emit('hideLoader');
			checkContractListEmpty();
			$scope.errorMessage = "";
			
		};
		var fetchContractsDetailsFailureCallback = function(data) {
			$scope.$emit('hideLoader');
			$scope.errorMessage = data;
		};


		var manipulateGraphData = function(data) {
			var graphData = [];
			var contracted = [];
			var actual = [];
			$scope.categories = [];
			angular.forEach(data, function(item) {
				itemDate = item.month + " " + item.year;
				$scope.categories.push(itemDate);
				//contracted.push([itemDate, Math.floor((Math.random() * 100) + 1)]); // TODO :: Remove this line and uncomment below line
				contracted.push([itemDate, item.contracted_occupancy]);
				// actual.push([itemDate, Math.floor((Math.random() * 100) + 1)]); // TODO :: Remove this line and uncomment below line
				actual.push([itemDate, item.actual_occupancy]);
			});
			if ($scope.categories.length > 0 && $scope.categories.length < 12) {
				var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
				while ($scope.categories.length < 12) {
					var monthComponents = $($scope.categories).last()[0].split(" ");
					var lastMonth = monthComponents[0];
					var lastYear = monthComponents[1];
					var lastMonthIdx = $.inArray(lastMonth, months);
					var thisMonth = months[(lastMonthIdx + 1) % 12];
					var thisYear = lastMonthIdx === 11 ? parseInt(lastYear) + 1 : lastYear;
					$scope.categories.push(thisMonth + " " + thisYear);
				}
			}
			graphData = [{
				"name": "ACTUAL",
				"data": actual,
				"color": "rgba(247,153,27,0.9)",
				"marker": {
					symbol: 'circle',
					radius: 5
				}
			}, {
				"name": "CONTRACTED",
				"data": contracted,
				"color": "rgba(130,195,223,0.9)",
				"marker": {
					symbol: 'triangle',
					radius: 0
				}
			}];
			return graphData;
		};

		// Fetch data for rates
		var fetchRatesSuccessCallback = function(data) {
			ratesList = data.contract_rates;

			$scope.contractData.rates = [];
			$scope.contractData.rates = ratesList;

			$scope.addData.rates = [];
			$scope.addData.rates = ratesList;
			$scope.errorMessage = "";
		};
		$scope.invokeApi(RVCompanyCardSrv.fetchRates, {}, fetchRatesSuccessCallback, fetchFailureCallback);		

			
		$scope.fetchContractsList = function () {

			if ($stateParams.id !== "add") {
				$scope.invokeApi(RVCompanyCardSrv.fetchContractsList, {
					"account_id": $stateParams.id
				}, fetchContractsListSuccessCallback, fetchFailureCallback);
			} else {
				$scope.contractList.isAddMode = true;
				$scope.$emit('hideLoader');
			}
		};

		$scope.fetchContractsList();

		/*
		 * Function to handle data change in 'Contract List'.
		 */
		$scope.$watch('contractList.contractSelected', function() {
			if ($stateParams.id === "add") {
				var account_id = $scope.contactInformation.id;
			} else {
				var account_id = $stateParams.id;
			}
			if ($scope.contractList.contractSelected) {
				$scope.invokeApi(RVCompanyCardSrv.fetchContractsDetails, {
					"account_id": account_id,
					"contract_id": $scope.contractList.contractSelected
				}, fetchContractsDetailsSuccessCallback, fetchContractsDetailsFailureCallback);
				angular.forEach($scope.contractList.history_contracts, function(item, index) {
					if (item.id === $scope.contractList.contractSelected) {
						$scope.hasOverlay = true;
					}
				});
			}
		});

		// Delete Contarct button action
		// Shows conformation popup 
		$scope.deleteContract = function() {
			ngDialog.open({
				template: '/assets/partials/companyCard/rvCompanyCardContractDeleteConfirmationPopup.html',
				className: 'ngdialog-theme-default1',
				scope: $scope
			});
		};

		// To close popup 
		$scope.closePopup = function () {
			ngDialog.close();
		};

		// To contract delete API call
		$scope.deleteContractConfirmed = function(event) {

			event.stopPropagation();
			var deleteContractSuccessCallback = function() {
				$scope.errorMessage = "";
				$scope.contractList.current_contracts = [];
				$scope.contractList.future_contracts = [];
				$scope.contractList.history_contracts = [];
				$scope.$emit('hideLoader');
				$scope.fetchContractsList();

			};

			var deleteContractFailureCallback = function(errorMessage){
				$scope.$emit('hideLoader');
				$scope.errorMessage = errorMessage;
			};

			ngDialog.close();
			$scope.invokeApi(RVCompanyCardSrv.deleteContract,  {
					"account_id": $stateParams.id,
					"contract_id": $scope.contractList.contractSelected
				}, deleteContractSuccessCallback, deleteContractFailureCallback);
		};
 
		// To popup contract start date
		$scope.contractStart = function() {
			ngDialog.open({
				template: '/assets/partials/companyCard/rvCompanyCardContractsCalendar.html',
				controller: 'contractStartCalendarCtrl',
				className: 'calendar-single1',
				scope: $scope
			});
		};
		// To popup contract end date
		$scope.contractEnd = function() {
			ngDialog.open({
				template: '/assets/partials/companyCard/rvCompanyCardContractsCalendar.html',
				controller: 'contractEndCalendarCtrl',
				className: 'calendar-single1',
				scope: $scope
			});
		};
		// To update contracts list after add new contracts

		var updateContractList = function(data) {

			var dataNew = {
				"id": data.id,
				"contract_name": $scope.addData.contract_name
			};

			var businessDate = new Date($rootScope.businessDate);
			var beginDate = new Date($scope.addData.begin_date);
			var endDate = new Date($scope.addData.end_date);

			if (beginDate <= businessDate && endDate >= businessDate) {
				$scope.contractList.current_contracts.push(dataNew);
			} else {
				$scope.contractList.future_contracts.push(dataNew);
			}

			$scope.contractList.contractSelected = data.id;
			$scope.addData.contract_name = "";

		};

		// To handle click on nights button
		$scope.clickedContractedNights = function() {
			/*
			 * On AddMode : save new contract before showing Nights popup.
			 */
			if ($scope.contractList.isAddMode) {
				var data = dclone($scope.addData, ['occupancy', 'statistics', 'rates', 'total_contracted_nights']);

				var saveContractSuccessCallback = function(data) {
					$scope.errorMessage = "";
					$scope.$emit('hideLoader');
					updateContractList(data);
				};
				var saveContractFailureCallback = function(data) {
					$scope.$emit('hideLoader');
					$scope.errorMessage = data;
				};

				if ($stateParams.id === "add") {
					var account_id = $scope.contactInformation.id;
				} else {
					var account_id = $stateParams.id;
				}
				if (account_id) {
					$scope.invokeApi(RVCompanyCardSrv.addNewContract, {
						"account_id": account_id,
						"postData": data
					}, saveContractSuccessCallback, saveContractFailureCallback);
				}
			} else {
				// Nights popup enabled only when contract is selected.
				if ($scope.contractList.contractSelected) {
					ngDialog.open({
						template: '/assets/partials/companyCard/rvContractedNightsPopup.html',
						controller: 'contractedNightsCtrl',
						className: 'ngdialog-theme-default1 calendar-single1',
						scope: $scope
					});
				}
			}
		};

		$scope.AddNewButtonClicked = function() {
			//Setup data for Add mode
			$scope.hasOverlay = false;
			$scope.contractList.isAddMode = true;

			$scope.addData={};
			$scope.addData.occupancy = [];
			$scope.addData.begin_date = dateFilter(new Date($rootScope.businessDate), 'yyyy-MM-dd');
			$scope.addData.contracted_rate_selected = "";
			$scope.addData.selected_symbol = "+";
			$scope.addData.selected_type = "amount";

			$scope.addData.rate_value = 0;
			var myDate = new Date($rootScope.businessDate);
			myDate.setDate(myDate.getDate() + 1);
			$scope.addData.end_date = dateFilter(myDate, 'yyyy-MM-dd');
			$scope.addData.is_fixed_rate = false;
			$scope.addData.is_rate_shown_on_guest_bill = false;
			if (typeof $stateParams.type !== 'undefined' && $stateParams.type !== "") {
				$scope.addData.account_type = $stateParams.type;
			}

		};
		// Cancel Add New mode
		$scope.CancelAddNewContract = function() {
			$scope.contractList.isAddMode = false;
			$scope.addData.contract_name = "";
			$scope.errorMessage = "";
			checkContractListEmpty();
		};

		/*
		 * To add new contracts
		 */
		$scope.AddNewContract = function() {

			var dataToPost = {};
			dataToPost = dclone($scope.addData, ['occupancy', 'statistics', 'rates', 'total_contracted_nights']);

			var saveContractSuccessCallback = function(data) {
				$scope.$emit('hideLoader');
				$scope.errorMessage = "";
				$scope.contractList.isAddMode = false;
				updateContractList(data);
			};
			var saveContractFailureCallback = function(data) {
				$scope.$emit('hideLoader');
				$scope.errorMessage = data;
			};

			if ($stateParams.id === "add") {
				var account_id = $scope.contactInformation.id;
			} else {
				var account_id = $stateParams.id;
			}

			if (account_id) {
				$scope.invokeApi(RVCompanyCardSrv.addNewContract, {
					"account_id": account_id,
					"postData": dataToPost
				}, saveContractSuccessCallback, saveContractFailureCallback);
			}
		};

		/**
		 * function used to save the contract data, it will save only if there is any
		 * change found in the present contract info.
		 */
		$scope.updateContract = function() {
			var saveContractSuccessCallback = function(data) {
				$scope.$emit('hideLoader');
				$scope.errorMessage = "";
			};
			var saveContractFailureCallback = function(data) {
				$scope.$emit('hideLoader');
				$scope.errorMessage = data;
				$scope.$parent.currentSelectedTab = 'cc-contracts';
			};

			/**
			 * change date format for API call
			 */
			var dataToUpdate = JSON.parse(JSON.stringify($scope.contractData));
			var dataUpdated = false;
			if (angular.equals(dataToUpdate, contractInfo)) {
				dataUpdated = true;
			} else {
				contractInfo = dataToUpdate;
			}
			if (!dataUpdated) {
				var data = dclone($scope.contractData, ['occupancy', 'statistics', 'rates', 'total_contracted_nights']);
				if ($stateParams.id === "add") {
					var account_id = $scope.contactInformation.id;
				} else {
					var account_id = $stateParams.id;
				}
				if ($scope.contractList.contractSelected) {
					$scope.invokeApi(RVCompanyCardSrv.updateContract, {
						"account_id": account_id,
						"contract_id": $scope.contractList.contractSelected,
						"postData": data
					}, saveContractSuccessCallback, saveContractFailureCallback);
				}
			}
		};
		/**
		 * recieving function for save contract with data
		 */
		$scope.$on('saveContract', function(event) {
			event.preventDefault();

			$scope.updateContract();
		});
		/**
		 * function for close activity indicator.
		 */
		$scope.closeActivityIndication = function() {
			$scope.$emit('hideLoader');
		};
		/*
		 * To Update graph
		 */
		$scope.updateGraph = function() {
			$scope.graphData = manipulateGraphData($scope.contractData.occupancy);
			drawGraph();
		};
		/*
		 * Function to handle data change in 'Contract selected_type'.
		 * on selecting "$" , rate value must be float with 2 decimals.
		 * on selecting "%" , rate value must be integer
		 */
		$scope.$watch('contractData.selected_type', function() {
			if ($scope.contractData.selected_type === "percent") {
				$scope.contractData.rate_value = parseInt($scope.contractData.rate_value);
			} else {
				$scope.contractData.rate_value = parseFloat($scope.contractData.rate_value).toFixed(2);
			}
		});
		/*
		 * Function to handle data change in 'Contract selected_type' in Add mode
		 * on selecting "$" , rate value must be float with 2 decimals.
		 * on selecting "%" , rate value must be integer
		 */
		$scope.$watch('addData.selected_type', function() {
			if ($scope.addData.selected_type === "percent") {
				$scope.addData.rate_value = parseInt($scope.addData.rate_value);
			} else {
				$scope.addData.rate_value = $scope.addData.rate_value ? parseFloat($scope.addData.rate_value).toFixed(2) : '';
			}
		});

		var rateSource = function(request, response){

			// fetch data from server
            var fetchData = function() {
                if (request.term !== '' && $scope.autoCompleteState.lastSearchText !== request.term) {
                    $scope.invokeApi(RVCompanyCardSrv.fetchRates, {
                        'query': request.term
                    }, function(data){
                    	$scope.$emit('hideLoader');
                    	var processedResults = [];
                    	_.each(data.contract_rates,function(result){
                    		processedResults.push({
                    			label: result.name,
	                            value: result.name,
	                            type: 'CORP',
	                            id: result.id
                    		});
                    	});
                    	response(processedResults);
                    });
                    $scope.autoCompleteState.lastSearchText = request.term;
                }
            };


			if (request.term.length === 0) {
                companyCardResults = [];
                $scope.autoCompleteState.lastSearchText = "";
                $scope.autoCompleteState.selectedRate = {}
            } else if (request.term.length > 2) {
                fetchData();
            }
		};

		var onRateSelect = function(event, rate){
			if(!$scope.contractList.isAddMode){
				$scope.contractData.contracted_rate_selected = rate.item.id;
				$scope.contractData.contractedRate = rate.item.label;
			}else{
				$scope.addData.contracted_rate_selected = rate.item.id;
				$scope.addData.contractedRate = rate.item.label;
			}
		};

		$scope.autoCompleteRates = {
			delay: 0,
            minLength: 0,
            position: {
                my: 'left bottom',
                at: 'left top',
                collision: 'flip'
            },
            source: rateSource,
            select: onRateSelect
		};

	}
]);