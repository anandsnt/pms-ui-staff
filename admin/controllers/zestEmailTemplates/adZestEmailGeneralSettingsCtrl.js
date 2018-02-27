admin.controller('ADZestEmailGeneralSettingsCtrl', ['$scope', '$sce', 'data', 'ngDialog', 'adZestEmailTemplateSrv',
    function($scope, $sce, data, ngDialog, adZestEmailTemplateSrv) {
        
        $scope.generalSettings = data.general_email_template_settings;
        $scope.hotelDetails = data.hotel_details;
        var mainBgImage = angular.copy($scope.generalSettings.main_bg_image);

        $scope.successMessage = '';
        $scope.data = {};
        $scope.data.currentYear = new Date().getFullYear();
        $scope.data.email_text_1 = "This is a sample text for testing. You can enter the required texts in the individual settings for each process.";
        $scope.data.email_text_2 = "This is a sample text for testing. You can enter the required texts in the individual settings for each process.";
        $scope.data.button_text = "Button sample text";

        $scope.fileName = "Choose File....";
        $scope.data.email_main_bg_image = $scope.fileName;

        $scope.$watch(
            function() {
                return $scope.generalSettings.main_bg_image;
            },
            function(img) {
                if (img === '') {
                    $scope.fileName = "Choose File....";
                }
                $scope.data.email_main_bg_image = $scope.fileName;
            }
        );

        $scope.previewClicked = function() {
            if ($scope.generalSettings.use_main_bg_image && $scope.generalSettings.main_bg_image.length > 0) {
                $scope.data.main_bg_style = "background-image:url(" + $scope.generalSettings.main_bg_image + ");";
            } else {
                $scope.data.main_bg_style = 'background:' + $scope.generalSettings.main_bg + ';';
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

        $scope.saveSettings = function() {
            var params = {
                general_email_template_settings: angular.copy($scope.generalSettings)
            };

            if (mainBgImage === $scope.generalSettings.main_bg_image) {
                var unwantedKeys = ["main_bg_image"];
                
                params.general_email_template_settings = dclone(params.general_email_template_settings, unwantedKeys);
            }
            var options = {
                params: params,
                successCallBack: function() {
                    $scope.successMessage = 'Sucess!';
                }
            };

            $scope.callAPI(adZestEmailTemplateSrv.saveSettings, options);
        };
    }
]);
