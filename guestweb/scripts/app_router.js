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
            cssThemeList: ['sntGuestWebSrv', function(sntGuestWebSrv) {
            	return sntGuestWebSrv.fetchCSSHotelThemeList();
            }],
            fetchJsThemeFiles: ['reservationAndhotelData', 'jsThemeList', 'sntGuestWebSrv', function(reservationAndhotelData, jsThemeList, sntGuestWebSrv){
            	var theme = reservationAndhotelData.hotel_theme;
            	return sntGuestWebSrv.fetchJsAssets(theme, ['sntGuestWeb']);
            }],
            fetchCSSThemeFiles: ['reservationAndhotelData', 'cssThemeList', 'sntGuestWebSrv', function(reservationAndhotelData, jsThemeList, sntGuestWebSrv){
            	var theme = reservationAndhotelData.hotel_theme;
            	return sntGuestWebSrv.fetchCSSAssets(theme);
            }]

       }	
    });	
}]);