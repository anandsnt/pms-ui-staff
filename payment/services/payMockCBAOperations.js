var CBAMockOperation = function() {
    var self = this,
        paymentActionSuccessResponse = {
            account_type: 2,
            amount: 1,
            auth_code: '',
            binary_format: 'A',
            card_name: 'VISA ISMP',
            card_sequence: '01',
            card_type: 'VA',
            currency_code: '',
            custom_data: '',
            cvv: '',
            data_field: '',
            date_settlement: '200416',
            expiry_date: '0425',
            pan: '494052******5694',
            processed_offline: '0',
            rrn: '',
            tid: '13600822',
            track1: '',
            track2: '494052******5694=1804????????????????',
            transaction_date: '131016',
            transaction_time: '001850',
            txn_id: '1'
        },
        paymentActionFailureResponse =[{
            RVErrorCode: 143,
            RVErrorDesc: 'Device Not Connected.'
        }, {
            RVErrorCode: 144,
            RVErrorDesc: 'Transaction was not processed by PIN pad.'
        }, {
            RVErrorCode: 145,
            RVErrorDesc: 'A transaction is pending with the terminal.'
        }, {
            RVErrorCode: 114,
            RVErrorDesc: 'The Argument \'transaction_id\' not valid.'
        }],
        addCardSuccessResponse = {
            'RVCardReadCardIIN': '494052',
            'RVCardReadCardName': 'VISA ISMP',
            'RVCardReadCardType': 'VI',
            'RVCardReadETB': '',
            'RVCardReadETBKSN': '',
            'RVCardReadExpDate': '1804',
            'RVCardReadIsEncrypted': '0',
            'RVCardReadMaskedPAN': '494052******5694',
            'RVCardReadTrack1': 'B494052******5694^??????????????????????????^1804???????????????????????????',
            'RVCardReadTrack1KSN': '',
            'RVCardReadTrack2': '494052******5694=1804????????????????',
            'RVCardReadTrack2KSN': '',
            'RVCardReadTrack3': '',
            'RVCardReadTrack3KSN': ''
        },
        getLastTransactionSuccessResponse = {
            'txn_id': '1',
            'last_txn_success': (() => Math.random() > 0.5 ? 0 : 1)(),
            'amount': '1.00',
            'tid': '12356',
            'transaction_date': '',
            'transaction_time': '',
            'date_settlement': '',
            'card_name': '',
            'card_type': '',
            'card_sequence': '',
            'track1': '',
            'track2': '',
            'pan': '',
            'expiry_date': '',
            'cvv': '',
            'currency_code': '',
            'binary_format': '',
            'data_field': '',
            'custom_data': '',
            'state_vars': ''
        },
        getLastTransactionFailureResponse = [{
            RVErrorCode: 104,
            RVErrorDesc: 'Device Not Connected.'
        }, {
            RVErrorCode: 148,
            RVErrorDesc: 'Transaction was not processed by PIN pad.'
        }, {
            RVErrorCode: 147,
            RVErrorDesc: 'No transaction pending.'
        }, {
            RVErrorCode: 146,
            RVErrorDesc: 'Failed to get transaction details.'
        }];

    /**
     * wrapper Method to call all services
     * @param {Object} options - payLoad for cordova APIs
     * @return {Object} simulated response
     */
    self.callCordovaService = function(options) {
        switch (options.action) {
            case 'doPayment':
                //  Success
                options.successCallBack(paymentActionSuccessResponse);
                //  Failure
                // options.failureCallBack(paymentActionFailureResponse[2]);
                //  Random
                /* Math.random() > 0.5 ? options.successCallBack(paymentActionSuccessResponse)
                 : options.failureCallBack(paymentActionFailureResponse); */
                break;
            case 'doRefund':
                window.setTimeout(() => {
                    //  Success
                    /* options.successCallBack(paymentActionSuccessResponse) */
                    //  Failure
                    /* options.failureCallBack(paymentActionFailureResponse); */
                    //  Random
                    /* Math.random() > 0.5 ? options.successCallBack(paymentActionSuccessResponse)
                        : options.failureCallBack(paymentActionFailureResponse); */
                }, 2000);
                break;
            case 'addCard':
                window.setTimeout(() => {
                    options.successCallBack(addCardSuccessResponse);
                }, 2000);
                break;
            case 'getLastTransaction':
                window.setTimeout(() => {
                    //  Success
                    options.successCallBack(getLastTransactionSuccessResponse);
                    //  Failure
                    /* options.failureCallBack(getLastTransactionFailureResponse[1]); */
                    //  Random
                    /* options.successCallBack(getLastTransactionSuccessResponse);
                    Math.random() > 0.5 ? options.successCallBack(getLastTransactionSuccessResponse)
                        : options.failureCallBack(getLastTransactionFailureResponse[1]); */
                }, 2000);
                break;
            default:
                options.failureCallBack(paymentActionFailureResponse);
        }
    };
};
