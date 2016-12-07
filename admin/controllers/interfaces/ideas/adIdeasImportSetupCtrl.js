admin.controller('adIdeasImportSetupCtrl', ['$scope', '$rootScope', 'adIdeasSetupSrv',
    function($scope, $rootScope, adIdeasSetupSrv) {
        BaseCtrl.call(this, $scope);

        $scope.saveSetup = function() {
            var params = _.pick($scope.ideaSetup, 'import_enabled', 'hotel_code');

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
