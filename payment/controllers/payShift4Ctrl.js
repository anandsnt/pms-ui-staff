angular.module('sntPay').controller('payShift4Ctrl', ['$scope',
    'sntShift4GatewaySrv',
    'sntPaymentSrv',
    'paymentAppEventConstants',
    'ngDialog',
    '$timeout',
    'sntActivity',
    '$window',
    '$log',
    function ($scope, sntShift4GatewaySrv, sntPaymentSrv, payEvntConst, ngDialog, $timeout, sntActivity, $window, $log) {

        let self = this;

        let cardMappings = {
            'JC': 'JCB',
            'NS': 'DS',
            'VS': 'VA'
        };

        self.loadshift4Iframe = () => {
            let shift4Iframe = angular.element('#i4goFrame');

            if (shift4Iframe && shift4Iframe.length) {
                sntShift4GatewaySrv.iframe_config().then(function (response) {
                    $("#i4goFrame").i4goTrueToken(
                        {
                            server: response.i4go_server,
                            accessBlock: response.access_block,
                            self: document.location,
                            template: "bootstrap5",
                            cssRules: ["body{background-color: transparent}"],
                            url: response.i4go_i4m_url,
                            submitButton: {
                                label: "Add",
                                visible: true
                            },
                            onSuccess: function (form, data) {
                                self.tokenizeBySavingtheCard(data);
                            },
                            onFailure: function (form, data) {
                                sntActivity.stop('FETCH_SHIFT4_TOKEN');
                                $log.info('Tokenization Failed: response code =>' + data.respCode);
                                let errorMsg = data.respText ? [data.respText] : [''];

                                $scope.$emit('PAYMENT_FAILED', errorMsg);
                            },
                            acceptedPayments: "AX,DC,JC,MC,NS,VS",
                            debug: false
                        });
                })
                    .catch(function () {
                        // TODO: Add exception catch
                    });
            }
        };

        $scope.$on('RELOAD_IFRAME', () => {
            let iFrame = document.getElementById('i4goFrame');

            iFrame.src = iFrame.src;
        });

        $scope.$on('GET_SHIFT4_TOKEN', () => {
            $scope.clearErrorMessage();
            let shift4Iframe = $('#i4goFrame');

            if (shift4Iframe && shift4Iframe.length) {
                shift4Iframe[0].contentWindow.postMessage("0", "*");
                sntActivity.start('FETCH_SHIFT4_TOKEN');
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
                    'card_name': paymentResponse.card_name,
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

        self.tokenizeBySavingtheCard = (data) => {

            let isAddCardAction = (/^ADD_PAYMENT_/.test($scope.actionType));
            let apiParams = {
                "mli_token": data.i4go_utoken,
                "payment_type": "CC",
                "card_expiry": data.i4go_expirationyear + "-" + data.i4go_expirationmonth + "-01",
                "credit_card": cardMappings[data.i4go_cardtype] || data.i4go_cardtype,
                "card_name": data.i4go_cardholdername,
                "masked_card_number": data.otn.cardnumber.substr(-4)
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

            sntActivity.stop('FETCH_SHIFT4_TOKEN');

            if (isAddCardAction) {
                savePaymentDetails(apiParams);
            } else {
                proceedWithPaymentData(apiParams);
            }
        };

        let shift4Lib = 'https://i4m.i4go.com/js/jquery.i4goTrueToken.js';

        let loadLibrary = () => {
            let script = document.createElement("script");

            script.type = "application/javascript";
            script.onload = function () {
                self.loadshift4Iframe();
            };
            script.src = shift4Lib;
            document.body.appendChild(script);
        };

        // ----------- init -------------
        (() => {
            if ($('script[src="' + shift4Lib + '"]').length > 0) {
                self.loadshift4Iframe();
            } else {
                loadLibrary();
            }
        })();

    }
]);
