/**
 * All payment gateways are configured here... The libraries & the URLs for inline frames    are consumed from this constant in
 * the payment module
 */
angular.module("sntPayConfig", []).constant("PAYMENT_CONFIG", Object.freeze({
    "CBA": {
        iFrameUrl: null,
        jsLibrary: null,
        partial: "/assets/partials/payCBAPartial.html",
        params: null,
        disableCardSelection: true
    },
    'SHIJI': {
        iFrameUrl: null,
        jsLibrary: null,
        partial: '/assets/partials/payShijiPartial.html',
        params: null,
        disableCardSelection: true
    },
    "MLI": {
        iFrameUrl: null,
        jsLibrary: "https://cnp.merchantlink.com/form/v2.1/hpf.js",
        partial: "/assets/partials/payMLIPartial.html",
        params: null
    },
    "SAFERPAY": {
        iFrameUrl: null,
        jsLibrary: null,
        partial: "/assets/partials/payMLIPartial.html",
        params: null
    },
    "sixpayments": {
        iFrameUrl: "/api/ipage/index.html",
        // Iframe loading url query string params
        // Skelton
        // TODO: need to use while constructing from the params from service
        params: {
            // guest's first name
            "card_holder_first_name": "",
            // guest's last name
            "card_holder_last_name": "",
            // service action is sent as createtoken ALWAYS now
            "service_action": "createtoken",
            // current time stamp new Date() -> getTime()
            "time": ""
        },
        jsLibrary: null,
        partial: "/assets/partials/paySixPaymentPartial.html"
    },
    "CBA_AND_MLI": {
        iFrameUrl: null,
        jsLibrary: null,
        partial: "/assets/partials/payCBAAndMLIPartial.html",
        params: null,
        disableCardSelection: null
    }
}));