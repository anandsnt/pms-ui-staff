sntGuestWeb.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    
    var themesWithLicensedFonts = {
        'guestweb_public_ny_v2': 'https://cloud.typography.com/7902756/7320972/css/fonts.css',
        'guestweb_public_ny': 'https://cloud.typography.com/7902756/7320972/css/fonts.css'
    };

    // checkout now states
    $stateProvider.state('guestwebRoot', {
        url: '/guestwebRoot/:mode/:reservationId',
        controller: 'homeController',
        resolve: {
            reservationAndhotelData: ['sntGuestWebSrv', '$stateParams', '$location', function(sntGuestWebSrv, $stateParams, $location) {

                var absUrl = $location.$$absUrl;
                var apiUrl = "";

                var setAPiURLfromWindowUrl = function() {
                    absUrl = (absUrl.indexOf("#") !== -1) ? absUrl.substring(0, absUrl.indexOf("#")) : absUrl;
                    var offset = absUrl.indexOf("?");
                    var startingUrl = absUrl.substring(0, offset);
                    // to strip away state URLS
                    var remainingURl = decodeURIComponent(absUrl.substring(offset, absUrl.length));

                    remainingURl = (remainingURl.indexOf("#") !== -1) ? remainingURl.substring(0, remainingURl.indexOf("#")) : remainingURl;
                    apiUrl = startingUrl + "_data" + remainingURl;
                };
                // if the guestweb is accessed normaly, ie invoked using
                // the mail sent from the hotel admin

                if (absUrl.indexOf("/guest_web/home/index?guest_web_token=") !== -1) {  
                    setAPiURLfromWindowUrl();
                }
                // invoked when forgot password or email verification is
                // requested from the zest apps
                else if (absUrl.indexOf("/guest_web/home/user_activation") !== -1) {
                    absUrl = (absUrl.indexOf("#") !== -1) ? absUrl.substring(0, absUrl.indexOf("#")) : absUrl;
                    var offset = absUrl.indexOf("?");
                    var startingUrl = absUrl.substring(0, offset);
                    // to strip away state URLS
                    var remainingURl = decodeURIComponent(absUrl.substring(offset, absUrl.length));

                        remainingURl = (remainingURl.indexOf("#") !== -1) ? remainingURl.substring(0, remainingURl.indexOf("#")) : remainingURl;
                    apiUrl = "/guest_web/home/activate_user.json" + remainingURl;
                }
                else if ( absUrl.indexOf("/guest_web/") !== -1 && absUrl.indexOf("/checkin?guest_web_token=") !== -1) {
                    setAPiURLfromWindowUrl();
                }
                // direct URL checkin - accessing URLS set in hotel admin for checkin
                else if (absUrl.indexOf("checkin") !== -1) {
                    // to strip away state URLS
                    absUrl = (absUrl.indexOf("#") !== -1) ? absUrl.substring(0, absUrl.indexOf("#")) : absUrl;
                    var urlComponents = absUrl.split('/');


                    var application = urlComponents[urlComponents.length - 3];
                    var url_suffix = urlComponents[urlComponents.length - 1];
                    var hotel_identifier = urlComponents[urlComponents.length - 2];

                    apiUrl = "/guest_web/home/checkin_verification_data?hotel_identifier=" + hotel_identifier + "&application=" + application + "&url_suffix=" + url_suffix;
                }
                // direct URL checkout - accessing URLS set in hotel admin for checkin
                else {
                    // to strip away state URLS
                    absUrl = (absUrl.indexOf("#") !== -1) ? absUrl.substring(0, absUrl.indexOf("#")) : absUrl;
                    var urlComponents = absUrl.split('/');


                    var url_suffix = urlComponents[urlComponents.length - 1];

                    apiUrl = "/guest_web/home/checkout_verification_data?hotel_identifier=" + url_suffix;
                }


                return sntGuestWebSrv.fetchHotelDetailsFromUrl(apiUrl, hotel_identifier);

            }],
            jsThemeList: ['sntGuestWebSrv', function(sntGuestWebSrv) {
                return sntGuestWebSrv.fetchJsHotelThemeList();
            }],
            fetchJsThemeFiles: ['reservationAndhotelData', 'jsThemeList', 'sntGuestWebSrv', function(reservationAndhotelData, jsThemeList, sntGuestWebSrv) {
                var theme = reservationAndhotelData.hotel_theme;

                if (!_.isUndefined(themesWithLicensedFonts[theme])) {
                    // if theme used is public use custom font
                    $("head").append("<link href='" + themesWithLicensedFonts[theme] + "' rel='stylesheet' type='text/css'>");
                }

                return sntGuestWebSrv.fetchJsAssets(theme, ['sntGuestWeb']);
            }],
            cssThemeList: ['sntGuestWebSrv', function(sntGuestWebSrv) {
                return sntGuestWebSrv.fetchCSSHotelThemeList();
            }],
            fetchCSSThemeFiles: ['reservationAndhotelData', 'cssThemeList', 'sntGuestWebSrv', function(reservationAndhotelData, jsThemeList, sntGuestWebSrv) {
                var theme = reservationAndhotelData.hotel_theme;

                return sntGuestWebSrv.fetchCSSAssets(theme);
            }],
            templateThemeList: ['sntGuestWebSrv', function(sntGuestWebSrv) {
                return sntGuestWebSrv.fetchTemplateHotelThemeList();
            }],
            fetchTemplateThemeFiles: ['reservationAndhotelData', 'templateThemeList', 'sntGuestWebSrv', function(reservationAndhotelData, jsThemeList, sntGuestWebSrv) {
                var theme = reservationAndhotelData.hotel_theme;

                return sntGuestWebSrv.fetchTemplateAssets(theme);
            }]
        }
    });
}]);