sntGuestWeb.config(['$stateProvider','$urlRouterProvider', function($stateProvider,$urlRouterProvider) {
    // checkout now states
    $stateProvider.state('guestwebRoot', {
        url: '/guestwebRoot/:mode/:reservationId',
        controller: 'homeController',
        resolve: {
            reservationAndhotelData: ['sntGuestWebSrv', '$stateParams', function(sntGuestWebSrv, $stateParams) {


               var absUrl = window.location.href;
               var apiUrl = "";
               //apiUrl = "http://localhost:3000/guest_web/home/index_data?guest_web_token=71cd791334f89a194833da797e856148&reservation_id=1664406#/checkoutRoomVerification"


               if(absUrl.indexOf("reservation_id=") !== -1){
                    var offset= absUrl.indexOf("?");
                    var remainingURl  = absUrl.substring(offset,absUrl.length);
                    var startingUrl  = absUrl.substring(0,offset);
                    apiUrl = startingUrl+"_data"+remainingURl;

               }
               else if(absUrl.indexOf("checkin") !== -1){

               }else if(absUrl.indexOf("checkout") !== -1){

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