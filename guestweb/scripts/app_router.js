sntGuestWeb.config(['$stateProvider','$urlRouterProvider', function($stateProvider,$urlRouterProvider) {
    // checkout now states
    $stateProvider.state('guestwebRoot', {
        url: '/guestwebRoot/:mode/:reservationId',
        controller: 'homeController',
        resolve: {
            reservationAndhotelData: ['sntGuestWebSrv', '$stateParams', function(sntGuestWebSrv, $stateParams) {
            	if ($stateParams.mode == 'checkout') {
            		return sntGuestWebSrv.fetchHotelDetailsOnExtCheckoutUrl();
            	}
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