angular.module('adminToolsRouter', []).config(function($stateProvider){
    $stateProvider.state('admin.telnet', {
		url: '/admin/telnet',
		templateUrl: '/assets/partials/tools/adTelnetInterface.html',
		controller: 'adTelnetInterfaceCtrl'
	});	
});