angular.module('sntRover').controller('guestCardSearchController', 
[
  '$scope',
  'RVGuestCardsSrv',
  '$stateParams',
  'ngDialog',
  '$timeout',
   function($scope, RVGuestCardsSrv, $stateParams, ngDialog, $timeout) {

		BaseCtrl.call(this, $scope);

		var GUEST_CARD_SCROLL = "guest_card_scroll",
		    debounceSearchDelay = 600, // // Delay the function execution by this much ms
		    GUEST_CARD_SEARCH_PAGINATION_ID = "guest_card_search";
		
		
		var refreshScroller = function() {
			$timeout(function() {
				$scope.refreshScroller(GUEST_CARD_SCROLL);
			}, 300);
		};

		/**
		 * Filtering/request data from service in change event of query box
		 */
		$scope.queryEntered = _.debounce(function() {
			if ($scope.textInQueryBox === "") {
				$scope.results = [];
			} else {
				displayFilteredResults();
			}
			var queryText = $scope.textInQueryBox;
			
			$scope.textInQueryBox = queryText.charAt(0).toUpperCase() + queryText.slice(1);
		}, debounceSearchDelay);

		$scope.clearResults = function() {
			$scope.textInQueryBox = "";
			$scope.results = [];
		};
				

		var successCallBackofInitialFetch = function(data) {
			$scope.$emit("hideLoader");
			$scope.results = data.accounts;
			setTimeout(function() {
				refreshScroller();
			}, 750);
		};
			
		
		// function that converts a null value to a desired string.
		// if no replace value is passed, it returns an empty string

		$scope.escapeNull = function(value, replaceWith) {
			var newValue = "";

			if ((typeof replaceWith !== "undefined") && (replaceWith !== null)) {
				newValue = replaceWith;
			}
			var valueToReturn = ((value === null || typeof value === 'undefined') ? newValue : value);

			return valueToReturn;
		};

		var onSearchSuccess = function (data) {
				$scope.results = data.results;
				$scope.totalResultCount = data.total_count;				

				setTimeout(function() {
					$scope.$broadcast('updatePagination', GUEST_CARD_SEARCH_PAGINATION_ID );
					refreshScroller();
				}, 500);
			},
			onSearchFailure = function (error) {
				$scope.results = [];
			},
			getRequestParams = function (pageNo) {
				var params = {
					query: $scope.textInQueryBox.trim(),
					per_page: RVGuestCardsSrv.PER_PAGE_COUNT,
					page: pageNo || 1
				};

				return params;
			};

		$scope.search = function (pageNo) {  
            var options = {
				params: getRequestParams(pageNo),
				successCallBack: onSearchSuccess,
				failureCallBack: onSearchFailure
			};

			$scope.callAPI(RVGuestCardsSrv.fetchGuests, options);

		};

		

		/**
		 * function to perform filering on results.
		 * if not fouund in the data, it will request for webservice
		 */
		var displayFilteredResults = function() {
			if (!$scope.textInQueryBox.length) {
				 $scope.results = [];
				// we have changed data, so we are refreshing the scrollerbar
				refreshScroller();
			} else {
				$scope.search();
				/*var dataDict = {
					'query': $scope.textInQueryBox.trim()
				};

				$scope.invokeApi(RVCompanyCardSearchSrv.fetch, dataDict, successCallBackofInitialFetch);
				
				// we have changed data, so we are refreshing the scrollerbar
				refreshScroller();*/
			}
		};

		// To impelement popup to select add new - COMPANY / TRAVEL AGENT CARD
		$scope.addNewCard = function() {
			ngDialog.open({
				template: '/assets/partials/companyCard/rvSelectCardType.html',
				controller: 'selectCardTypeCtrl',
				className: 'ngdialog-theme-default1 calendar-single1',
				closeByDocument: false,
				scope: $scope
			});
		};

		// While coming back to search screen from DISCARD button
		if ($stateParams.textInQueryBox) {
			$scope.textInQueryBox = $stateParams.textInQueryBox;
			$scope.queryEntered();
		}

		// Initialize the controller variables
		var init = function () {
			$scope.heading = "Find Guests";
			// model used in query textbox, we will be using this across
			$scope.textInQueryBox = "";
			$scope.$emit("updateRoverLeftMenu", "guests");
			$scope.results = [];

			var scrollerOptions = {
		        tap: true,
		        preventDefault: false,
		        deceleration: 0.0001,
		        shrinkScrollbars: 'clip'
	    	};

	    	$scope.setScroller(GUEST_CARD_SCROLL, scrollerOptions);

	    	$scope.guestCardPagination = {
	    		id: GUEST_CARD_SEARCH_PAGINATION_ID,
	    		perPage: 50,
	    		api: $scope.search
	    	};

		};

		init();
	}
]);
