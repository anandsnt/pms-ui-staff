angular.module('sntPay').service('sntCBAGatewaySrv', ['$q', '$http', '$log', '$timeout', '$rootScope', 'sntPaymentSrv',
    function($q, $http, $log, $timeout, $rootScope, sntPaymentSrv) {
        var service = this,
            isCheckLastTransactionInProgress = false,
            cordovaAPI = new CardOperation(),
            // This has to be consistent with Setting.cba_payment_card_types in  lib/seeds/production/product_config.rb
            cardMap = {
                AX: 'AX',
                DC: 'DC',
                DS: 'DS',
                JCB: 'JCB',
                ADC: 'DC',
                MC: 'MC',
                VA: 'VA',
                MS: 'MA',
                JC: 'JCB',
                VI: 'VA',
                CA: 'MC',
                TO: 'MA'
            };

        // To Mock CBA actions - 
        // Once payment screen is loaded, 
        // In browser console call document.dispatchEvent(new Event('MOCK_CBA')) 
    
        
        document.addEventListener('MOCK_CBA', () => {
            cordovaAPI = new CBAMockOperation();
            sntPaymentSrv.mockCba = true;
        });
        /**
         *
         * @param amount
         * @param bill_id
         * @returns {*|Promise.<response.data|{}|{bill_details, room_number}>}
         */
        service.initiateTransaction = function(amount, bill_id) {
            return $http.post('/api/cc/', {
                amount,
                bill_id,
                credit_card_transaction_type: Number(amount) > 0 ? "PAYMENT" : "REFUND"
            });
        };

        /**
         *
         * @param transactionId
         * @param cordovaResponse
         * @returns {*|Promise.<response.data|{bill_details, room_number}>}
         */
        service.updateTransactionSuccess = function(transactionId, cordovaResponse) {

            var expiryDate = cordovaResponse.expiry_date,
                formattedExpiry = "20";
            // NOTE : Expiry Date from cordovaResponse would be in MMYY format; This has to be changed to YYYY-MM-DD format

            if (expiryDate.length === 4) {
                // Rover expects all dates to be formatted in YYYY-MM-DD; Here we are converting the MMYY string coming in
                // to YYYY-MM-DD with simple string manipulations
                var dateParts = expiryDate.match(/.{1,2}/g);

                formattedExpiry += [dateParts[1], dateParts[0], "01"].join("-");
            } else {
                throw new Error("The UI expects MMYY format date as the cordovaResponse!")
            }

            return $http.put('/api/cc/' + transactionId, {
                "status": true,
                "req_reference_no": cordovaResponse.rrn,
                "external_transaction_ref": cordovaResponse.tid,
                "authorization_code": cordovaResponse.auth_code,
                "external_print_data": cordovaResponse.custom_data,
                "external_message": null,
                "payment_method": {
                    "payment_type": "CBA",
                    "do_not_attach_cc_to_bill": true,
                    "card_name": cordovaResponse.card_name,
                    "card_expiry": formattedExpiry,
                    "mli_token": cordovaResponse.pan, // For MLI payment gateway with CBA
                    "credit_card_type": cordovaResponse.card_type,
                    "card_number": cordovaResponse.pan
                }
            });
        };

        /**
         *
         * @param transactionId
         * @param cordovaResponse
         * @returns {*|Promise.<response.data|{bill_details, room_number}>}
         */
        service.updateTransactionFailure = function(transactionId, cordovaResponse) {
            return $http.put('/api/cc/' + transactionId, {
                "status": false,
                "external_failure_reason": cordovaResponse.RVErrorCode,
                "external_message": cordovaResponse.RVErrorDesc
            });
        };

        /**
         *
         * @param params
         * @param onSuccess
         * @param onFailure
         */
        service.doPayment = function(params, onSuccess, onFailure) {
            cordovaAPI.callCordovaService({
                arguments: [JSON.stringify(params)],
                service: "RVCardPlugin",
                action: "doPayment",
                successCallBack: onSuccess,
                failureCallBack: onFailure
            });
        };

        /**
         *
         * @param params
         * @param onSuccess
         * @param onFailure
         */
        service.doRefund = function(params, onSuccess, onFailure) {
            cordovaAPI.callCordovaService({
                arguments: [JSON.stringify(params)],
                service: "RVCardPlugin",
                action: "doRefund",
                successCallBack: onSuccess,
                failureCallBack: onFailure
            });
        };

        /**
         *
         * @param onSuccess
         * @param onFailure
         */
        service.addCard = function(onSuccess, onFailure) {
            cordovaAPI.callCordovaService({
                service: "RVCardPlugin",
                action: "addCard",
                successCallBack: onSuccess,
                failureCallBack: onFailure
            });
        };

        service.finishTransaction = function(transactionId) {
            $log.info('finishTransaction for :', transactionId);
            cordovaAPI.callCordovaService({
                service: "RVCardPlugin",
                action: "finishTransaction",
                arguments: [transactionId.toString()],
                successCallBack: response => {
                    $log.info('finishTransaction', response);
                },
                failureCallBack: error => {
                    $log.error('finishTransaction', error);
                }
            });
        };

        /**
         * @returns {undefined} undefined
         */
        service.checkLastTransactionStatus = function(showNotifications) {
            $log.info('checkLastTransactionStatus');
            if (isCheckLastTransactionInProgress) {
                return;
            }
            isCheckLastTransactionInProgress = true;
            cordovaAPI.callCordovaService({
                service: "RVCardPlugin",
                action: "getLastTransaction",
                successCallBack: (data) => {
                    isCheckLastTransactionInProgress = false;
                    $log.info('checkLastTransactionStatus', data);

                    if (showNotifications) {
                        $rootScope.$emit('UPDATE_NOTIFICATION', 'PLEASE TRY AGAIN!');
                    }

                    // In case last transaction was a success
                    if (parseInt('data.last_txn_success', 10) > 0) {
                        service.updateTransactionSuccess(data.txn_id, data).then(response => {
                            service.finishTransaction(data.txn_id);
                            $log.info('updateTransactionSuccess', response);
                        }, error => {
                            $log.error('updateTransactionSuccess', error);
                        });
                    } else { // In case last transaction was a failure
                        service.updateTransactionFailure(data.txn_id, data).then(response => {
                            service.finishTransaction(data.txn_id);
                            $log.info('updateTransactionSuccess', response);
                        }, error => {
                            $log.error('updateTransactionSuccess', error);
                        });
                    }
                },
                failureCallBack: (error) => {
                    isCheckLastTransactionInProgress = false;

                    if (showNotifications) {
                        $rootScope.$emit('UPDATE_NOTIFICATION', error.RVErrorCode + ' ' + error.RVErrorDesc);
                    }

                    $log.info('checkLastTransactionStatus', error);
                    /**
                     * Code : 104 Desc : Device not connected.
                     * Code : 148 Desc : Transaction was not processed by the PINpad.
                     * Code : 147 Desc : No transaction pending.
                     * Code : 146 Desc : Failed to get the transaction details.
                     */
                    if (parseInt(error.RVErrorCode, 10) === 146) {
                        $log.info('Failed to get transaction details... repeat cordova API call to check for pending transactions');
                        $timeout(service.checkLastTransactionStatus, 1000);
                    }
                    $log.warn(error);
                }
            });
        };

        /**
         * {"card_number": "4111xxxxxx1235","credit_card":"VI","card_name":"M","payment_type":"CC","card_expiry":"2017-12-01"}
         * {"credit_card":"VA","card_expiry":"2018-04-01","card_name":"VISA ISMP","payment_type":"CC","card_number":"494052******5694","workstation_id":"265","reservation_id":"1480431","bill_number":1,"add_to_guest_card":false}
         * @param cardDetails
         * @returns {{apiParams: {credit_card: (string|string), card_expiry: string, card_name: (string|string), payment_type: string, card_number: (string|string)}, cardDisplayData: {card_code: (string|string), ending_with: (Array|{index: number, input: string}), expiry_date: string, name_on_card: (string|string)}}}
         */
        service.generateApiParams = function(cardDetails) {
            // NOTE: The date would be in YYMM format
            var formattedExpiry = "20",
                dateParts = cardDetails.RVCardReadExpDate.match(/.{1,2}/g);

            formattedExpiry += [dateParts[0], dateParts[1], "01"].join("-");

            /**
             * TODO: Map the card code
             */
            return {
                apiParams: {
                    credit_card: cardDetails.RVCardReadCardType,
                    card_expiry: formattedExpiry,
                    card_name: cardDetails.RVCardReadCardName,
                    payment_type: "CC",
                    card_number: cardDetails.RVCardReadMaskedPAN,
                },
                cardDisplayData: {
                    card_code: (cardMap[cardDetails.RVCardReadCardType] || cardDetails.RVCardReadCardType).toLowerCase(),
                    ending_with: cardDetails.RVCardReadMaskedPAN.match(/[0-9]{4}$/)[0],
                    expiry_date: dateParts[1] + " / " + dateParts[0],
                    name_on_card: cardDetails.RVCardReadCardName
                }
            };
        };

    }
]);
