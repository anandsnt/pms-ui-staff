sntRover.controller('rvGroupConfigurationCtrl', [
	'$scope',
	'$rootScope',
	'rvGroupSrv',
	'$filter',
	'$stateParams',
	'rvGroupConfigurationSrv',
	'summaryData',
	function($scope, $rootScope, rvGroupSrv, $filter, $stateParams, rvGroupConfigurationSrv, summaryData) {

		BaseCtrl.call(this, $scope);


		/**
		 * whether current screen is in Add Mode
		 * @return {Boolean}
		 */
		$scope.isInAddMode = function() {
			return ($stateParams.id === "NEW_GROUP");
		};

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
				summary: summaryData.summary
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
		 * function to initialize things for group config.
		 * @return - None
		 */
		var initGroupConfig = function() {
			//setting title and things
			setTitle();

			//forming the data model if it is in add mode or populating the data if it is in edit mode
			$scope.initializeDataModelForSummaryScreen();
		};

		var cardsAutoCompleteCommon = {
			source: function(request, response) {
				rvGroupConfigurationSrv.searchCards(request.term)
					.then(function(data) {
						var list = [];
						var entry = {}
						$.map(data, function(each) {
							entry = {
								label: each.name,
								value: each.id,
								type: each.type
							};
							list.push(entry);
						});

						response(list);
					});
			},
			focus: function(event, ui) {
				return false;
			}
		}

		
		$scope.companyAutoCompleteOptions = angular.extend({
			select: function(event, ui) {
				this.value = ui.item.label;
				setTimeout(function() {
					$scope.$apply(function() {
						$scope.groupConfigData.summary.company.name = ui.item.label;
						$scope.groupConfigData.summary.company.id = ui.item.value;
					});
				}.bind(this), 100);
				return false;
			}
		}, cardsAutoCompleteCommon);

		$scope.travelAgentAutoCompleteOptions = angular.extend({
			select: function(event, ui) {
				this.value = ui.item.label;
				setTimeout(function() {
					$scope.$apply(function() {
						$scope.groupConfigData.summary.travel_agent.name = ui.item.label;
						$scope.groupConfigData.summary.travel_agent.id = ui.item.value;
					});
				}.bind(this), 100);
				return false;
			}
		}, cardsAutoCompleteCommon);


		initGroupConfig();

	}
]);