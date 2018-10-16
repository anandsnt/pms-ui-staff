angular.module('sntRover').controller('companyCardDetailsContactCtrl', ['$scope', '$q', 'jsMappings', 'RVCompanyCardSrv', 'rvPermissionSrv', '$state', '$stateParams', 'ngDialog', '$rootScope',
	function($scope, $q, jsMappings, RVCompanyCardSrv, rvPermissionSrv, $state, $stateParams, ngDialog, $rootScope) {
		BaseCtrl.call(this, $scope);

		$scope.setScroller('companyCardDetailsContactCtrl');

		$scope.$on("contactTabActive", function() {
			refreshScroller();
		});

		$scope.isEmpty = function (obj) {
			return _.isEmpty(obj);
		};
		/*
		 * Toggle commission
		 * Show popup when disabled
		 */
		$scope.toggleCommission = function() {
			$scope.contactInformation.commission_details.is_on = !$scope.contactInformation.commission_details.is_on;
		};

		// trigger the billing information popup
	    $scope.openBillingInformation = function(accountType) {

	    	if ($scope.contactInformation.id === null || $scope.contactInformation.id === undefined) {
	    		$scope.$emit("OUTSIDECLICKED");
	    		return false;
	    	}
	    	if (accountType === 'TRAVELAGENT') {
	    		$scope.attachedEntities = {};
	    		$scope.attachedEntities.travel_agent = {};
	    		$scope.attachedEntities.travel_agent.id = $scope.contactInformation.id;
	    		$scope.attachedEntities.travel_agent.name = $scope.contactInformation.account_details.account_name;
	    		$scope.attachedEntities.travel_agent.logo = $scope.contactInformation.account_details.company_logo;
	    		$scope.billingEntity = "TRAVEL_AGENT_DEFAULT_BILLING";

	    	} else if (accountType === 'COMPANY') {
	    		$scope.attachedEntities = {};
	    		$scope.attachedEntities.company_card = {};
	    		$scope.attachedEntities.company_card.id = $scope.contactInformation.id;
	    		$scope.attachedEntities.company_card.name = $scope.contactInformation.account_details.account_name;
	    		$scope.attachedEntities.company_card.logo = $scope.contactInformation.account_details.company_logo;
	    		$scope.billingEntity = "COMPANY_CARD_DEFAULT_BILLING";


	    	} else {
	    		return false;
	    	}

	    	$scope.$emit('showLoader');
           	jsMappings.fetchAssets(['addBillingInfo', 'directives'])
            .then(function() {
            	$scope.$emit('hideLoader');
            	if ($rootScope.UPDATED_BI_ENABLED_ON['CARDS']) {
            		console.log("##Billing-info updated version");
				    ngDialog.open({
				        template: '/assets/partials/billingInformation/cards/rvBillingInfoCardsMain.html',
				        controller: 'rvBillingInfoCardsMainCtrl',
				        className: '',
				        scope: $scope
				    });
				}
			    else {
			    	console.log("##Billing-info old version");
				    ngDialog.open({
				        template: '/assets/partials/bill/rvBillingInformationPopup.html',
				        controller: 'rvBillingInformationPopupCtrl',
				        className: '',
				        scope: $scope
				    });
				}
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

		$scope.$on("BILLINGINFODELETED", function() {
			$scope.contactInformation.account_details.routes_count = 0;
		});

		$scope.$on("BILLINGINFOADDED", function() {
			$scope.contactInformation.account_details.routes_count = 1;
		});

		$scope.isUpdateEnabledForName = function() {

			var contractedRates = RVCompanyCardSrv.getContractedRates(),
				isUpdateEnabledForNameInCard = true;

			if (contractedRates) {
				if (contractedRates.current_contracts.length > 0 || contractedRates.future_contracts.length > 0 || contractedRates.history_contracts.length > 0) {
					isUpdateEnabledForNameInCard = false;
				}
			}
			
			return isUpdateEnabledForNameInCard;
		};

		$scope.isUpdateEnabledForTravelAgent = function(shouldCheckContracts) {
			if ($scope.contactInformation.is_global_enabled === undefined) {
				return;
			}
			var isDisabledFields = false;

			if ($scope.contactInformation.is_global_enabled) {
				if (!rvPermissionSrv.getPermissionValue ('GLOBAL_CARD_UPDATE')) {
					isDisabledFields = true;
				}
			} else {
				if (!rvPermissionSrv.getPermissionValue ('EDIT_TRAVEL_AGENT_CARD')) {
					isDisabledFields = true;
				}
			}
			return (shouldCheckContracts) ?  isDisabledFields || !$scope.isUpdateEnabledForName() : isDisabledFields;
		};

		$scope.isUpdateEnabled = function(shouldCheckContracts) {
			if ($scope.contactInformation.is_global_enabled === undefined) {
				return;
			}
			var isDisabledFields = false;
			
			if ($scope.contactInformation.is_global_enabled) {
				if (!rvPermissionSrv.getPermissionValue ('GLOBAL_CARD_UPDATE')) {
					isDisabledFields = true;
				}
			} else {
				if (!rvPermissionSrv.getPermissionValue ('EDIT_COMPANY_CARD')) {
					isDisabledFields = true;
				}
			}

			return (shouldCheckContracts) ?  isDisabledFields || !$scope.isUpdateEnabledForName() : isDisabledFields;
		};
	}
]);