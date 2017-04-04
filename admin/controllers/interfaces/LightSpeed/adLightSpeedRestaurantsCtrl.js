angular.module('admin').controller('adLightSpeedRestaurantsCtrl', ['$scope', 'adLightSpeedPOSSetupSrv',
    function($scope, adLightSpeedPOSSetupSrv) {

        var revertEdit = function() {
                if ($scope.state.editRestaurant) {
                    $scope.restaurants[$scope.state.selected] = angular.copy($scope.state.editRestaurant);
                    $scope.state.editRestaurant = null;
                }
            },
            resetNew = function() {
                $scope.state.new = {
                    name: '',
                    username: '',
                    password: '',
                    company_id: ''
                };
            },
            retrieveRestaurants = function() {
                $scope.callAPI(adLightSpeedPOSSetupSrv.getRestaurants, {
                    successCallBack: function(response) {
                        $scope.restaurants = response;
                    },
                    failureCallBack: function() {
                        $scope.errorMessage = ['Error while retrieving Restaurants list.'];
                    }
                });
            };


        $scope.onSelect = function(idx, restaurant) {
            $scope.state.editRestaurant = angular.copy(restaurant);
            $scope.state.selected = idx;
        };


        $scope.onClickAdd = function() {
            $scope.state.mode = 'ADD';
            $scope.state.selected = null;
            resetNew();
        };

        $scope.onCancelAdd = function() {
            $scope.state.mode = '';
        };

        $scope.onCancelEdit = function() {
            $scope.state.mode = '';
            revertEdit();
            $scope.state.selected = null;
        };

        $scope.deleteRestaurant = function(restaurant) {
            $scope.callAPI(adLightSpeedPOSSetupSrv.deleteRestaurant, {
                params: restaurant.id,
                successCallBack: function() {
                    retrieveRestaurants();
                },
                failureCallBack: function(err) {
                    $scope.errorMessage = err;
                }
            });
        };

        $scope.hasCompanyChanged = function() {
            if ($scope.state.editRestaurant &&
                $scope.state.editRestaurant.company_id !== $scope.restaurants[$scope.state.selected].company_id) {
                return 'yes';
            }
            return 'no';

        };

        $scope.updateRestaurant = function(restaurant) {
            $scope.callAPI(adLightSpeedPOSSetupSrv.updateRestaurant, {
                params: restaurant,
                successCallBack: function() {
                    $scope.errorMessage = '';
                    $scope.onCancelEdit();
                    retrieveRestaurants();
                },
                failureCallBack: function(err) {
                    $scope.errorMessage = err;
                }
            });
        };

        $scope.createRestaurant = function() {
            $scope.callAPI(adLightSpeedPOSSetupSrv.createRestaurant, {
                params: angular.copy($scope.state.new),
                successCallBack: function() {
                    $scope.errorMessage = '';
                    $scope.state.mode = '';
                    retrieveRestaurants();
                },
                failureCallBack: function(err) {
                    $scope.errorMessage = err;
                }
            });
        };

        /**
         * Initialization
         * @return {undefined}
         */
        (function() {
            retrieveRestaurants();
        }());
    }]);
