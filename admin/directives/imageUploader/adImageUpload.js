admin.directive('adImageUpload', function($timeout) {

    return {
        restrict: 'E',
        replace: 'true',
        scope: {
            imageFile: '=imageFile',
            label: '@label',
            required: '@required',
            id: '@id',
            divClass: '@divClass'
        },
        templateUrl: '/assets/directives/imageUploader/adImageUpload.html',
        controller: function($scope) {

            $scope.hidePreview = true;

            $scope.onTogglePreview = function(bool) {
                $scope.hidePreview = bool;
            };

            $scope.hasImageFileUpdatedOrUploading = function() {
                return !!$scope.imageFile && $scope.imageFile.indexOf('/assets/images/logo.png') === -1;
            };

            $scope.removeUploadedFile = function() {
                $scope.imageFile = '';
            };
        }
    };

});