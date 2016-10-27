var CBAMockOperation = function() {
    var self = this,
        paymentActionSuccessResponse = {
            account_type: 2,
            amount: 1,
            auth_code: "",
            binary_format: "A",
            card_name: "VISA ISMP",
            card_sequence: "01",
            card_type: "",
            currency_code: "",
            custom_data: "",
            cvv: "",
            data_field: "",
            date_settlement: "200416",
            expiry_date: "0418",
            pan: "494052******5694",
            processed_offline: "0",
            rrn: "",
            tid: "13600822",
            track1: "",
            track2: "494052******5694=1804????????????????",
            transaction_date: "131016",
            transaction_time: "001850",
            txn_id: "1"
        },
        paymentActionFailureResponse = {
            RVErrorCode: 114,
            RVErrorDesc: "The Argument 'transaction_id' not valid."
        },
        addCardSuccessResponse = {
            "RVCardReadCardIIN": "494052",
            "RVCardReadCardName": "VISA ISMP",
            "RVCardReadCardType": "VI",
            "RVCardReadETB": "",
            "RVCardReadETBKSN": "",
            "RVCardReadExpDate": "1804",
            "RVCardReadIsEncrypted": "0",
            "RVCardReadMaskedPAN": "494052******5694",
            "RVCardReadTrack1": "B494052******5694^??????????????????????????^1804???????????????????????????",
            "RVCardReadTrack1KSN": "",
            "RVCardReadTrack2": "494052******5694=1804????????????????",
            "RVCardReadTrack2KSN": "",
            "RVCardReadTrack3": "",
            "RVCardReadTrack3KSN": ""
        };

    /**
     *
     * @param options
     */
    self.callCordovaService = function(options) {
        switch (options.action) {
            case "doPayment":
                window.setTimeout(()=> {
                    Math.random() > 0.5 ? options.successCallBack(paymentActionSuccessResponse)
                        : options.failureCallBack(paymentActionFailureResponse);
                }, 2000);
                break;

            case "doRefund":
                window.setTimeout(()=> {
                    Math.random() > 0.5 ? options.successCallBack(paymentActionSuccessResponse)
                        : options.failureCallBack(paymentActionFailureResponse);
                }, 2000);
                break;
            case "addCard":
                window.setTimeout(()=> {
                    options.successCallBack(addCardSuccessResponse);
                }, 2000);
                break;
            default:
                options.failureCallBack(paymentActionFailureResponse);
        }
    };
};