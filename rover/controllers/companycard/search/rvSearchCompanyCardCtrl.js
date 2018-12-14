angular.module('sntRover').controller('searchCompanyCardController', ['$scope', 'RVCompanyCardSearchSrv', '$stateParams', 'ngDialog', '$timeout', 'RVCompanyCardSrv',
	function ($scope, RVCompanyCardSearchSrv, $stateParams, ngDialog, $timeout, RVCompanyCardSrv) {
		var self = this;

		const filterValues = {
			ALL: 'ALL',
			AR_ONLY: 'AR_ONLY'
		};
		const mergBtnLabels = {
			VERIFY_MERGE: 'Verify Merge',
			MERGE_CARDS: 'Merge Cards'
		};
		const mergeStatusText = {
			VERIFYING_MERGE: 'Verifying Merge',
			OK_TO_MERGE: 'Ok to Merge',
			MERGE_NOT_POSSIBLE: 'Merge not possible'
		};
		const scrollers = {
			SELECTED_CARDS_FOR_MERGE_SCROLL: 'selected_cards_for_merge_scroll',
			COMPANY_CARD_SCROLL: 'company_card_scroll'
		};

		BaseCtrl.call(this, $scope);
		$scope.heading = "Find Cards";

		$scope.hasArNumber = false;
		$scope.$emit("updateRoverLeftMenu", "cards");

		var successCallBackofInitialFetch = function (data) {
			$scope.$emit("hideLoader");
			$scope.results = data.accounts;
			setTimeout(function () {
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

		$scope.setScroller(scrollers.COMPANY_CARD_SCROLL, scrollerOptions);
		$scope.setScroller(scrollers.SELECTED_CARDS_FOR_MERGE_SCROLL, {
			tap: true,
			preventDefault: false
		});



		var refreshScroller = function () {
			$timeout(function () {
				$scope.refreshScroller(scrollers.COMPANY_CARD_SCROLL);
			}, 300);
		},
			refreshSelectedCardsScroller = () => {
				$timeout(function () {
					$scope.refreshScroller(scrollers.SELECTED_CARDS_FOR_MERGE_SCROLL);
				}, 300);
			};


		// function that converts a null value to a desired string.
		// if no replace value is passed, it returns an empty string

		$scope.escapeNull = function (value, replaceWith) {
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
		$scope.queryEntered = _.debounce(function () {
			if ($scope.textInQueryBox === "") {
				$scope.results = [];
				refreshScroller();
			} else {
				displayFilteredResults();
			}
			var queryText = $scope.textInQueryBox;

			$scope.textInQueryBox = queryText.charAt(0).toUpperCase() + queryText.slice(1);
		}, debounceSearchDelay);

		$scope.clearResults = function () {
			$scope.textInQueryBox = "";
			$scope.results = [];
		};

		/**
		 * function to perform filering on results.
		 * if not fouund in the data, it will request for webservice
		 */
		var displayFilteredResults = function () {
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
					};

					dataDict.has_ar_number = false;
					if ($scope.cardFilter === filterValues.AR_ONLY) {
						dataDict.has_ar_number = true;
					}

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
		$scope.addNewCard = function () {
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

		/**
		 * Handles the switching between merge and normal search view
		 */
		$scope.onViewChange = () => {
			if (!$scope.viewState.isViewSelected) {
				$scope.viewState.isCompanyCardSelected = true;
				self.resetSelectionsForMerge();
				refreshScroller();
			}
			$scope.cardFilter = filterValues.ALL;
			$scope.textInQueryBox = '';
			$scope.viewState.canMerge = false;
		};

		/**
		 * Handles the selection of cards for merge from the search results
		 * @param {Object} card - contains the details of CC/TA card
		 * @return {void}
		 */
		$scope.onCardSelection = (card) => {
			if (!$scope.viewState.selectedCardsForMerge.length) {
				card.isPrimary = true;
				$scope.viewState.selectedPrimaryCard = card;
			}
			if (card.selected) {
				$scope.viewState.selectedCardsForMerge.push(card);
			} else {
				$scope.viewState.selectedCardsForMerge = _.reject($scope.viewState.selectedCardsForMerge, (card) => {
					if (!card.selected) {
						card.isPrimary = false;
					}
					return !card.selected;
				});
			}
			refreshSelectedCardsScroller();
		};

		/**
		 * Handles the primary guest selection from the cards chosen for merge
		 * @param {Number} id - id of the card
		 * @return {void}
		 */
		$scope.onPrimaryGuestSelectionChange = (id) => {
			$scope.viewState.selectedCardsForMerge.forEach((card) => {
				if (card.id === id) {
					card.isPrimary = true;
					$scope.viewState.selectedPrimaryCard = card;
				} else {
					card.isPrimary = false;
				}
			});
		};

		/**
		 * Get the merge btn class name based on the current state of the merge process
		 * @return {String} className  - style class
		 */
		$scope.getMergeActionClassName = () => {
			let className = '';

			if ($scope.viewState.selectedCardsForMerge.length === 1 || $scope.showVerifyMergeProcessActivityIndicator || $scope.viewState.mergeStatusErrors.length > 0) {
				className = 'grey';
			} else if ($scope.viewState.selectedCardsForMerge.length > 1) {
				className = 'purple';
			}
			return className;
		};

		/**
		 * Verifying whether the cards selected are eligible for merging
		 */
		$scope.verifyMerge = () => {
			let onVerificationSuccess = (data) => {
				if (data.can_merge) {
					$scope.viewState.canMerge = data.can_merge;
					$scope.viewState.mergeStatusText = mergeStatusText.OK_TO_MERGE;
				} else {
					$scope.viewState.mergeStatusErrors = data.errors;
					$scope.viewState.mergeStatusText = mergeStatusText.MERGE_NOT_POSSIBLE;
				}
				$scope.showVerifyMergeProcessActivityIndicator = false;
				refreshSelectedCardsScroller();

			},
				onVerificationFailure = (errors) => {

				};
			
			$scope.showVerifyMergeProcessActivityIndicator = true;

			let selectedNonPrimaryCards = _.reject($scope.viewState.selectedCardsForMerge, (card) => {
				return card.isPrimary;
			});

			let postData = {
				card_ids: self.getNonPrimaryCardIds()
			};
			$scope.viewState.mergeStatusText = mergeStatusText.VERIFYING_MERGE;
			$scope.viewState.hasInitiatedMergeVerification = true;
			$scope.callAPI(RVCompanyCardSrv.verifyTravelAgentCompanyCardMerge, {
				params: postData,
				onSuccess: onVerificationSuccess,
				onFailure: onVerificationFailure
			});

		};

		/**
		 * Checks whether any of the selected cards have validation error after the verification process
		 * @param {Object} card selected card
		 * @return {Boolean} 
		 */
		$scope.hasMergeVerificationErrors = (card) => {
			if (_.isEmpty($scope.viewState.mergeStatusErrors)) {
				return false;
			}

			let errorMsgs = $scope.viewState.mergeStatusErrors[card.id];

			return errorMsgs && errorMsgs.length > 0;
		};

		/**
		 * Get the validation error message for the given card after the verification process
		 * @param {Object} card holds the card details
		 * @return {String} errorMsgs - contains all the validation error messages
		 */
		$scope.getErrorMsg = (card) => {
			if (_.isEmpty($scope.viewState.mergeStatusErrors)) {
				return '';
			}

			let errorMsgs = $scope.viewState.mergeStatusErrors[card.id];

			if (errorMsgs) {
				errorMsgs = errorMsgs.join(',');
			} else {
				errorMsgs = '';
			}
			return errorMsgs;
		};

		/**
		 * Handles the switch between cc/ta views
		 */
		$scope.onTravelAgentCompanyCardSwitch = () => {
			self.resetSelectionsForMerge();
			$scope.results = [];
			$scope.viewState.canMerge = false;
			$scope.queryEntered();
		};

		/**
		 * Handle the cancel action on the merge view
		 */
		$scope.cancelSelections = () => {
			let selectedIds = _.pluck($scope.viewState.selectedCardsForMerge, 'id');

			$scope.results.forEach((card) => {
				if(selectedIds.indexOf(card.id) !== -1 ) {
					card.selected = false;
					card.isPrimary = false;
				}
			});
			self.resetSelectionsForMerge();

		};

		/**
		 * Perform merging of cards
		 */
		$scope.mergeCards = () => {
			let postData = {
				card_ids: self.getNonPrimaryCardIds(),
				primary_card_id: $scope.viewState.selectedPrimaryCard.id,
				card_type: $scope.viewState.isCompanyCardSelected ? 'COMPANY' : 'TRAVELAGENT'
			},
			onMergeSuccess = (data) => {
				$scope.queryEntered();
				self.resetSelectionsForMerge();
			},
			onMergeFailure = (error) => {

			};

			$scope.callAPI(RVCompanyCardSrv.mergeCards, {
				params: postData,
				onSuccess: onMergeSuccess,
				onFailure: onMergeFailure
			});

		};

		/**
		 * Resetting the values of variables 
		 */
		self.resetSelectionsForMerge = () => {
				$scope.viewState.selectedPrimaryCard = {};
				$scope.viewState.selectedCardsForMerge = [];
				$scope.viewState.mergeStatusText = [];
				$scope.viewState.mergeStatusErrors = [];
				$scope.viewState.hasInitiatedMergeVerification = false;
		};

		/**
		 * Get non-primary cards ids
		 */
		self.getNonPrimaryCardIds = () => {
				let selectedNonPrimaryCards = _.reject($scope.viewState.selectedCardsForMerge, (card) => {
					return card.isPrimary;
				}),
				ids = [];

				if (selectedNonPrimaryCards.length > 0) {
					ids = _.pluck(selectedNonPrimaryCards, 'id');
				}
				return ids;
		};

		// Initialize the co/ta search view
		var init = () => {
			// model used in query textbox, we will be using this across
			$scope.textInQueryBox = "";
			$scope.results = [];
			$scope.cardFilter = filterValues.ALL;
			$scope.viewState = {
				isViewSelected: true,
				isCompanyCardSelected: true,
				selectedCardsForMerge: [],
				selectedPrimaryCard: {},
				mergeStatusText: '',
				hasInitiatedMergeVerification: false,
				mergeStatusErrors: []
			};
		};

		init();
	}
]);
