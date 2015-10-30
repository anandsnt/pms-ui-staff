
var sntZestStation = angular.module('sntZestStation',[
		'ui.router',
		'ui.utils',
		'ng-iscroll',
		'ngDialog',
		'ngAnimate',
		'ngSanitize',
		'pascalprecht.translate',
		'ui.date',
		'ui.calendar',
		'documentTouchMovePrevent',
		'divTouchMoveStopPropogate',
		'pasvaz.bindonce',
		'sharedHttpInterceptor',
		'orientationInputBlurModule',
		'iscrollStopPropagation','touchPress']);


//adding shared http interceptor, which is handling our webservice errors & in future our authentication if needed
sntZestStation.config(function ($httpProvider) {
  $httpProvider.interceptors.push('sharedHttpInterceptor');
});