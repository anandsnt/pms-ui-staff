admin.controller('ADZestBaseEmailSettingsCtrl', ['$scope', '$state', 'ngDialog', '$sce', 'adZestEmailTemplateSrv',
    function($scope, $state, ngDialog, $sce, adZestEmailTemplateSrv) {
        $scope.currentYear = new Date().getFullYear();

        $scope.trustHtml = function(str) {
            return $sce.trustAsHtml(str);
        };

        $scope.setData = function(data, processData) {
            $scope.data = processData;
            $scope.generalSettings = data.general_email_template_settings;
            $scope.hotelDetails = data.hotel_details;
        };

        $scope.saveAdminSettings = function(type) {
            var params = {}
            params[type] = {
                "email_text_1": $scope.data.email_text_1,
                "email_text_2": $scope.data.email_text_2,
                "button_text": $scope.data.button_text,
                "subject_text": $scope.data.subject_text
            };
            var options = {
                params: params,
                successCallBack: function() {
                    $scope.successMessage = 'Sucess!';
                }
            };

            $scope.callAPI(adZestEmailTemplateSrv.saveSettings, options);
        };

        $scope.previewClicked = function() {
            if ($scope.generalSettings.use_main_bg_image && $scope.generalSettings.main_bg_image.length > 0) {
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