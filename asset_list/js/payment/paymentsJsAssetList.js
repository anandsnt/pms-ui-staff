module.exports = {
    getList: function () {
        var paymentRoot = 'payment/',
            sharedRoot 	= 'shared/',
            paymentJsAssets = {
                common: [
                    sharedRoot + 'sntUtils/**/*.js',
                    paymentRoot + "constants/payConfig.js",
                    paymentRoot + 'payApp.js',
                    paymentRoot + "constants/paymentConstants.js",
                    paymentRoot + "constants/paymentEventConstants.js",
                    paymentRoot + "controllers/**/*.js",
                    paymentRoot + "directives/**/*.js",
                    paymentRoot + "services/**/*.js",
                    paymentRoot + "payAppInit.js",
                    // Eliminate all spec files
                    '!**/*.spec.js'
                ],
                mli: [paymentRoot + 'payApp.js',
                    paymentRoot + "controllers/**/*.js",
                    // Eliminate all spec files
                    '!**/*.spec.js'
                ]
            };
        return paymentJsAssets;
    }
};
