sntGuestWeb.config(['$stateProvider','$urlRouterProvider', function($stateProvider,$urlRouterProvider) {
    // checkout now states
    $stateProvider.state('guestwebRoot', {
        url: '/guestwebRoot/:mode/:reservationId',
        controller: 'homeController',
        resolve: {
            reservationAndhotelData: ['sntGuestWebSrv', '$stateParams', function(sntGuestWebSrv, $stateParams) {

                 var absUrl = window.location.href;
                 var apiUrl = "";
                 // if the guestweb is accessed normaly
                 if(absUrl.indexOf("reservation_id=") !== -1){
                      var offset= absUrl.indexOf("?");
                      var remainingURl  = absUrl.substring(offset,absUrl.length);
                      var startingUrl  = absUrl.substring(0,offset);
                      apiUrl = startingUrl+"_data"+remainingURl;

                 }
                 // direct URL checkin
                 else if(absUrl.indexOf("checkin") !== -1){
                    //to strip away state URLS
                    absUrl = (absUrl.indexOf("#") !== -1) ? absUrl.substring(0,absUrl.indexOf("#")) : absUrl;
                    var urlComponents     = absUrl.split('/');;
                    var application       = urlComponents[urlComponents.length-3];
                    var url_suffix        = urlComponents[urlComponents.length-1];
                    var hotel_identifier  = urlComponents[urlComponents.length-2];
                        apiUrl            = urlComponents[0]+"/guest_web/home/checkin_verification_data?hotel_identifier="+hotel_identifier+"&application="+application+"&url_suffix="+url_suffix;
                 }
                 // direct URL checkout
                 else{
                    //to strip away state URLS
                    absUrl = (absUrl.indexOf("#") !== -1) ? absUrl.substring(0,absUrl.indexOf("#")) : absUrl;
                    var urlComponents     = absUrl.split('/');;
                    var url_suffix        = urlComponents[urlComponents.length-1];
                    apiUrl                = urlComponents[0]+"/guest_web/home/checkout_verification_data?hotel_identifier="+url_suffix;
                 }

            	
            	return sntGuestWebSrv.fetchHotelDetailsFromUrl(apiUrl);
            
            }],
            jsThemeList: ['sntGuestWebSrv', function(sntGuestWebSrv) {
            	return sntGuestWebSrv.fetchJsHotelThemeList();
            }],           
            fetchJsThemeFiles: ['reservationAndhotelData', 'jsThemeList', 'sntGuestWebSrv', function(reservationAndhotelData, jsThemeList, sntGuestWebSrv){
            	var theme = reservationAndhotelData.hotel_theme;
            	return sntGuestWebSrv.fetchJsAssets(theme, ['sntGuestWeb']);
            }],
            cssThemeList: ['sntGuestWebSrv', function(sntGuestWebSrv) {
                return sntGuestWebSrv.fetchCSSHotelThemeList();
            }],            
            fetchCSSThemeFiles: ['reservationAndhotelData', 'cssThemeList', 'sntGuestWebSrv', function(reservationAndhotelData, jsThemeList, sntGuestWebSrv){
            	var theme = reservationAndhotelData.hotel_theme;
            	return sntGuestWebSrv.fetchCSSAssets(theme);
            }],
            templateThemeList: ['sntGuestWebSrv', function(sntGuestWebSrv) {
                return sntGuestWebSrv.fetchTemplateHotelThemeList();
            }],             
            fetchTemplateThemeFiles: ['reservationAndhotelData', 'templateThemeList', 'sntGuestWebSrv', function(reservationAndhotelData, jsThemeList, sntGuestWebSrv){
                var theme = reservationAndhotelData.hotel_theme;
                return sntGuestWebSrv.fetchTemplateAssets(theme);
            }]
       }	
    });	
}]);