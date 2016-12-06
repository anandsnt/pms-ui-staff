admin.controller('adIdeasImportSetupCtrl', ['$scope', '$rootScope', 'adIdeasSetupSrv', 'dateFilter',
    function($scope, $rootScope, adIdeasSetupSrv, dateFilter) {
        BaseCtrl.call(this, $scope);

        $scope.saveSetup = function() {
            var params = _.pick($scope.ideaSetup, 'import_enabled', 'import_url', 'hotel_code');
            $scope.errorMessage = '';
            $scope.callAPI(adIdeasSetupSrv.postIdeasSetup, {
                params: params,
                onSuccess: function() {
                    // Navigate back to interfaces list on successful save
                    $scope.$emit('changeMenu', '');
                }
            });
        };
	}
]);