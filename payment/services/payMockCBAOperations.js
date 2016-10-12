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
        }
    };
};