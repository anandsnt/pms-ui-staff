sntRover.controller('rvGroupConfigurationCtrl', [
	'$scope',
	'$rootScope',
	'rvGroupSrv',
	'$filter',
	'$stateParams',
	'rvGroupConfigurationSrv',
	'summaryData',
	'$state',
	function($scope, $rootScope, rvGroupSrv, $filter, $stateParams, rvGroupConfigurationSrv, summaryData, $state) {

		BaseCtrl.call(this, $scope);

		/**
		 * whether current screen is in Add Mode
		 * @return {Boolean}
		 */
		$scope.isInAddMode = function() {
			return ($stateParams.id === "NEW_GROUP");
		};

		/**
		 * Check if selecting Addons
		 * @return {Boolean} 
		 */
		$scope.isInAddonSelectionMode = function() {
			return $scope.groupConfigData.selectAddons;
		}

		/**
		 * function to set title and things
		 * @return - None
		 */
		var setTitle = function() {
			var title = $filter('translate')('GROUPS');

			// we are changing the title if we are in Add Mode
			if ($scope.isInAddMode()) {
				title = $filter('translate')('NEW_GROUP');
			}

			//yes, we are setting the headting and title
			$scope.setHeadingTitle(title);
		};

		/**
		 * function to form data model for add/edit mode
		 * @return - None
		 */
		$scope.initializeDataModelForSummaryScreen = function() {
			$scope.groupConfigData = {
				activeTab: $stateParams.activeTab, // Possible values are SUMMARY, ROOM_BLOCK, ROOMING, ACCOUNT, TRANSACTIONS, ACTIVITY
				summary: summaryData.summary,
				selectAddons: false, // To be set to true while showing addons full view
				addons: {}
			};
		};

		/**
		 * TAB - to swicth tab
		 * @return - None
		 */
		$scope.switchTabTo = function(tab) {
			$scope.groupConfigData.activeTab = tab;
		};

		/**
		 * to get the current tab url
		 * @return {String}
		 */
		$scope.getCurrentTabUrl = function() {
			var tabAndUrls = {
				'SUMMARY': '/assets/partials/groups/rvGroupConfigurationSummaryTab.html',
				'ROOM_BLOCK': '/assets/partials/groups/rvGroupConfigurationRoomBlockTab.html',
				'ROOMING': '/assets/partials/groups/rvGroupConfigurationRoomingListTab.html',
				'TRANSACTIONS': '/assets/partials/groups/rvGroupConfigurationTransactionsTab.html',
				'ACTIVITY': '/assets/partials/groups/rvGroupConfigurationActivityTab.html'
			};

			return tabAndUrls[$scope.groupConfigData.activeTab];
		};

		/**
		 * Save the new Group
		 * @return undefined
		 */
		$scope.saveNewGroup = function() {
			console.log($scope.groupConfigData.summary);
		}

		/**
		 * Discard the new Group
		 * @return undefined
		 */
		$scope.discardNewGroup = function() {
			//TODO : Clarify functionality with Nicole
		}

		$scope.onCompanyCardChange = function() {
			if ($scope.groupConfigData.summary.company && $scope.groupConfigData.summary.company.name === "") {
				$scope.groupConfigData.summary.company = null
			}
		}

		$scope.onTravelAgentCardChange = function() {
			if ($scope.groupConfigData.summary.travel_agent && $scope.groupConfigData.summary.travel_agent.name === "") {
				$scope.groupConfigData.summary.travel_agent = null
			}
		}

		/**
		 * Autocompletions for company/travel agent
		 * @return {None}
		 */
		var initializeAutoCompletions = function() {
			//this will be common for both company card & travel agent
			var cardsAutoCompleteCommon = {

				focus: function(event, ui) {
					return false;
				}
			}

			//merging auto complete setting for company card with common auto cmplt options
			$scope.companyAutoCompleteOptions = angular.extend({
				source: function(request, response) {
					rvGroupConfigurationSrv.searchCompanyCards(request.term)
						.then(function(data) {
							var list = [];
							var entry = {}
							$.map(data, function(each) {
								entry = {
									label: each.account_name,
									value: each.id,
									type: each.account_type
								};
								list.push(entry);
							});

							response(list);
						});
				},
				select: function(event, ui) {
					this.value = ui.item.label;
					$scope.groupConfigData.summary.company.name = ui.item.label;
					$scope.groupConfigData.summary.company.id = ui.item.value;
					return false;
				}
			}, cardsAutoCompleteCommon);

			//merging auto complete setting for travel agent with common auto cmplt options
			$scope.travelAgentAutoCompleteOptions = angular.extend({
				source: function(request, response) {
					rvGroupConfigurationSrv.searchTravelAgentCards(request.term)
						.then(function(data) {
							var list = [];
							var entry = {}
							$.map(data, function(each) {
								entry = {
									label: each.account_name,
									value: each.id,
									type: each.account_type
								};
								list.push(entry);
							});

							response(list);
						});
				},
				select: function(event, ui) {

					this.value = ui.item.label;
					$scope.groupConfigData.summary.travel_agent.name = ui.item.label;
					$scope.groupConfigData.summary.travel_agent.id = ui.item.value;
					return false;
				}
			}, cardsAutoCompleteCommon);
		};

		/**
		 * function to initialize things for group config.
		 * @return - None
		 */
		var initGroupConfig = function() {
			//setting title and things
			setTitle();

			//forming the data model if it is in add mode or populating the data if it is in edit mode
			$scope.initializeDataModelForSummaryScreen();

			//auto completion things
			initializeAutoCompletions();
		};

		initGroupConfig();
	}
]);