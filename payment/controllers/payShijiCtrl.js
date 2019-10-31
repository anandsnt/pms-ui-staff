angular.module('sntPay').controller('payShijiCtrl', ['$scope',
	'sntShijiGatewaySrv',
	'sntPaymentSrv',
	'paymentAppEventConstants',
	'ngDialog',
	'$timeout',
	'sntActivity',
	'$window',
	'$log',
	function($scope, sntShijiGatewaySrv, sntPaymentSrv, payEvntConst, ngDialog, $timeout, sntActivity, $window, $log) {

		let self = this;

		self.loadShijiIframe = () => {
			let shijiIframe = $('#iframe-token');

			if (shijiIframe && shijiIframe.length) {
				let shijiPaths = sntPaymentSrv.resolvePaths($scope.hotelConfig.paymentGateway, {
					card_holder_first_name: $scope.payment.guestFirstName,
					card_holder_last_name: $scope.payment.guestLastName
				});

				shijiIframe[0].src = shijiPaths.iFrameUrl;

				sntActivity.start('SHIJI_IFRAME_LOADING');
				shijiIframe.on('load', () => {
					sntActivity.stop('SHIJI_IFRAME_LOADING');
				});
				shijiIframe.on('error', () => {
					sntActivity.stop('SHIJI_IFRAME_LOADING');
				});
			}
		};

		$scope.$on('RELOAD_IFRAME', () => {
			// TODO: handle if needed. Now the iframe loading is taking some time
			// self.loadShijiIframe(); 
		});

		$scope.$on('GET_SHIJI_TOKEN', () => {
			$scope.clearErrorMessage();
			let shijiIframe = $('#iframe-token');

			if (shijiIframe && shijiIframe.length) {
				shijiIframe[0].contentWindow.postMessage("0", "*");
				sntActivity.start('FETCH_SHIJI_TOKEN');
			}
			$("input").blur();
		});

		let onAddCardSuccess = (response) => {
			let paymentResponse = response.data;

			$scope.$emit('SUCCESS_LINK_PAYMENT', {
				response: {
					...paymentResponse,
					addToGuestCard: $scope.payment.addToGuestCardSelected
				},
				selectedPaymentType: $scope.selectedPaymentType,
				cardDetails: {
					'card_code': paymentResponse.credit_card_type ? paymentResponse.credit_card_type.toLowerCase() : 'credit-card',
					'ending_with': paymentResponse.ending_with,
					'expiry_date': paymentResponse.expiry_date,
					'card_name': '',
					'token': paymentResponse.token
				}
			});
		};

		let savePaymentDetails = (apiParams) => {
			let onSaveFailure = (errorMessage) => {
				$scope.$emit('PAYMENT_FAILED', errorMessage);
			};

			sntActivity.start('SAVE_CC_PAYMENT');
			
			sntPaymentSrv.savePaymentDetails(apiParams).then(
				response => {
					if (response.status === 'success') {
						onAddCardSuccess(response);
					} else {
						onSaveFailure(response.errors);
					}
					sntActivity.stop('SAVE_CC_PAYMENT');
				},
				errorMessage => {
					onSaveFailure(errorMessage);
					sntActivity.stop('SAVE_CC_PAYMENT');
				});
		};

		let proceedWithPaymentData = (apiParams) => {
			let params = {
				'paymentData': {
					'apiParams': apiParams,
					'cardDisplayData': {
						'name_on_card': $scope.payment.guestFirstName + ' ' + $scope.payment.guestLastName
					}
				}
			};

			$scope.$emit(payEvntConst.CC_TOKEN_GENERATED, params);
		};

		self.tokenizeBySavingtheCard = (tokenId) => {
			let isAddCardAction = (/^ADD_PAYMENT_/.test($scope.actionType));
			let apiParams = {
				"token": tokenId,
				"payment_type": "CC"
			};

			if (isAddCardAction) {
				if ($scope.reservationId) {
					// Incase of guestcard, there will be no reservation Id
					apiParams.reservation_id = $scope.reservationId;
				}
				apiParams.add_to_guest_card = $scope.payment.addToGuestCardSelected;
				apiParams.bill_number = 1;
				apiParams.user_id = $scope.guestId;
			}

			sntActivity.stop('FETCH_SHIJI_TOKEN');

			if (isAddCardAction) {
				savePaymentDetails(apiParams);
			} else {
				proceedWithPaymentData(apiParams);
			}
		};

		self.handleResponseFromIframe = (response) => {
			let responseData = response.data || response.originalEvent.data;

			if (responseData.respCode === "00") {
				self.tokenizeBySavingtheCard(responseData.tokenId);
			} else if (responseData.respCode && responseData.respCode !== "00") {
				sntActivity.stop('FETCH_SHIJI_TOKEN');
				$log.info('Tokenization Failed: response code =>' + responseData.respCode);
				let errorMsg = responseData.respText ? [responseData.respText] : [''];

				$scope.$emit('PAYMENT_FAILED', errorMsg);
			}
		};

		let tokenize = function(params) {
			$scope.$emit('SHOW_SIX_PAY_LOADER');
			sntPaymentSrv.getSixPaymentToken(params).then(
				response => {
					/**
					 * The response here is expected to be of the following format
					 * {
					 *  card_type: "VX",
					 *  ending_with: "0088",
					 *  expiry_date: "1217"
					 *  payment_method_id: 35102,
					 *  token: "123465498745316854",
					 *  is_swiped: true
					 * }
					 *
					 * NOTE: In case the request params sends add_to_guest_card: true AND guest_id w/o reservation_id
					 * The API response has guest_payment_method_id instead of payment_method_id
					 */

					var cardType = response.card_type || '';

					$scope.$emit('SUCCESS_LINK_PAYMENT', {
						response: {
							id: response.payment_method_id || response.guest_payment_method_id,
							guest_payment_method_id: response.guest_payment_method_id,
							payment_name: 'CC',
							usedEMV: true,
							addToGuestCard: $scope.payment.addToGuestCardSelected
						},
						selectedPaymentType: $scope.selectedPaymentType || 'CC',
						cardDetails: {
							'card_code': cardType.toLowerCase(),
							'ending_with': response.ending_with,
							'expiry_date': response.expiry_date,
							'card_name': '',
							'is_swiped': response.is_swiped
						}
					});

					$scope.$emit('HIDE_SIX_PAY_LOADER');
				},
				errorMessage => {
					$log.info('Tokenization Failed');
					$scope.$emit('PAYMENT_FAILED', errorMessage);
					$scope.$emit('HIDE_SIX_PAY_LOADER');
				}
			);
		};

		$scope.$on('INITIATE_CHIP_AND_PIN_TOKENIZATION', function(event, data) {
			let paymentParams = data;

			paymentParams.is_emv_request = true;
			paymentParams.emvTimeout = parseInt($scope.hotelConfig.emvTimeout);
			tokenize(data);
		});

		let proceedChipAndPinPayment = function(params) {
			// we need to notify the parent controllers to show loader
			// as this is an external directive

			$scope.$emit("SHOW_SIX_PAY_LOADER");
			sntPaymentSrv.submitPaymentForChipAndPin(params).then(
				response => {
					console.log("payment success" + $scope.payment.amount);
					response.amountPaid = $scope.payment.amount;
					response.authorizationCode = response.authorization_code;

					var cardType = (response.payment_method && response.payment_method.card_type) || "";

					// NOTE: The feePaid key and value would be sent IFF a fee was applied along with the payment
					if ($scope.feeData) {
						response.feePaid = $scope.feeData.calculatedFee;
					}

					$scope.selectedCC = $scope.selectedCC || {};

					if (!!response.payment_method) {
						$scope.selectedCC.value = response.payment_method.id;
						$scope.selectedCC.card_code = cardType.toLowerCase();
						$scope.selectedCC.ending_with = response.payment_method.ending_with;
						$scope.selectedCC.expiry_date = response.payment_method.expiry_date;
					}

					response.cc_details = angular.copy($scope.selectedCC);

					if ($scope.payment.showAddToGuestCard) {
						// check if add to guest card was selected
						response.add_to_guest_card = $scope.payment.addToGuestCardSelected;
					}
					$scope.$emit("HIDE_SIX_PAY_LOADER");
					$timeout(() => {
						$scope.onPaymentSuccess(response);
					}, 700);

				},
				errorMessage => {
					console.log("payment failed" + errorMessage);
					$scope.$emit('PAYMENT_FAILED', errorMessage);
					$scope.$emit("HIDE_SIX_PAY_LOADER");
				});
		};

		$scope.$on('INITIATE_CHIP_AND_PIN_PAYMENT', function(event, data) {
			var paymentParams = data;

			paymentParams.postData.is_emv_request = true;
			paymentParams.postData.workstation_id = $scope.hotelConfig.workstationId;
			paymentParams.emvTimeout = parseInt($scope.hotelConfig.emvTimeout);
			proceedChipAndPinPayment(data);
		});


		// ----------- init -------------
		(() => {
			self.loadShijiIframe();
			let isCCPresent = angular.copy($scope.showSelectedCard());

			// iFrame documentation - https://png-development.shijicloud.com:8443/develop/iframe/show
			$scope.payment.isManualEntryInsideIFrame = isCCPresent && $scope.hotelConfig.paymentGateway === 'SHIJI';
			// handle payment iFrame communication
			let eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
			let messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message";

			angular.element($window).on(messageEvent, (response) => {
				self.handleResponseFromIframe(response);
			});

			$scope.$on("$destroy", () => {
				angular.element($window).off(messageEvent);
			});
		})();

	}
]);