admin.controller('ADZestEmailPrecheckinSettingsCtrl', ['$scope', '$state', 'generalSettings', 'precheckinSettings', 'ngDialog',
    function($scope, $state, generalSettings, precheckinSettings, ngDialog) {
        // console.log(generalSettings);
        $scope.generalSettings = generalSettings;
        $scope.currentYear = new Date().getFullYear();


        $scope.email_text_1 = precheckinSettings.email_text_1;
        $scope.email_text_2 = precheckinSettings.email_text_2;
        $scope.button_text = precheckinSettings.button_text;
        $scope.subject_text = precheckinSettings.subject_text;

        $scope.previewClicked = function() {
            ngDialog.open({
                // controller: $controller('adZestWebPreviewCtrl', {
                //     $scope: $scope
                // }),
                closeByDocument: true,
                template: '/assets/partials/zestEmailTemplates/adzestMailPreview.html',
                className: 'ngdialog-theme-default email-template-preview',
                scope: $scope
            });
        };
    }
]);