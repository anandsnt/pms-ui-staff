angular.module('adminZestStationRouter', []).config(function($stateProvider) {
    $stateProvider.state('admin.zestStationLanguageSelection', {
		url: '/admin/zest_station_lang_selection',
		templateUrl: '/assets/partials/zestStation/adZestStationLanguageConfig.html',
		controller: 'adZestStationLanguageConfigCtrl'
	});
});