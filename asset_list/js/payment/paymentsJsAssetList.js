module.exports = {
    getList: function () {
        var paymentRoot = 'payment/',
            paymentJsAssets = {
                common: [
                    paymentRoot + 'payApp.js',
                    paymentRoot + "controllers/**/*.js",
                    paymentRoot + "directives/**/*.js",
                    paymentRoot + "services/**/*.js",
                    paymentRoot + "constants/**/*.js"
                ],
                mli: []
            };
        return paymentJsAssets;
    }
};