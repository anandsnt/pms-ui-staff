        var MLIOperation = function() {
            var that = this;

            //to set your merchant ID provided by Payment Gateway
            this.setMerChantID = function(id) {
                console.info('setting mli merch id: ', id);
                HostedForm.setMerchant(id);
            };

            //fetch MLI session details
            this.fetchMLISessionDetails = function(sessionDetails, updateSessionSuccessCallback, updateSessionFailureCallback) {

                var callback = function(response) {
                    console.info('mli session response: ', response);
                    (response.status === "ok") ? updateSessionSuccessCallback(response): updateSessionFailureCallback(response);
                };
                console.info('update session--- ')
                HostedForm.updateSession(sessionDetails, callback);
            };

        };