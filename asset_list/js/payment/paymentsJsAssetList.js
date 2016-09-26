module.exports = {
    getList: function () {
        var paymentRoot = 'payment/',
            paymentJsAssets = {
                common: [

                    paymentRoot + "constants/payConfig.js",
                    paymentRoot + 'payApp.js',
                    paymentRoot + "constants/paymentConstants.js",
                    paymentRoot + "constants/paymentEventConstants.js",
                    paymentRoot + "controllers/**/*.js",
                    paymentRoot + "directives/**/*.js",
                    paymentRoot + "services/**/*.js"
                ],
                mli: [paymentRoot + 'payApp.js',
                    paymentRoot + "controllers/**/*.js"]
            };
        return paymentJsAssets;
    }
};