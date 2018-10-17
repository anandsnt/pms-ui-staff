admin.directive('adImageUpload', function() {

    return {
        restrict: 'E',
        replace: 'true',
        scope: {
            imageFile: '=imageFile',
            label: '@label',
            divClass: '@divClass',
            hide: '=hide'
        },
        templateUrl: '/assets/directives/imageUploader/adImageUpload.html',
        controller: function($scope) {

            $scope.hasImageFileUpdatedOrUploading = function() {
                return !!$scope.imageFile && $scope.imageFile.indexOf('/assets/images/logo.png') === -1;
            };

            $scope.removeUploadedFile = function() {
                $scope.imageFile = '';
            };
        }
    };

});