sntRover.controller('RvArPostChargeController', 
	[ '$rootScope', 
	'$scope', 
	'ngDialog',
	'RVPostChargeSrvV2',
	'sntActivity',
    function($rootScope, $scope, ngDialog, RVPostChargeSrvV2, sntActivity) {
	BaseCtrl.call(this, $scope);
	$scope.searchedItems = [];
	$scope.isItemsToShow = false;
	$scope.queryValue = "";
	$scope.selectedItem = {};
	$scope.totalAmount = 0;
	$scope.showCalculationArea = false;
	
	// Close popup
	$scope.closeDialog = function() {
		ngDialog.close();
	};

	// jquery autocomplete Souce handler
    // get two arguments - request object and response callback function
    var autoCompleteSourceHandler = function(request, response) {

        var chargeCodeResults = [],
            lastSearchText = '',
            eachItem = {},
            hasItem = false;
        /*
         * Successcallback 
         */
        var successCallBackFetchChargeCodes = function (data) {
			sntActivity.stop("SEARCH_ITEMS_IN_AR_POST_CHARGE");
			angular.forEach(data.results, function(item) {
                item.label = item.name;
                item.curreny = $rootScope.currencySymbol;
            });
			chargeCodeResults = data.results;
			response(chargeCodeResults);
		};

        // fetch data from server
        var queryEntered = function() {
        	sntActivity.start("SEARCH_ITEMS_IN_AR_POST_CHARGE");
            var params = {
				"query": $scope.queryValue ? $scope.queryValue.toLowerCase() : '',
				"page": 1,
				"per_page": 50,
				"charge_group_id": '',
				"is_favorite": 0
			};
			$scope.invokeApi( RVPostChargeSrvV2.searchChargeItems, params, successCallBackFetchChargeCodes );
        };

        if (request.term.length === 0) {
            chargeCodeResults = [];
            lastSearchText = "";
            
        } else if (request.term.length > 2) {
            queryEntered();
        }
    };

    var autoCompleteSelectHandler = function(event, ui) {
    	$scope.selectedItem = ui.item;
    	$scope.totalAmount = ui.item.unit_price;
    	$scope.showCalculationArea = true;
    };

	$scope.autocompleteOptions = {
        delay: 0,
        minLength: 0,
        position: {
            of: "#new-charge-input",
            my: 'left top',
            at: 'left bottom',
            collision: 'flip',
            within: '#new-charge'
        },
        source: autoCompleteSourceHandler,
        select: autoCompleteSelectHandler
    };

    $scope.postCharge = function() {

    }	

}]);