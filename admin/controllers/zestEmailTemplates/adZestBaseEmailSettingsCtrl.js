admin.controller('ADZestBaseEmailSettingsCtrl', ['$scope', '$state', 'ngDialog', '$sce', 'adZestEmailTemplateSrv',
    function($scope, $state, ngDialog, $sce, adZestEmailTemplateSrv) {
        $scope.currentYear = new Date().getFullYear();
        var emailType;
        $scope.setData = function(data, processData, type) {
            emailType = type;
            $scope.data = processData;
            $scope.generalSettings = data.general_email_template_settings;
            $scope.hotelDetails = data.hotel_details;
        };
        /*
        * @params
        * type - String variable
        * isKeyEmail - Bool
        */
        $scope.saveAdminSettings = function(type, isKeyEmail) {
            var params = {};

            params[type] = {
                "email_text_1": $scope.data.email_text_1,
                "email_text_2": $scope.data.email_text_2,
                "subject_text": $scope.data.subject_text
            };
            if (_.isUndefined(isKeyEmail)) {
                params[type].button_text = $scope.data.button_text;
            }
            var options = {
                params: params,
                successCallBack: function() {
                    $scope.successMessage = 'Success!';
                }
            };

            $scope.callAPI(adZestEmailTemplateSrv.saveSettings, options);
        };
        /**
         * Methode for showing preview for zest/key-delivery mail
         * @param none
         */
        $scope.previewClicked = function() {
            if ($scope.generalSettings.use_main_bg_image && $scope.generalSettings.main_bg_image.length > 0) {
                $scope.data.main_bg_style = "background-image:url(" + $scope.generalSettings.main_bg_image + ");";
            } else {
                $scope.data.main_bg_style = 'background:' + $scope.generalSettings.main_bg + ';';
            }
            var template;

            if (!_.isUndefined(emailType) && emailType === 'KEY_EMAIL') {
                template = '/assets/partials/zestEmailTemplates/adZestKeyDeliveryEmailPreview.html';
            } else {
                template = '/assets/partials/zestEmailTemplates/adzestMailPreview.html';
            }
            ngDialog.open({
                closeByDocument: true,
                template: template,
                className: 'ngdialog-theme-default email-template-preview',
                scope: $scope
            });

        };
    }
]);
