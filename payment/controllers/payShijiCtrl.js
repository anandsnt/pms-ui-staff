angular.module('sntPay').controller('payShijiCtrl', ['$scope',
	'sntShijiGatewaySrv',
	'sntPaymentSrv',
	'paymentAppEventConstants',
	'ngDialog',
	'$timeout',
	'sntActivity',
	'$window',
	'$sce',
	($scope, sntShijiGatewaySrv, sntPaymentSrv, payEvntConst, ngDialog, $timeout, sntActivity, $window, $sce) => {

		$scope.$on('RELOAD_IFRAME', () => {
			let shijiIframe = $('#iframe-token');

			if (!!shijiIframe.length) {
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
		});

		$scope.$on('GET_SHIJI_TOKEN', () => {
			let shijiIframe = $('#iframe-token');

			if (!!shijiIframe.length) {
				shijiIframe[0].contentWindow.postMessage("0", "*");
				sntActivity.start('FETCH_SHIJI_TOKEN');
			}
		});

		let addPaymentTypeSuccess = (paymentResponse) => {
			$scope.$emit('SUCCESS_LINK_PAYMENT', {
				response: {
					...paymentResponse,
					addToGuestCard: $scope.payment.addToGuestCardSelected,
				},
				selectedPaymentType: $scope.selectedPaymentType,
				cardDetails: {
					'card_code': paymentResponse.credit_card_type,
					'ending_with': paymentResponse.ending_with,
					'expiry_date': paymentResponse.expiry_date || '11/19',
					'card_name': ''
				}
			});
		};

		let addCardForPaymentSuccess = (paymentResponse) => {
			var paymentDetails = {
				"paymentData": {
					"apiParams": {
						"token": tokenId,
						"payment_type": "CC",
						"card_expiry": "2023-12-01"
					},
					"cardDisplayData": {
						"card_code": paymentResponse.credit_card_type,
						"name_on_card": "",
						"ending_with": paymentResponse.ending_with,
						"expiry_date": paymentResponse.expiry_date || '11/19'
					}
				}
			};

			$scope.$emit(payEvntConst.CC_TOKEN_GENERATED, paymentDetails);
		};

		let tokenizeBySavingtheCard = (tokenId) => {
			let isAddCardAction = (/^ADD_PAYMENT_/.test($scope.actionType));
			let apiParams = {
				"token": tokenId,
				"payment_type": "CC",
				"card_expiry": "2020-12-31",
			};

			if (isAddCardAction) {
				apiParams.reservation_id = $scope.reservationId
				apiParams.add_to_guest_card = $scope.payment.addToGuestCardSelected;
				apiParams.bill_number = 1;
				apiParams.user_id = $scope.guestId
			}

			let onAddCardSuccess = (response) => {
				let paymentResponse = response.data;

				if (isAddCardAction) {
					addPaymentTypeSuccess(paymentResponse);
				} else {
					addCardForPaymentSuccess(paymentResponse);
				}
			};

			sntActivity.stop('FETCH_SHIJI_TOKEN');

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

		// ----------- init -------------
		(() => {
			let isCCPresent = angular.copy($scope.showSelectedCard());
			// iFrame documentation - https://png-development.shijicloud.com:8443/develop/iframe/show
			$scope.payment.isManualEntryInsideIFrame = isCCPresent && $scope.hotelConfig.paymentGateway === 'SHIJI';
			// handle payment iFrame communication
			let eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
			let eventer = window[eventMethod];
			let messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message";

			angular.element($window).on(messageEvent, function(e) {
				let responseData = e.data || e.originalEvent.data;

				if (responseData.respCode === "00") {
					tokenizeBySavingtheCard(responseData.tokenId);
				} else {
					sntActivity.stop('FETCH_SHIJI_TOKEN');
					$log.info('Tokenization Failed');
					$scope.$emit('PAYMENT_FAILED', responseData.respText);
				}
			});

			$scope.$on("$destroy", () => {
				angular.element($window).off(messageEvent);
			});
		})();

	}
]);