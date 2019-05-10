describe("rvGroupConfigurationCtrl", function() {
    var $controller,
        $scope;        

    beforeEach(function() {
        module("sntRover");
        inject(function (_$controller_, _$q_, _$rootScope_) {
            $controller = _$controller_;
            $scope = _$rootScope_.$new();
        });

        $scope.groupConfigData = {};
        $scope.groupConfigData.summary = {
            group_name: 'Test',
            hold_status: 'Definite',
            block_from: '11-12-2018',
            block_to: '14-12-2018',
            release_date: '14-12-2018',
            group_id: 10
        };

        angular.extend($scope, {
            closeDialog: function() {
                return true;
            },
            isInAddMode: function() {
                return false;
            },
            setHeadingTitle: function() {

            }
        });

        $controller('rvGroupConfigurationCtrl', {
            $scope: $scope,
            summaryData: {
                groupSummary: {
                    is_tax_exempt: false,
                    tax_exempt_type: {
                        id: 11
                    }
                }
            },
            holdStatusList: {
                data: {
                    hold_status: []
                }
            },
            hotelSettings: {},
            taxExempts: {},
            countries: []
        });
    });

});