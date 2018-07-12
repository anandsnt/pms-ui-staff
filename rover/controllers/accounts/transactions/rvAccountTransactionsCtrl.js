sntRover.controller('rvAccountTransactionsCtrl', [
	'$scope',
	'$rootScope',
	'$filter',
	'$stateParams',
	'ngDialog',
	'rvAccountsConfigurationSrv',
	'RVReservationSummarySrv',
	'rvAccountTransactionsSrv',
	'RVPaymentSrv',
	'RVReservationCardSrv',
	'RVBillCardSrv',
	'rvPermissionSrv',
	'$timeout',
	'$window',
	'$q',
	'jsMappings',
	'sntActivity',
	function($scope,
		$rootScope,
		$filter,
		$stateParams,
		ngDialog,
		rvAccountsConfigurationSrv,
		RVReservationSummarySrv,
		rvAccountTransactionsSrv,
		RVPaymentSrv,
		RVReservationCardSrv,
		RVBillCardSrv,
		rvPermissionSrv,
		$timeout,
		$window,
		$q,
		jsMappings,
		sntActivity) {

		BaseCtrl.call(this, $scope);
		var that = this;

		$scope.perPage = 50;
		$scope.businessDate = $rootScope.businessDate;

		$scope.hasMoveToOtherBillPermission = function() {
			return ($rootScope.isStandAlone && rvPermissionSrv.getPermissionValue ('MOVE_CHARGES_RESERVATION_ACCOUNT'));
  		};

  		// only for standalone
		var setChargeCodesSelectedStatus = function(bool) {
				var billTabsData = $scope.transactionsDetails.bills,
				    chargeCodes = billTabsData[$scope.currentActiveBill].transactions;

				chargeCodesId = [];
				_.each(chargeCodes, function(chargeCode) {
				  chargeCode.isSelected = bool;
				  chargeCodesId.push(chargeCode.id);
				});
				$scope.transactionsDetails.isAllChargeCodeSelected = bool;
		};

		/*
		 * Check if all the items are selected
		 */
		$scope.isAllChargeCodesSelected = function() {
			var isAllChargeCodesSelected = true,
			    billTabsData = $scope.transactionsDetails.bills;

			if (!$rootScope.isStandAlone) {
				isAllChargeCodesSelected = false;
			}
			else {
				var chargeCodes = billTabsData[$scope.currentActiveBill].transactions;

				if (chargeCodes) {
					if (chargeCodes.length > 0) {
						_.each(chargeCodes, function(chargeCode) {
						  if (!chargeCode.isSelected) {
							isAllChargeCodesSelected = false;
						  }
						});
					} else {
						isAllChargeCodesSelected = false;
					}
				} else {
					isAllChargeCodesSelected = false;
				}
			}
			return isAllChargeCodesSelected;
		};

		/*
		* Check if selection is partial
		*/
		$scope.isAnyOneChargeCodeIsExcluded = function() {
			var isAnyOneChargeCodeIsExcluded = false,
			    isAnyOneChargeCodeIsIncluded = false,
			    billTabsData = $scope.transactionsDetails.bills,
			    chargeCodes = billTabsData[$scope.currentActiveBill].transactions;

			if (!!chargeCodes && chargeCodes.length > 0) {
				_.each(chargeCodes, function(chargeCode, index) {
				  if (!chargeCode.isSelected) {
				  	isAnyOneChargeCodeIsExcluded = true;
				  }
				  else {
				  	isAnyOneChargeCodeIsIncluded = true;
				  }
				});
			}
			else {
				isAnyOneChargeCodeIsExcluded = false;
				isAnyOneChargeCodeIsIncluded = false;
			}
			return isAnyOneChargeCodeIsExcluded && isAnyOneChargeCodeIsIncluded;
		};

		$scope.selectAllChargeCodeToggle = function() {
			$scope.transactionsDetails.isAllChargeCodeSelected ? setChargeCodesSelectedStatus(true) : setChargeCodesSelectedStatus(false);
		};

		$scope.moveChargesClicked = function() {
			sntActivity.start('MOVE_CHARGES_CLICKED');
			jsMappings.fetchAssets(['addBillingInfo', 'directives'])
			.then(function() {
				sntActivity.stop('MOVE_CHARGES_CLICKED');

				var billTabsData = $scope.transactionsDetails.bills;
				var chargeCodes = billTabsData[$scope.currentActiveBill].transactions;
				// Data to pass to the popup
				// 1. Selected transaction ids
				// 2. Confirmation number
				// 3. AccountName
				// 4. CurrentBillNumber
				// 5. Current Bill id

				$scope.moveChargeData = {};
				$scope.moveChargeData.selectedTransactionIds = [];
				var accountName = (typeof $scope.accountConfigData.summary.posting_account_name !== "undefined") ? $scope.accountConfigData.summary.posting_account_name : "";

				$scope.moveChargeData.displayName = accountName;
				$scope.moveChargeData.currentActiveBillNumber = parseInt($scope.currentActiveBill) + parseInt(1);
				$scope.moveChargeData.fromBillId = billTabsData[$scope.currentActiveBill].bill_id;


				if (chargeCodes.length > 0) {
					_.each(chargeCodes, function(chargeCode, index) {
						if (chargeCode.isSelected) {
							if (chargeCode.is_group_by_ref) {
								var concatObject = $scope.moveChargeData.selectedTransactionIds.concat(chargeCode.item_ids);

								$scope.moveChargeData.selectedTransactionIds = concatObject;
							}
							else {
								$scope.moveChargeData.selectedTransactionIds.push(chargeCode.id);
							}
						}
					});
					ngDialog.open({
						template: '/assets/partials/bill/rvMoveTransactionPopup.html',
						controller: 'RVMoveChargeCtrl',
						className: '',
						scope: $scope
					});
				}
				else {
					return;
				}
			});
		};

		/**
		 * function to check whether the user has permission
		 * to make move charges from one bill to another
		 * @return {Boolean}
		 */
		$scope.hasPermissionToMoveCharges = function() {
			return rvPermissionSrv.getPermissionValue('GROUP_MOVE_CHARGES_BILL');
		};


		var initAccountTransactionsView = (function() {
			// Scope variable to set active bill
			$scope.currentActiveBill = 0;
			$scope.dayRates = -1;

			$scope.isStandAlone = $rootScope.isStandAlone;

			$scope.setScroller('registration-content');
			$scope.setScroller('bill-tab-scroller', {
				scrollX: true
			});
			$scope.setScroller('billDays', {
				scrollX: true
			});
			$scope.showMoveCharges = $scope.hasPermissionToMoveCharges();
			$scope.renderData = {}; // payment modal data - naming so as to reuse HTML
			// TODO: Fetch accoutn transactions
			$scope.paymentModalOpened = false;

			$scope.isFromGroups = (typeof $scope.groupConfigData !== "undefined" && $scope.groupConfigData.activeTab === "TRANSACTIONS");

			$scope.invoiceDate = $rootScope.businessDate;

		}());

		/*
		 * Call black box api to get control digits
		 */
		var requestControlDigitsFromBlackBox = function() {

			var successCallBackOfBlackBoxApi = function(data) {
					$scope.transactionsDetails.bills[$scope.currentActiveBill].is_active = false;
			},
			failureCallBackOfBlackBoxApi = function(errorMessage) {
				$scope.errorMessage = errorMessage;
			},
			paramsToService = {
				'bill_id': $scope.transactionsDetails.bills[$scope.currentActiveBill].bill_id
			};

			var options = {
				params: paramsToService,
				successCallBack: successCallBackOfBlackBoxApi,
				failureCallBack: failureCallBackOfBlackBoxApi
			};

			$scope.callAPI( RVBillCardSrv.callBlackBoxApi, options );
		};

		/*
		 * Function to generate folio number
		 * @param billId is the bill id
		 * @param balanceAmount is the balance Amount
		 */
		that.generateFolioNumber = function (billId, balanceAmount, isFolioNumberExists) {

			$scope.shouldGenerateFolioNumber = false;
			if (balanceAmount === "0.0" && !isFolioNumberExists) {

				var successCallBackOfGenerateFolioNumber = function(data) {
						$scope.transactionsDetails.bills[$scope.currentActiveBill].is_active = false;
						$scope.transactionsDetails.bills[$scope.currentActiveBill].is_folio_number_exists = true;
					},
					paramsToService = {
						'bill_id': billId
					},
				    options = {
						params: paramsToService,
						successCallBack: successCallBackOfGenerateFolioNumber
					};
							
				$scope.callAPI( RVBillCardSrv.generateFolioNumber, options );
			}		
		};


		/**
		 * Successcallback of transaction list fetch
		 * @param  {[type]} data [description]
		 * @return undefined
		 */
		var onTransactionFetchSuccess = function(data) {

			$scope.transactionsDetails = data;

			var currentActiveBill = $scope.transactionsDetails.bills[$scope.currentActiveBill];

			// Balance amount must be zero and only after payment success - call black box api
			if (currentActiveBill.balance_amount === "0.0" && $scope.isFromPaymentScreen) {
				$scope.isFromPaymentScreen = false;
				if ($rootScope.isInfrasecActivated && $rootScope.isInfrasecActivatedForWorkstation) {
					requestControlDigitsFromBlackBox();
				}
				
			} 
			if (currentActiveBill.balance_amount === "0.0") {

				if ($rootScope.roverObj.hasActivatedFolioNumber && $scope.shouldGenerateFolioNumber) {
					that.generateFolioNumber(currentActiveBill.bill_id, currentActiveBill.balance_amount, currentActiveBill.is_folio_number_exists);
				}
			}

			configSummaryDateFlags();
			loadDefaultBillDateData();

			$scope.refreshScroller('bill-tab-scroller');
			$scope.refreshScroller('billDays');
		};

		/*
		 * success method move charge
		 */
		var moveChargeSuccess = $scope.$on('moveChargeSuccsess', function() {

			var chargesMoved = function(data) {
					onTransactionFetchSuccess(data);
				},
				params = {
					"account_id": $scope.accountConfigData.summary.posting_account_id
				},
			    options = {
					params: params,
					successCallBack: chargesMoved
				};

			$scope.callAPI(rvAccountTransactionsSrv.fetchTransactionDetails, options);
		});

		$scope.$on('$destroy', moveChargeSuccess);

		/**
		 * API calling method to get the transaction details
		 * @return - undefined
		 */
		var getTransactionDetails = function() {
			var params = {
				"account_id": $scope.accountConfigData.summary.posting_account_id
				},
				options = {
					successCallBack: onTransactionFetchSuccess,
					params: params
				};

			$scope.callAPI(rvAccountTransactionsSrv.fetchTransactionDetails, options);
		};

		$scope.UPDATE_TRANSACTION_DATA = function() {
			getTransactionDetails();
		};

		/*
		 *  Bill data need to be updated after success action of
		 *  payment, post charges, split/edit etc...
		 *
		 */
		var updateTransactionData = $scope.$on('UPDATE_TRANSACTION_DATA', function(event, data) {

			$scope.shouldGenerateFolioNumber = true;	
			$scope.isFromPaymentScreen = data.isFromPaymentSuccess;
			getTransactionDetails();
		});

		// To destroy listener
		$scope.$on('$destroy', updateTransactionData);
		/*
		 * To create new bill
		 */
		$scope.createNewBill = function() {
			var billData = {
					"account_id": $scope.accountConfigData.summary.posting_account_id
				},
				createBillSuccessCallback = function(data) {
					// Fetch data again to refresh the screen with new data
					getTransactionDetails();
				},
			    options = {
					params: billData,
					successCallBack: createBillSuccessCallback
				};

			$scope.callAPI(rvAccountTransactionsSrv.createAnotherBill, options);
		};

		$scope.moveToBillActionfetchSuccessCallback = function(data) {
			$scope.fetchSuccessCallback(data);
		};

		/*
		 * MOve fees item from one bill to another
		 * @param {int} old Bill Value
		 * @param {int} fees index
		 */
		$scope.moveToBillAction = function(oldBillValue, feesIndex) {

			var parseOldBillValue = parseInt(oldBillValue) - 1,
			    transactionData = $scope.transactionsDetails.bills[parseOldBillValue].transactions[feesIndex],
			    newBillValue = transactionData.billValue,
				transactionId = transactionData.id ? transactionData.id : null,
				itemIdList = transactionData.item_ids ? transactionData.item_ids : [];

			var dataToMove = {
				"to_bill": newBillValue,
				"from_bill": oldBillValue,
				"transaction_id": transactionId,
				'item_ids': itemIdList,
				"account_id": $scope.accountConfigData.summary.posting_account_id
			};

			/*
			 * Success Callback of move action
			 */
			var moveToBillSuccessCallback = function(data) {
				$scope.$emit('hideLoader');
				// Fetch data again to refresh the screen with new data
				getTransactionDetails();
			};

			/*
			 * Failure Callback of move action
			 */
			var moveToBillFailureCallback = function(data) {
				$scope.$emit('hideLoader');
				$scope.errorMessage = data.errorMessage;
			};

			$scope.invokeApi(rvAccountTransactionsSrv.moveToAnotherBill, dataToMove, moveToBillSuccessCallback, moveToBillFailureCallback );
		};


		// Calculate the scroll width for bill tabs in all the cases
		$scope.getWidthForBillTabsScroll = function() {

			var width = 0;

			if ($scope.transactionsDetails !== undefined) {
				var width = $('#registration-summary ul li').width() * ($scope.transactionsDetails.bills.length + 1);

			}
			return width;
		};

		$scope.showActiveBill = function(index) {
			var activeBill = $scope.transactionsDetails.bills[index],
				activeBillClass = "",
				billCount = $scope.transactionsDetails.bills.length,
				isTransactionsExist = activeBill.is_transactions_exist;
			
			// CICO-37047 : We need to show Remove Bill icon ('X') for -
			// a last bill window having no transactions exist.
			if (index !== 0 && index === $scope.currentActiveBill && (billCount - 1 === index) && !isTransactionsExist) {
				activeBillClass = "ui-tabs-active ui-state-active with-button";
			}
			else if (index === $scope.currentActiveBill) {
				activeBillClass = "ui-tabs-active ui-state-active";
			}
			return activeBillClass;
		};

		/*
		 * Set clicked bill active and show corresponding days/packages/addons calender
		 * @param {int} index of bill
		 */
		$scope.setActiveBill = function(billIndex) {
			$scope.currentActiveBill = billIndex;
			loadDefaultBillDateData();
		};

		$scope.openPostCharge = function( activeBillNo ) {
			// Show a loading message until promises are not resolved
			sntActivity.start("OPEN_POST_CHARGE");

			jsMappings.fetchAssets(['postcharge', 'directives'])
			.then(function() {
				sntActivity.stop("OPEN_POST_CHARGE");

				// pass on the reservation id
				$scope.account_id = $scope.accountConfigData.summary.posting_account_id;
				$scope.billNumber = activeBillNo;

				var bills = [];

				for (var i = 0; i < $scope.transactionsDetails.bills.length; i++ ) {
					bills.push(i + 1);
				}

				$scope.fetchedData = {};
				$scope.fetchedData.bill_numbers = bills;
				$scope.isOutsidePostCharge = false;

				ngDialog.open({
					template: '/assets/partials/postCharge/rvPostChargeV2.html',
					className: '',
					scope: $scope
				});
			});
		};

		var fetchPaymentMethods = function(directBillNeeded) {

			var directBillNeeded = (directBillNeeded === "directBillNeeded"),
			    onPaymnentFetchSuccess = function(data) {
					$scope.renderData = data;
					$scope.creditCardTypes = [];
					angular.forEach($scope.renderData, function(item, key) {
						if (item.name === 'CC') {
							$scope.creditCardTypes = item.values;
						}
					});
				},
				onPaymnentFetchFailure = function(errorMessage) {
					$scope.errorMessage = errorMessage;
				};

			$scope.callAPI(RVPaymentSrv.renderPaymentScreen, {
				successCallBack: onPaymnentFetchSuccess,
				failureCallBack: onPaymnentFetchFailure,
				params: {
					direct_bill: directBillNeeded
				}
			});
		};

		var getPassData = function() {
			var passData = {
				"account_id": $scope.accountConfigData.summary.posting_account_id,
				"is_swiped": false,
				"details": {
					"firstName": "",
					"lastName": ""
				}
			};

			return passData;
		};

		$scope.showPayemntModal = function() {
			sntActivity.start("SHOW_PAYMENT_MODEL");
			jsMappings.fetchAssets(['addBillingInfo', 'directives'])
			.then(function() {
				sntActivity.stop("SHOW_PAYMENT_MODEL");
				$scope.passData = getPassData();
				ngDialog.open({
					template: '/assets/partials/accounts/transactions/rvAccountPaymentModal.html',
					className: '',
					controller: 'RVAccountsTransactionsPaymentCtrl',
					closeByDocument: false,
					scope: $scope
				});
				$scope.paymentModalOpened = true;
			});
		};

		$scope.$on("showValidationErrorPopup", function(event, errorMessage) {
			$scope.status = "error";
			$scope.popupMessage = errorMessage;
			$timeout(function() {
				ngDialog.open({
					template: '/assets/partials/validateCheckin/rvShowValidation.html',
					controller: '',
					scope: $scope
				});
			}, 100);
		});

		$scope.okButtonClicked = function() {
			cancelPopup();
		};
		var cancelPopup = function() {
			ngDialog.close();
		};

		var modalOpened = $scope.$on('HANDLE_MODAL_OPENED', function(event) {
			$scope.paymentModalOpened = false;
		});

		$scope.$on('$destroy', modalOpened);

		/*
		 *	MLI SWIPE actions
		 */
		var processSwipedData = function(swipedCardData) {

			var passData = getPassData(),
			    swipeOperationObj = new SwipeOperation(),
			    swipedCardDataToRender = swipeOperationObj.createSWipedDataToRender(swipedCardData);

			passData.details.swipedDataToRenderInScreen = swipedCardDataToRender;
			$scope.$broadcast('SHOW_SWIPED_DATA_ON_PAY_SCREEN', swipedCardDataToRender);

		};

		/*
		 * Handle swipe action in bill card
		 */
		$scope.$on('SWIPE_ACTION', function(event, swipedCardData) {

			if ($scope.paymentModalOpened) {
				var swipeOperationObj = new SwipeOperation(),
				    getTokenFrom = swipeOperationObj.createDataToTokenize(swipedCardData),
				    tokenizeSuccessCallback = function(tokenValue) {
						$scope.$emit('hideLoader');
						swipedCardData.token = tokenValue;
						processSwipedData(swipedCardData);
					};

				$scope.invokeApi(RVReservationCardSrv.tokenize, getTokenFrom, tokenizeSuccessCallback);
			} else {
				return;
			}
		});

		/* ------------- edit/remove/split starts here --------------*/

		/**
		 * function to check whether the user has permission
		 * to Edit/Split/Move/Delete charges
		 * @return {Boolean}
		 */
		var hasPermissionToChangeCharges = function(type) {
			// hide edit and remove options in case type is  payment
			var hasRemoveAndEditPermission  = (type !== "PAYMENT"),
			    splitPermission = rvPermissionSrv.getPermissionValue('SPLIT_CHARGES'),
				editPermission = rvPermissionSrv.getPermissionValue('EDIT_CHARGES'),
				deletePermission = rvPermissionSrv.getPermissionValue('DELETE_CHARGES');

			return ((hasRemoveAndEditPermission && (editPermission || deletePermission)) || splitPermission);
		};

		/**
		* function to check whether the user has permission
		* to Edit charge code description.
		* @return {Boolean}
		*/
		$scope.hasPermissionToEditChargeCodeDescription = function() {
			return rvPermissionSrv.getPermissionValue ('EDIT_CHARGECODE_DESCRIPTION');
		};

		/**
		* function to check whether the user has permission
		* to Split charges
		* @return {Boolean}
		*/
		$scope.hasPermissionToSplitCharges = function() {
			return rvPermissionSrv.getPermissionValue ('SPLIT_CHARGES');
		};

		/**
		* function to check whether the user has permission
		* to Edit charges
		* @return {Boolean}
		*/
		$scope.hasPermissionToEditCharges = function() {
			return rvPermissionSrv.getPermissionValue ('EDIT_CHARGES');
		};

		/**
		* function to check whether the user has permission
		* to Delete charges
		* @return {Boolean}
		*/
		$scope.hasPermissionToDeleteCharges = function() {
			return rvPermissionSrv.getPermissionValue ('DELETE_CHARGES');
		};

		/**
		 * function to decide whether to show Edit charge button
		 * @param {String} - Fees type value
		 * @return {Boolean}
		 */
		$scope.showEditChargeButton = function(feesType) {
			return ($rootScope.isStandAlone &&
				feesType !== 'TAX' &&
				hasPermissionToChangeCharges());
		};

		/*
		 *  set default values for split/edit/remove popups
		 *  We reuse the HTMLs used in reservation bill screen
		 *  However here the postings are against the <account_id> we use seperate controllers
		 */
		$scope.splitTypeisAmount = true;
		$scope.chargeCodeActive = false;
		$scope.selectedChargeCode = {};

		$scope.getAllchargeCodes = function(callback) {
			callback($scope.chargeCodeData);
		};

		$scope.setchargeCodeActive = function(bool) {
			$scope.chargeCodeActive = bool;
		};

		$scope.HIDE_LOADER_FROM_POPUP =  function() {
			$scope.$emit("hideLoader");
		};

		/*
		 * open popup for selecting edit/split/remove transaction
		 */
		$scope.openActionsPopup = function(id, desc, amount, type, credits, reference_text, show_ref_on_invoice) {

			$scope.errorMessage = "";
			// hide edit and remove options in case type is  payment
			$scope.hideRemoveAndEdit  = (type === "PAYMENT") ? true : false;
			$scope.selectedTransaction = {};
			$scope.selectedTransaction.id = id;
			$scope.selectedTransaction.desc = desc;
			$scope.reference_text = reference_text;
			$scope.show_ref_on_invoice = show_ref_on_invoice;

			if (amount) {
				$scope.selectedTransaction.amount = amount;
			} else if (credits) {
				$scope.selectedTransaction.amount = credits;
			}

			ngDialog.open({
				template: '/assets/partials/bill/rvBillActionsPopup.html',
				className: '',
				scope: $scope
			});
		};
		/*
		 * popup individual popups based on selection
		 */
		$scope.callActionsPopupAction = function(action) {

			ngDialog.close();
			if (action === "custom_description") {
				$scope.openEditChargeDescPopup();
			} else if (action === "remove") {
				$scope.openRemoveChargePopup();
			} else if (action === "split") {
				$scope.openSplitChargePopup();
			} else if (action === "edit") {
				$scope.openEditChargePopup();
			}
		};
		/*
		 * open popup for remove transaction
		 * We are using same controller for split/edit and remove as those needs just one function each
		 *
		 */
		$scope.openRemoveChargePopup = function() {
			ngDialog.open({
				template: '/assets/partials/bill/rvRemoveChargePopup.html',
				controller: 'RVAccountTransactionsPopupCtrl',
				className: '',
				scope: $scope
			});
		};
		/*
		 * open popup for edit charge code
		 */
		$scope.openEditChargeDescPopup = function() {
			ngDialog.open({
				template: '/assets/partials/bill/rvEditChargePopup.html',
				controller: 'RVAccountTransactionsPopupCtrl',
				className: '',
				scope: $scope
			});
		};
		/*
		 * open popup for split transaction
		 */
		$scope.openSplitChargePopup = function() {
			ngDialog.open({
				template: '/assets/partials/bill/rvSplitChargePopup.html',
				controller: 'RVAccountTransactionsPopupCtrl',
				className: '',
				scope: $scope
			});
		};
		/*
		 * open popup for edit transaction
		 */
		$scope.openEditChargePopup = function() {
			$scope.selectedChargeCode = {
				"id": "",
				"name": "",
				"description": "",
				"associcated_charge_groups": []
			};
			ngDialog.open({
				template: '/assets/partials/bill/rvEditPostingPopup.html',
				className: '',
				controller: 'RVAccountTransactionsPopupCtrl',
				scope: $scope
			});
			$scope.setScroller('chargeCodesList');
		};

		/* ----------- edit/remove/split ends here ---------------*/
		// CICO-13903
		$scope.sendEmail = function(params) {
			var mailSent = function(data) {
					// Handle mail Sent Success
					$scope.statusMsg = $filter('translate')('EMAIL_SENT_SUCCESSFULLY');
					$scope.status = "success";
					$scope.showEmailSentStatusPopup();
				},
				mailFailed = function(errorMessage) {
					$scope.statusMsg = $filter('translate')('EMAIL_SEND_FAILED');
					$scope.status = "alert";
					$scope.showEmailSentStatusPopup();
				};

			$scope.callAPI(rvAccountsConfigurationSrv.emailInvoice, {
				successCallBack: mailSent,
				failureCallBack: mailFailed,
				params: params
			});
		};

		$scope.clickedEmail = function(requestParams) {
			$scope.closeDialog();
			$scope.sendEmail(requestParams);
		};

		$scope.clickedPrint = function(requestParams) {
				printBillCard(requestParams);
		};

		var printBillCard = function(requestParams) {

			var printBillSuccess = function(response) {
				$scope.$emit('hideLoader');
				$scope.printData = response.data;
				$scope.errorMessage = "";

				$('.nav-bar').addClass('no-print');
				$('.cards-header').addClass('no-print');
				$('.card-tabs-nav').addClass('no-print');

				// this will show the popup with full report
				$timeout(function() {

					/*
					 *	======[ PRINTING!! JS EXECUTION IS PAUSED ]======
					 */

					$window.print();
					if (sntapp.cordovaLoaded) {
						cordova.exec(function(success) {}, function(error) {}, 'RVCardPlugin', 'printWebView', []);
					}

					$('.nav-bar').removeClass('no-print');
					$('.cards-header').removeClass('no-print');
					$('.card-tabs-nav').removeClass('no-print');

				}, 100);
			};

			var printBillFailure = function(errorData) {
				$scope.$emit('hideLoader');
				$scope.errorMessage = errorData;
			};

			$scope.invokeApi(rvAccountTransactionsSrv.fetchAccountBillsForPrint, requestParams, printBillSuccess, printBillFailure);
		};

		// Direct Bill payment starts here

		var proceedPayment = function(arType) {
			var successPayment = function() {
				$scope.$emit('hideLoader');
				// Fetch data again to refresh the screen with new data
				getTransactionDetails();
				$scope.diretBillpaymentData = {};
			};

			$scope.callAPI(rvAccountTransactionsSrv.submitPaymentOnBill, {
				successCallBack: successPayment,
				params: $scope.diretBillpaymentData
			});
		};

		$rootScope.$on('arAccountCreated', function() {
			 $scope.diretBillpaymentData.data_to_pass.is_new_ar_account = true;
			 proceedPayment();
		});
		// setUp data from the payament modal for future usage
		var arAccountWillBeCreated = $scope.$on('arAccountWillBeCreated', function(e, arg) {
				$scope.account_id = arg.account_id;
				$scope.is_auto_assign_ar_numbers = arg.is_auto_assign_ar_numbers;
				$scope.diretBillpaymentData = arg.paymentDetails;
				ngDialog.open({
					template: '/assets/partials/payment/rvAccountReceivableMessagePopup.html',
					controller: 'RVAccountReceivableMessagePopupCtrl',
					className: '',
					scope: $scope
				});
		});

		$scope.$on('$destroy', arAccountWillBeCreated);

		/**
		 * success call back of charge code fetch,
		 * will use this data in popup
		 * @param  {Array of Objects}
		 * @return undefined
		 */
		var fetchChargeCodesSuccess = function(data) {
			$scope.chargeCodeData = data.results;
			$scope.availableChargeCodes = data.results;
		};

		/**
		 * when we have everything required to render transaction details page,
		 * Success call back of initially required APIs
		 * @param  {[type]} data [description]
		 * @return {[type]}	  [description]
		 */
		var successFetchOfAllReqdForTransactionDetails = function(data) {
			// $scope.$emit('hideLoader');
		};

		/**
		 * when we failed in fetching any of the data required for transaction details,
		 * failure call back of any of the initially required API
		 * @param  {[type]} data [description]
		 * @return {[type]}	  [description]
		 */
		var failedToFetchOfAllReqdForTransactionDetails = function(data) {
			$scope.$emit('hideLoader');
		};

		/**
		 * function to check whether the user has permission
		 * to make view the transactions tab
		 * @return {Boolean}
		 */
		$scope.hasPermissionToViewTransactionsTab = function() {
			return rvPermissionSrv.getPermissionValue('ACCESS_GROUP_ACCOUNT_TRANSACTIONS');
		};

		/**
		 * we have to call multiple API on initial screen, which we can't use our normal function in teh controller
		 * depending upon the API fetch completion, loader may disappear.
		 * @return {[type]} [description]
		 */
		var callInitialAPIs = function() {
			if (!$scope.hasPermissionToViewTransactionsTab()) {
				$scope.errorMessage = ['Sorry, You dont have enough permission to proceed!!'];
				return;
			}

			var promises = [];
			// we are not using our normal API calling since we have multiple API calls needed

			$scope.$emit('showLoader');

			// transaction details fetch
			var paramsForTransactionDetails = {
				account_id: $scope.accountConfigData.summary.posting_account_id
			};

			promises.push(rvAccountTransactionsSrv
				.fetchTransactionDetails(paramsForTransactionDetails)
				.then(onTransactionFetchSuccess)
			);

			// charge code fetch
			promises.push(RVBillCardSrv
				.fetchChargeCodes()
				.then(fetchChargeCodesSuccess)
			);
			// Lets start the processing
			$q.all(promises)
				.then(successFetchOfAllReqdForTransactionDetails, failedToFetchOfAllReqdForTransactionDetails);
		};

		$scope.changeBillingReferenceNumber = function() {
			$scope.isBillingReferenceNumberChanged = true;
		};
		/**
		 * When there is a TAB switch, we will get this. We will initialize things from here
		 * @param  {[type]} event			 [description]
		 * @param  {[type]} currentTab){		} [description]
		 * @return {[type]}				   [description]
		 */
		$scope.$on ('ACCOUNT_TAB_SWITCHED', function(event, currentTab) {
			if (currentTab === "TRANSACTIONS") {
				callInitialAPIs();
			}
			else {
				if ($scope.isBillingReferenceNumberChanged) {
					updateBillingReferenceNumber();
				}
			}
		});

		var updateBillingReferenceNumber = function() {
			if (rvPermissionSrv.getPermissionValue('EDIT_ACCOUNT')) {
				var onAccountUpdateSuccess = function(data) {
						// client controllers should get an infromation whether updation was success
						$scope.isBillingRefernceNumberChanged = false;
						$scope.$broadcast("UPDATED_ACCOUNT_INFO");
						$scope.$emit('hideloader');
					},
					onAccountUpdateFailure = function(errorMessage) {
						// client controllers should get an infromation whether updation was a failure
						$scope.$broadcast("FAILED_TO_UPDATE_ACCOUNT_INFO");
						$scope.$emit('showErrorMessage', errorMessage);
						$scope.$emit('hideloader');
					};

				$scope.callAPI(rvAccountsConfigurationSrv.updateBillingRefNumber, {
					successCallBack: onAccountUpdateSuccess,
					failureCallBack: onAccountUpdateFailure,
					params: {
						summary: $scope.accountConfigData.summary,
						custom_reference_number: $scope.transactionsDetails.custom_reference_number
					}
				});
			} else {
				$scope.$emit('showErrorMessage', ['Sorry, Changes will not get saved as you don\'t have enough permission']);
			}
		};


		/**
		 * When there is a TAB switch, we will get this. We will initialize things from here
		 * @param  {[type]} event			 [description]
		 * @param  {[type]} currentTab){		} [description]
		 * @return {[type]}				   [description]
		 */
		var groupTabSwitched = $scope.$on ('GROUP_TAB_SWITCHED', function(event, currentTab) {
			if (currentTab === "TRANSACTIONS") {
				callInitialAPIs();
			}
			// CICO-40931 -Fixed the issue of not updating the bill reference no from group screen
			else {
				if ($scope.isBillingReferenceNumberChanged) {
					updateBillingReferenceNumber();
				}
			}
		});

		$scope.$on('$destroy', groupTabSwitched);

		/*
		 * Update informational invoice flag
		 * Based on checkbox in popup
		 */
		var updateCheckBoxValue = $scope.$on("UPDATE_INFORMATIONAL_INVOICE", function(event, isInformationalInvoice) {
			$scope.isInformationalInvoice = isInformationalInvoice;
		});

		// To destroy listener
		$scope.$on('$destroy', updateCheckBoxValue);
		/*
		 * Opens the popup which have the option to choose the bill layout while print/email
		 * @param billNo boolean bill no
		 * @param isActiveBill boolean is bill active or not
		 */
		$scope.showFormatBillPopup = function(billNo, isActiveBill) {
			$scope.billNo = billNo;
			$scope.isSettledBill = isActiveBill;
			$scope.isInformationalInvoice = false;
			ngDialog.open({
					template: '/assets/partials/popups/billFormat/rvBillFormatPopup.html',
					controller: 'rvBillFormatPopupCtrl',
					className: '',
					scope: $scope
			});
		};
		/*
		*  Shows the popup to show the email send status
		*/
		$scope.showEmailSentStatusPopup = function(status) {
			ngDialog.open({
				template: '/assets/partials/popups/rvEmailSentStatusPopup.html',
				className: '',
				scope: $scope
			});
		};
		// CICO-25088 starts here ..//
		/*
		 *	Load bill data on active bill with default date selected.
		 */
		var loadDefaultBillDateData = function() {
			var activebillTab 	= $scope.transactionsDetails.bills[$scope.currentActiveBill];
			// Load the data only if an active date is present and there is no data already fetched.

			if (!!activebillTab.activeDate && activebillTab.transactions.length === 0 ) {
				getBillTransactionDetails();
			}
			else {
				$scope.$emit('hideLoader');
				refreshRegContentScroller();
			}
		};

		// Refresh registration-content scroller.
		var refreshRegContentScroller = function() {
			$timeout(function() {
				$scope.refreshScroller('registration-content');
			}, 500);
		};

		// Handle the summary day shift functionality.
		$scope.summaryDateBtnGroup = {
			showCount: 5,
			next: function(billData) {
				var length = billData.days.length - 1;

				if (billData.currentActive < length) {
					billData.currentActive ++;
					billData.days[billData.currentActive].isShown = true;
					billData.days[billData.currentActive - this.showCount].isShown = false;
					if (billData.currentActive === length) {
						billData.disableNext = true;
					}
					billData.disablePrev = false;
				}
			},
			prev: function(billData) {
				if (billData.currentActive >= this.showCount) {
					billData.days[billData.currentActive].isShown = false;
					billData.days[billData.currentActive - this.showCount].isShown = true;
					if (billData.currentActive === this.showCount) {
						billData.disablePrev = true;
					}
					billData.currentActive --;
					billData.disableNext = false;
				}
			}
		};

		/**
		 * Function to populate date isShown data
		 * @param {array} bills array
		 */
		var configSummaryDateFlags = function() {
			var showCount = $scope.summaryDateBtnGroup.showCount,
				bills = $scope.transactionsDetails.bills;

			angular.forEach(bills, function(bill, key) {
				var i = 0,
				dateCount = bill.days.length;

				if (dateCount > showCount) {
					bill.disablePrev = false;
					while (i < (dateCount - showCount)) {
						bill.days[i].isShown = false;
						i++;
					}
				}
				else {
					bill.disablePrev = true;
				}
				while (i < dateCount) {
					bill.days[i].isShown = true;
					i++;
				}
				bill.currentActive 	= (dateCount - 1);
				bill.disableNext 	= true;
				bill.activeDate 	= (dateCount > 0) ? bill.days[dateCount - 1].date : null;
			});
		};

		// Success callback for transaction fetch API.
		var onBillTransactionFetchSuccess = function(data) {

			var activebillTab = $scope.transactionsDetails.bills[$scope.currentActiveBill];

			activebillTab.transactions = [];
			_.each(data.transactions, function(item) {

				item.description = (item.card_number !== null && item.card_number !== '') ? item.description + "-" + item.card_number : item.description;
			});
 			activebillTab.transactions = data.transactions;
 			activebillTab.total_count  = data.total_count;
 			
 			activebillTab.pageOptions = {
	            perPage: $scope.perPage,
	            api: getBillTransactionDetails
	        };

 			// Compute the start, end and total count parameters
			if (activebillTab.nextAction) {
				activebillTab.start = activebillTab.start + $scope.perPage;
			}
			if (activebillTab.prevAction) {
				activebillTab.start = activebillTab.start - $scope.perPage;
			}
			activebillTab.end = activebillTab.start + activebillTab.transactions.length - 1;

 			refreshRegContentScroller();

 			angular.forEach(activebillTab.transactions, function(feesValue, feesKey) {
				feesValue.billValue 	= activebillTab.bill_number; // Bill value append with bill details
				feesValue.oldBillValue 	= activebillTab.bill_number; // oldBillValue used to identify the old billnumber
			});

			setChargeCodesSelectedStatus(false);
			$scope.$emit('hideLoader');
		};

		// Failure callback for transaction fetch API.
		var onBillTransactionFetchFailure = function(errorMessage) {
			$scope.$emit('hideLoader');
			$scope.errorMessage = errorMessage;
		};

		/**
		 * API calling method to get the bill transaction details
		 * @return - undefined
		 */
		var getBillTransactionDetails = function() {
			var activebillTab = $scope.transactionsDetails.bills[$scope.currentActiveBill];
			
			var params = {
				'bill_id': activebillTab.bill_id,
				'date': activebillTab.activeDate,
				'page': activebillTab.page_no,
				'per_page': $scope.perPage
			};

			var options = {
				successCallBack: onBillTransactionFetchSuccess,
				failureCallBack: onBillTransactionFetchFailure,
				params: params
			};

			$scope.callAPI(rvAccountTransactionsSrv.fetchBillTransactionDetails, options);
		};
		// Reset the pagination params.
		var resetPagination = function(activebillTab) {
			activebillTab.page_no 	 = 1;
			activebillTab.start 	 = 1;
			activebillTab.end 		 = 1;
			activebillTab.nextAction = false;
			activebillTab.prevAction = false;
		};

		/*
		 *	Handle each summary day click - load the day transaction.
		 *	@param {String} current selected date.
		 *	@return - undefined
		 */
		$scope.clickedSummaryDate = function( date ) {
			var activebillTab = $scope.transactionsDetails.bills[$scope.currentActiveBill];

			activebillTab.activeDate = date;
			resetPagination(activebillTab);
			getBillTransactionDetails();
		};

		// Pagination block starts here ..

		

		// Pagination block ends here ..

		/*
		 *Function which fetches and returns the charge details of a grouped charge.
		 */
		$scope.expandGroupedCharge = function(feesData) {
			// Success callback for the charge detail fetch for grouped charges.
			var fetchChargeDataSuccessCallback = function(data) {
				feesData.light_speed_data = data.data;
				feesData.isExpanded = true;
				$scope.$emit('hideLoader');
				refreshRegContentScroller();
			};
			// Failure callback for the charge detail fetch for grouped charges.
			var fetchChargeDataFailureCallback = function(errorMessage) {
				$scope.errorMessage = errorMessage;
				$scope.emit('hideLoader');
			};

			// If the flag for toggle is false, perform api call to get the data.
			if (!feesData.isExpanded) {
				var params = {
					'reference_number': feesData.reference_number,
					'bill_id': $scope.transactionsDetails.bills[$scope.currentActiveBill].bill_id,
					'date': feesData.date
				};

				$scope.invokeApi(rvAccountTransactionsSrv.groupChargeDetailsFetch, params, fetchChargeDataSuccessCallback, fetchChargeDataFailureCallback);
			}
			else {
				// If the flag for toggle is true, then it is simply reverted to hide the data.
				feesData.isExpanded = false;
				refreshRegContentScroller();
			}
		};

		/*
		 * Handle click action on Remove Bill button
		 * @param {int} index of bill
		 */
		$scope.clickedRemoveBill = function(billIndex) {
			var hideBillSuccessCallback = function() {
				// Reload Bill screen and reset active bill tab ..
				getTransactionDetails();
				$scope.currentActiveBill = billIndex - 1;
			},
			hideBillFailureCallback = function(errorMessage) {
				$scope.errorMessage = errorMessage;
			};

			var dataToSend = {
				params: {
					'bill_id': $scope.transactionsDetails.bills[billIndex].bill_id
				},
				successCallBack: hideBillSuccessCallback,
				failureCallBack: hideBillFailureCallback
			};

			$scope.callAPI(RVBillCardSrv.hideBill, dataToSend);
		};

		var updateGenerateFolioFlag = $scope.$on('UPDATE_GENERATE_FOLIO_FLAG', function() {
			$scope.shouldGenerateFolioNumber = true;
		});

		$scope.$on( '$destroy', updateGenerateFolioFlag );
	}
]);
