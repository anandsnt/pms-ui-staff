admin.controller('ADZestBaseEmailSettingsCtrl', ['$scope', '$state', 'ngDialog', '$sce',
    function($scope, $state, ngDialog, $sce) {
        $scope.currentYear = new Date().getFullYear();

        $scope.trustHtml = function(str){
            return $sce.trustAsHtml(str);
        };
        $scope.previewClicked = function() {
            if ($scope.generalSettings.main_bg_image.length > 0) {
                $scope.data.main_bg_style = "background-image:url(" + $scope.generalSettings.main_bg_image + ");";
            } else {
                $scope.data.main_bg_style = 'background:' + $scope.generalSettings.main_bg + ';';
            }
            ngDialog.open({
                closeByDocument: true,
                template: '/assets/partials/zestEmailTemplates/adzestMailPreview.html',
                className: 'ngdialog-theme-default email-template-preview',
                scope: $scope
            });
        };
    }
]);