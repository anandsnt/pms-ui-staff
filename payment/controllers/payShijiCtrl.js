angular.module('sntPay').controller('payShijiCtrl', ['$scope', 'sntShijiGatewaySrv', 'sntPaymentSrv', 'paymentAppEventConstants', 'ngDialog', '$timeout', 'sntActivity', '$window', '$sce',
	function($scope, sntShijiGatewaySrv, sntPaymentSrv, payEvntConst, ngDialog, $timeout, sntActivity, $window, $sce) {


		let setUpShijiIframe = () => {
			// let accessTokenUrl = "https://png-dev-token-proxy.shijicloud.com:9081/token-proxy/token/getTokenIframe?accessToken=f2e87d9cc7a84c95aa7466ba602acd13";
			// let iframeStyles = "";

			// accessTokenUrl += iframeStyles;
			// accessTokenUrl = $sce.trustAsResourceUrl(accessTokenUrl);
			// $scope.payment.iFrameUrl = accessTokenUrl;
		};

		$scope.$on('RELOAD_IFRAME', () => {
			if (!!$('#shiji-iframe').length) {
				let iFrame = document.getElementById('shiji-iframe');

				iFrame.src = '/api/ipage/shiji';
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
			if (!!$('#shiji-iframe').length) {
				$('#shiji-iframe')[0].contentWindow.postMessage("0", "*");
				sntActivity.start('FETCH_SHIJI_TOKEN');
			}
			// getTokenByTokenId();
		});

		// ----------- init -------------
		(() => {
			let isCCPresent = angular.copy($scope.showSelectedCard());

			$scope.payment.isManualEntryInsideIFrame = isCCPresent && $scope.hotelConfig.paymentGateway === 'SHIJI';
			// iframe documentation - https://png-development.shijicloud.com:8443/develop/iframe/show
			setUpShijiIframe();

			// handle payment iFrame communication
			let eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
			let eventer = window[eventMethod];
			let messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message";

			angular.element($window).on(messageEvent, function(e) {
				let responseData = e.data || e.originalEvent.data;

				if (responseData.respCode === "00") {
					// sntActivity.stop('FETCH_SHIJI_TOKEN');
					getTokenByTokenId(responseData.tokenId);
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
