angular.module('sntPay').controller('payShijiCtrl', ['$scope', 'sntShijiGatewaySrv', 'sntPaymentSrv', 'paymentAppEventConstants', 'ngDialog', '$timeout', 'sntActivity', '$window', '$sce',
	function($scope, sntShijiGatewaySrv, sntPaymentSrv, payEvntConst, ngDialog, $timeout, sntActivity, $window, $sce) {

		$scope.$on('RELOAD_IFRAME', () => {
			let shijiIframe = $('#iframe-token');

			if (!!shijiIframe.length) {
				let shijiPaths = sntPaymentSrv.resolvePaths($scope.hotelConfig.paymentGateway, {
                    card_holder_first_name: $scope.payment.guestFirstName,
                    card_holder_last_name: $scope.payment.guestLastName
                });

                shijiIframe[0].src = shijiPaths.iFrameUrl;
			}
		});

		let retrieveCardDetails = function(tokenDetails) {
			let cardDetails = {};

			cardDetails.cardType = tokenDetails.suffix4;
			// cardDetails.expiryMonth = tokenDetails.expiry.substring(2, 4);
			// cardDetails.expiryYear = tokenDetails.expiry.substring(0, 2);
			// // for displaying
			// cardDetails.expiryDate = cardDetails.expiryMonth + " / " + cardDetails.expiryYear;
			// // for API params
			// cardDetails.cardExpiry = (cardDetails.expiryMonth && cardDetails.expiryYear) ? ("20" + cardDetails.expiryYear + "-" + cardDetails.expiryMonth + "-01") : "";
			cardDetails.cardCode = sntPaymentSrv.getShijiPayCreditCardType(tokenDetails.cardType).toLowerCase();
			cardDetails.cardExpiry = "2019-11-01";
			//cardDetails.cardCode = tokenDetails.cardType;
			// last 4 number of card
			cardDetails.endingWith = tokenDetails.suffix4;
			cardDetails.token = tokenDetails.token;
			cardDetails.nameOnCard = $scope.payment.guestFirstName + ' ' + $scope.payment.guestLastName;

			return cardDetails;
		};

		let notifyParent = function(tokenDetails) {
			let cardDetails = retrieveCardDetails(tokenDetails);
			let paymentData = {
				apiParams: {
					name_on_card: cardDetails.nameOnCard,
					payment_type: "CC",
					token: cardDetails.token,
					card_expiry: cardDetails.cardExpiry
				},
				cardDisplayData: {
					card_code: cardDetails.cardCode,
					ending_with: cardDetails.endingWith,
					expiry_date: cardDetails.expiryDate
				}
			};

			$scope.$emit(payEvntConst.CC_TOKEN_GENERATED, {
				paymentData,
				tokenDetails,
				cardData: cardDetails
			});
		};

		let getTokenByTokenId = (tokenId) => {

			let tokenizeErrorCallBack = (errorMessage) => {
				$log.info('Tokenization Failed');
				sntActivity.stop('FETCH_SHIJI_TOKEN');
				$scope.$emit('PAYMENT_FAILED', errorMessage);
			};

			sntShijiGatewaySrv.getToken({
				token_id: tokenId
			}).then(response => {
				if (response.respCode == "00") {
					notifyParent(response);
				} else {
					tokenizeErrorCallBack();
				}
				sntActivity.stop('FETCH_SHIJI_TOKEN');;
			}, tokenizeErrorCallBack);
		};

		$scope.$on('GET_SHIJI_TOKEN', () => {
            let shijiIframe = $('#iframe-token');

			if (!!shijiIframe.length) {
                shijiIframe[0].contentWindow.postMessage("0", "*");
				sntActivity.start('FETCH_SHIJI_TOKEN');
			}
			// getTokenByTokenId();
		});

		let addCard = (tokenId) => {
			var apiParams = {
				"token": tokenId,
				"payment_type": "CC",
				"card_expiry": "2019-11-01",
				"reservation_id": "2871136",
				"bill_number": 1,
				"add_to_guest_card": $scope.payment.addToGuestCardSelected,
				 "user_id": $scope.guestId
			};

			let onAddCardSuccess = (response) => {
				let paymentResponse = response.data;
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
			
			var data = {
				"status": "success",
				"data": {
					"id": 708439,
					"payment_type": "Credit Card",
					"credit_card_type": "VA",
					"is_already_on_guest_card": false,
					"warnings": [],
					"bill_balance": "-10.0",
					"reservation_balance": "-10.00",
					"fees_information": {
						"charge_code_id": 8098,
						"amount_symbol": "amount",
						"amount_sign": "+",
						"amount": "5.0",
						"minimum_amount_for_fees": null,
						"description": "\u00a35 Credit Card Fee"
					},
					"reservation_type_id": null,
					"guest_payment_method_id": null,
					"has_any_credit_card_attached_bill": true,
					"restrict_post": false,
					"token": "8041637097761111",
					"expiry_date": "11/19",
					"card_type": "MC",
					"ending_with": "1234"
				},
				"errors": [],
				"is_eod_in_progress": false,
				"is_eod_manual_started": false,
				"is_eod_failed": false,
				"is_eod_process_running": false
			};
			sntActivity.stop('FETCH_SHIJI_TOKEN');
			onAddCardSuccess(data);
		};

		// ----------- init -------------
		(() => {
			let isCCPresent = angular.copy($scope.showSelectedCard());

			$scope.payment.isManualEntryInsideIFrame = isCCPresent && $scope.hotelConfig.paymentGateway === 'SHIJI';
			// iframe documentation - https://png-development.shijicloud.com:8443/develop/iframe/show
			// handle payment iFrame communication
			let eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
			let eventer = window[eventMethod];
			let messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message";

			angular.element($window).on(messageEvent, function(e) {
				let responseData = e.data || e.originalEvent.data;

				if (responseData.respCode === "00") {
					//sntActivity.stop('FETCH_SHIJI_TOKEN');
					//getTokenByTokenId(responseData.tokenId);
					addCard(responseData.tokenId);
				} else {
					sntActivity.stop('FETCH_SHIJI_TOKEN');
					// tokenization failed
				}
			});

			$scope.$on("$destroy", () => {
				angular.element($window).off(messageEvent);
			});
		})();

	}
]);
