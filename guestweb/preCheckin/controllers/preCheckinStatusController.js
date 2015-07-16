(function() {
	var preCheckinStatusController = function($scope, preCheckinSrv) {

	$scope.isLoading = true;
	preCheckinSrv.completePrecheckin().then(function(response) {
			$scope.isLoading = false;
			if(response.status === 'failure'){
				$scope.netWorkError = true;
			}
			else{
				$scope.responseData =response.data;
			};
		},function(){
			$scope.netWorkError = true;
			$scope.isLoading = false;
	});

};

var dependencies = [
'$scope',
'preCheckinSrv',
preCheckinStatusController
];

snt.controller('preCheckinStatusController', dependencies);
})();