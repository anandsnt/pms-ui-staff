sntRover.controller('rvGroupConfigurationCtrl', [
	'$scope', 
	'$rootScope', 
	'rvGroupSrv', 
	'$filter', 
	'$stateParams', 
	'rvGroupConfigurationSrv',
	'summaryData',
	function($scope, 
		$rootScope, 
		rvGroupSrv, 
		$filter, 
		$stateParams, 
		rvGroupConfigurationSrv,
		summaryData) {

		BaseCtrl.call(this, $scope);


		/**
		* whether current screen is in Add Mode
		* @return {Boolean}		
		*/
		$scope.isInAddMode = function(){
			return ($stateParams.id === "NEW_GROUP");
		};

		/**
		* function to set title and things
		* @return - None
		*/
		var setTitle = function(){
			var title = $filter('translate')('GROUPS');
			
			// we are changing the title if we are in Add Mode
			if ($scope.isInAddMode()){
				title = $filter('translate')('NEW_GROUP');
			}

			//yes, we are setting the headting and title
			$scope.setHeadingTitle(title);			
		}; 
		
		/**
		* function to form data model for add/edit mode
		* @return - None
		*/
		$scope.initializeDataModelForSummaryScreen = function(){
			$scope.groupConfigState = {
				activeTab: $stateParams.activeTab, // Possible values are SUMMARY, ROOM_BLOCK, ROOMING, ACCOUNT, TRANSACTIONS, ACTIVITY
				summary: summaryData.summary
			};
		};


		var initGroupConfig = function() {
			//setting title and things
			setTitle();

			//forming the data model if it is in add mode or populating the data if it is in edit mode
			$scope.initializeDataModelForSummaryScreen();
		};

		$scope.openDemographicsPopup = function() {
			console.log('openDemographicsPopup');
		}

		$scope.isAddMode = function() {
			return $stateParams.id === "NEW_GROUP";
		}

		initGroupConfig();

	}
]);