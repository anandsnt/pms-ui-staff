admin.controller('ADZestCheckinEmailSettingsCtrl', ['$scope', '$state', 'generalSettings', 'checkinSettings', 'ngDialog', '$filter',
    function($scope, $state, generalSettings, checkinSettings, ngDialog, $filter) {
        $scope.mainHeading = $filter('translate')('CHECKIN_TEXT_SETTINGS');
        $scope.generalSettings = generalSettings;
        $scope.currentYear = new Date().getFullYear();


        $scope.email_text_1 = checkinSettings.email_text_1;
        $scope.email_text_2 = checkinSettings.email_text_2;
        $scope.button_text = checkinSettings.button_text;
        $scope.subject_text = checkinSettings.subject_text;

        $scope.previewClicked = function() {
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
                scope: $scope
            });
        };
    }
]);