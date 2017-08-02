admin.controller('ADZestEmailGeneralSettingsCtrl', ['$scope', '$state','generalSettings','ngDialog',
    function($scope, $state,generalSettings,ngDialog) {
        console.log(generalSettings);
        $scope.generalSettings = generalSettings;
        var main_bg_image = angular.copy(generalSettings.main_bg_image);
        $scope.currentYear = new Date().getFullYear();
        $scope.email_text_1 = "This is a sample text for testing. You can enter the required texts in the individual settings for each process.";
        $scope.email_text_2 = "This is a sample text for testing. You can enter the required texts in the individual settings for each process.";
        $scope.button_text = "Button sample text";

        $scope.previewClicked = function(){
            if ($scope.generalSettings.main_bg_image.length > 0) {
                $scope.main_bg_style = "background-image:url(" + $scope.generalSettings.main_bg_image + ");";
            } else {
                $scope.main_bg_style = 'background:' + $scope.generalSettings.main_bg + ';';
            }
            ngDialog.open({
                // controller: $controller('adZestWebPreviewCtrl', {
                //     $scope: $scope
                // }),
                closeByDocument: true,
                template: '/assets/partials/zestEmailTemplates/adzestMailPreview.html',
                className: 'ngdialog-theme-default email-template-preview',
                scope:$scope
            });
        };
    }
]);
