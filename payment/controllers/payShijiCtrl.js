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
					'card_name': ''
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