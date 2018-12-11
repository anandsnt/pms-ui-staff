angular.module('sntRover').controller('searchCompanyCardController', ['$scope', 'RVCompanyCardSearchSrv', '$stateParams', 'ngDialog', '$timeout',
	function($scope, RVCompanyCardSearchSrv, $stateParams, ngDialog, $timeout) {

		BaseCtrl.call(this, $scope);
		$scope.heading = "Find Cards";
		// model used in query textbox, we will be using this across
		$scope.textInQueryBox = "";
		$scope.hasArNumber = false;
		$scope.$emit("updateRoverLeftMenu", "cards");
		$scope.results = [];
		var successCallBackofInitialFetch = function(data) {
				$scope.$emit("hideLoader");
				$scope.results = data.accounts;
				setTimeout(function() {
					refreshScroller();
				}, 750);
			};
			/**
			 * function used for refreshing the scroller
			 */
		// setting the scroller for view
		var scrollerOptions = {
	        tap: true,
	        preventDefault: false,
	        deceleration: 0.0001,
	        shrinkScrollbars: 'clip'
	    };

	  	$scope.setScroller('company_card_scroll', scrollerOptions);


		var refreshScroller = function() {
			$timeout(function() {
				$scope.refreshScroller('company_card_scroll');
			}, 300);
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


        var debounceSearchDelay = 600;

		/**
		 * function to perform filtering/request data from service in change event of query box
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

		/**
		 * function to perform filering on results.
		 * if not fouund in the data, it will request for webservice
		 */
		var displayFilteredResults = function() {
			if (!$scope.textInQueryBox.length) {
				// based on 'is_row_visible' parameter we are showing the data in the template
				for (var i = 0; i < $scope.results.length; i++) {
					$scope.results[i].is_row_visible = true;
				}

				// we have changed data, so we are refreshing the scrollerbar
				refreshScroller();
			} else {
				var value = "";
				var visibleElementsCount = 0;
				// searching in the data we have, we are using a variable 'visibleElementsCount' to track matching
				// if it is zero, then we will request for webservice

				for (var i = 0; i < $scope.results.length; i++) {
					value = $scope.results[i];
					if (($scope.escapeNull(value.account_first_name).toUpperCase()).indexOf($scope.textInQueryBox.toUpperCase()) >= 0 ||
						($scope.escapeNull(value.account_last_name).toUpperCase()).indexOf($scope.textInQueryBox.toUpperCase()) >= 0) {
						$scope.results[i].is_row_visible = true;
						visibleElementsCount++;
					} else {
						$scope.results[i].is_row_visible = false;
					}

				}
				// last hope, we are looking in webservice.
				if (visibleElementsCount === 0) {
					var dataDict = {
						'query': $scope.textInQueryBox.trim(),
						'has_ar_number': $scope.hasArNumber
					};

					if (!$scope.viewState.isViewSelected) {
						dataDict.account_type = 'COMPANY';
						if (!$scope.viewState.isCompanyCardSelected) {
							dataDict.account_type = 'TRAVELAGENT';
						}
					}

					$scope.invokeApi(RVCompanyCardSearchSrv.fetch, dataDict, successCallBackofInitialFetch);
				}
				// we have changed data, so we are refreshing the scrollerbar
				refreshScroller();
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

		// Switch between view/merge screens
		$scope.onViewChange = () => {			
			if($scope.viewState.isViewSelected) {
				$scope.viewState.isCompanyCardSelected = true;
			}
		};

		$scope.onCardSelection = (card) => {
			if(!$scope.selectedCardsForMerge.length) {
				card.isPrimary = true;
			}
			$scope.selectedCardsForMerge.push(card);
		};

		$scope.onPrimaryGuestSelectionChange = (id) => {
			$scope.selectedCardsForMerge.forEach((card) => {
				if (card.id === id)	{
					card.isPrimary = true;
				} else {
					card.isPrimary = false;
				}
			})
		};

		// Initialize the co/ta search view
		var init = () => {
			$scope.viewState = {
				isViewSelected: true,
				isCompanyCardSelected: true
			};
			$scope.selectedCardsForMerge = [];
		};

		init();
	}
]);
