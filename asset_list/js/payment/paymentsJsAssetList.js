module.exports = {
    getList: function () {
        var paymentRoot = 'payment/',
            paymentJsAssets = {
                common: [

                    paymentRoot + "constants/**/*.js",
                    paymentRoot + 'payApp.js',
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