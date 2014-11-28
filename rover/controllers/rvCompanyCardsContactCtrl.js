sntRover.controller('companyCardDetailsContactCtrl', ['$scope', 'RVCompanyCardSrv', '$state', '$stateParams', 'ngDialog',
	function($scope, RVCompanyCardSrv, $state, $stateParams, ngDialog) {
		BaseCtrl.call(this, $scope);

		$scope.setScroller('companyCardDetailsContactCtrl');

		$scope.$on("contactTabActive", function() {
			refreshScroller();
		});

		$scope.routesCount = 5;

		//trigger the billing information popup
	    $scope.openBillingInformation = function(accountType){
	    	if(accountType == 'TRAVELAGENT'){
	    		$scope.attachedEntities = {};
	    		$scope.attachedEntities.travel_agent = {};
	    		$scope.attachedEntities.travel_agent.id = $scope.contactInformation.id;
	    		$scope.attachedEntities.travel_agent.name = $scope.contactInformation.account_details.account_name;
	    		$scope.attachedEntities.travel_agent.logo = $scope.contactInformation.account_details.company_logo;
	    		$scope.attachedEntities.type = "TRAVEL_AGENT_DEFAULT_BILLING";
	    	} else if (accountType == 'COMPANY'){
	    		$scope.attachedEntities = {};
	    		$scope.attachedEntities.company_card = {};
	    		$scope.attachedEntities.company_card.id = $scope.contactInformation.id;
	    		$scope.attachedEntities.company_card.name = $scope.contactInformation.account_details.account_name;
	    		$scope.attachedEntities.company_card.logo = $scope.contactInformation.account_details.company_logo;
	    		$scope.attachedEntities.type = "COMPANY_CARD_DEFAULT_BILLING";
	    	} else {
	    		return false;
	    	}
	    	
		    ngDialog.open({
		        template: '/assets/partials/bill/rvBillingInformationPopup.html',
		        controller: 'rvBillingInformationPopupCtrl',
		        className: '',
		        scope: $scope
		    });
	    };

		$scope.$on("setCardContactErrorMessage", function($event, errorMessage) {
			$scope.errorMessage = errorMessage;
		});

		$scope.$on("clearCardContactErrorMessage", function() {
			$scope.errorMessage = "";
		});

		var refreshScroller = function() {
			$scope.refreshScroller('companyCardDetailsContactCtrl');
		};

	}
]);