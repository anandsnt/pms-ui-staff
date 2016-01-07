admin.controller('ADZestStationCtrl',['$scope','$rootScope', '$state','$stateParams', 'ADZestStationSrv', '$filter',  function($scope, $state,$rootScope, $stateParams, ADZestStationSrv, $filter){
	BaseCtrl.call(this, $scope);
	$scope.$emit("changedSelectedMenu", 1);
        
        $scope.data = {};
        
        $scope.updateField = function(field, value, old){
            if (value !== old){
                $scope.updateFieldColor(field, value);
            }
            if (typeof value === typeof 'string'){
                if (value.indexOf('#')){//show has in field, but dont send when saving
                    value = '#'+value;
                }
            } else {
                value = '';
            }
            $scope.updateFieldColor(field, value);
            $scope.data[field] = value;
            
        };
        $scope.$watch('zestSettings.colors.text',function(value, old){$scope.updateField('text',value, old)});
        $scope.$watch('zestSettings.colors.background',function(value, old){$scope.updateField('background',value, old)});
        $scope.$watch('zestSettings.colors.button',function(value, old){$scope.updateField('button',value, old)});
        $scope.$watch('zestSettings.colors.transparent',function(value, old){$scope.updateField('transparent',value, old)});
        $scope.$watch('zestSettings.colors.input_field_background',function(value, old){$scope.updateField('input_field_background',value, old)});
        $scope.$watch('zestSettings.colors.header_icons',function(value, old){$scope.updateField('header_icons',value, old)});
        $scope.$watch('zestSettings.colors.header_icons_pressed',function(value, old){$scope.updateField('header_icons_pressed',value, old)});
        
        $scope.updateFieldColor = function(field_id){
            //function to update color preview inline
            $('#'+field_id+' > div > input').css('border-color', $scope.data[field_id]);
        };
        
        $scope.fetchSettings = function(){
            var fetchSuccess = function(data){
                if (data.colors){
                    $scope.data = data.colors;
                }
                $scope.zestSettings = data;
                $scope.$emit('hideLoader');
            };
            $scope.invokeApi(ADZestStationSrv.fetch, {}, fetchSuccess);
        };
        $scope.saveSettings = function(){
            var saveSuccess = function(){
                $scope.successMessage = 'Success';
                $scope.$emit('hideLoader');
            };
            var saveFailed = function(response){
                $scope.errorMessage = 'Failed';
                $scope.$emit('hideLoader');
            };
            var hasTagsRemoved = function(str){
                var regexp = new RegExp('#','g');
                str = str.replace(regexp, '');
                return str;
            };
            
            var data = $scope.zestSettings.colors;
            var colorData = {};
             colorData.text = hasTagsRemoved(data.text);
             colorData.background = hasTagsRemoved(data.background);
             colorData.button = hasTagsRemoved(data.button);
             colorData.transparent = hasTagsRemoved(data.transparent);
             colorData.input_field_background = hasTagsRemoved(data.input_field_background);
             colorData.header_icons = hasTagsRemoved(data.header_icons);
             colorData.header_icons_pressed = hasTagsRemoved(data.header_icons_pressed);
            var dataToSend = {
                                'kiosk':
                                        {
                                            "colors":colorData,
                                            "home_screen":$scope.zestSettings.home_screen,
                                            "guest_bill":$scope.zestSettings.guest_bill,
                                            "registration_card":$scope.zestSettings.registration_card,
                                            "reg_card_text":$scope.zestSettings.reg_card_text,
                                            "show_room_number":$scope.zestSettings.show_room_number,
                                            "enforce_deposit":$scope.zestSettings.enforce_deposit
                                        }

                             };
            $scope.invokeApi(ADZestStationSrv.save, dataToSend, saveSuccess, saveFailed);
        };
        
        $scope.init = function(){
            $scope.fetchSettings();
        };
        
        $scope.init();
    

}]);