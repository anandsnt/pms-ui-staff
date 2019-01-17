'use strict';

angular.module('admin').controller('adLightSpeedCopyMapppingCtrl', ['$scope', 'adLightSpeedPOSSetupSrv', 'ngDialog', function ($scope, adLightSpeedPOSSetupSrv, ngDialog) {


    var initialize = function initialize() {
        $scope.restaurants = [];
        $scope.floors = [];
        $scope.data = {};
        fetchRestaurants();
    };

    var fetchRestaurants = function() {
        $scope.callAPI(adLightSpeedPOSSetupSrv.fetchRestaurants, {
            successCallBack: function successCallBack(response) {
                $scope.data.selectedRestaurant = response[0];
                $scope.restaurants = response;
                $scope.fetchFloors();
            },
            failureCallBack: function failureCallBack() {
                $scope.errorMessage = ['Error while retrieving products list.'];
            }
        });
    };

    $scope.fetchFloors = function() {
        $scope.callAPI(adLightSpeedPOSSetupSrv.fetchFloors, {
            params: {
                'id': $scope.data.selectedRestaurant.id
            },
            successCallBack: function successCallBack(response) {
                $scope.floors = response.status;
                $scope.processListForSelectedFloor(response.status[0]);
            },
            failureCallBack: function failureCallBack() {
                $scope.errorMessage = ['Error while retrieving products list.'];
            }
        });
    };

    $scope.processListForSelectedFloor = function(floor) {
        if ( floor ) {
            $scope.data.selectedFloor = floor;
        }
        _.each($scope.floors, function(floor) {
            floor.isSelected = false;
        });
        $scope.data.floorList = _.without($scope.floors, $scope.data.selectedFloor);
    };

    $scope.changedSelectedFloorList = function(index) {
        $scope.data.floorList[index].isSelected = !$scope.data.floorList[index].isSelected;
    };

    var formParamsForCopyMappings = function() {
        var selectedFloors = _.filter($scope.data.floorList,
            function(floor) {
                return floor.isSelected;
            }),
            selectedFloorIds = _.pluck(selectedFloors, 'id');

        return {
            'floor_id': $scope.data.selectedFloor.id,
            'selected_floor_ids': selectedFloorIds,
            'map_type': 'CHARGE_CODE',
            'company_id': $scope.data.selectedRestaurant.company_id
        };

    };

    $scope.saveCopyMappings = function () {
        $scope.callAPI(adLightSpeedPOSSetupSrv.saveCopyCodeMapings, {
            params: formParamsForCopyMappings(),
            successCallBack: function successCallBack() {
                $scope.popupMessage = 'Please be patient, this may take a few minutes';
                initialize();
            },
            failureCallBack: function failureCallBack() {
                $scope.errorMessage = ['Error while saving external mappings'];
            }
        });
    };

    $scope.checkBoxSelected = function(selection) {
        var allSelected = _.every($scope.data.floorList, function (floor) {
            return floor.isSelected;
        });

        $scope.someSelected = _.some($scope.data.floorList, function (floor) {
            return floor.isSelected;
        });

        if (selection === 'ALL') {
            _.each($scope.data.floorList, function(floor) {
                floor.isSelected = $scope.data.isAllSelected;
            });
        }

        if (selection !== 'ALL' && $scope.someSelected) {
            $scope.data.isAllSelected = false;
        }

        if (selection !== 'ALL' && allSelected ) {
            $scope.data.isAllSelected = true;
        }

    };

    $scope.closeDialog = function() {
        ngDialog.close();
    };

    $scope.showSaveCopyMappingsPopup = function() {
        $scope.popupMessage = 'This copy will replace any previous mappings. Do you want to proceed??';
        ngDialog.open({
            template: '/assets/partials/interfaces/LightSpeed/adLightSpeedCopyMappingPopup.html',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };

    initialize();
}]);
