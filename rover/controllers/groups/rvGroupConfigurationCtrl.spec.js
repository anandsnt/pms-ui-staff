describe("rvGroupConfigurationCtrl", function() {
    var $controller,
        $scope,
        rvPermissionSrv,
        $q,
        $rootScope;

    beforeEach(function() {
        module("sntRover");
        inject(function (_$controller_, _$q_, _$rootScope_, _rvPermissionSrv_) {
            $controller = _$controller_;
            $scope = _$rootScope_.$new();
            rvPermissionSrv = _rvPermissionSrv_;
            $q = _$q_;
            $rootScope = _$rootScope_;
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

    it("form should be invalid if force contry at check-in is selected in admin and country is not selected in group summary", function() {
        $rootScope.roverObj = {
            forceCountryAtCheckin: true,
            forceNationalityAtCheckin: false
        };

        $scope.groupConfigData.summary.country_id = '';
        
        spyOn(rvPermissionSrv, "getPermissionValue").and.callFake(function() {
            return true;
        });

        $scope.saveNewGroup();

        expect($scope.errorMessage[0]).toEqual("Group's name, from date, to date, room release date, hold status and country are mandatory");
    });

    it("form should be invalid if force nationality at check-in is selected in admin and nationality is not selected in group summary", function() {
        $rootScope.roverObj = {
            forceCountryAtCheckin: false,
            forceNationalityAtCheckin: true
        };

        $scope.groupConfigData.summary.country_id = '12';
        $scope.groupConfigData.summary.nationality = '';
        
        spyOn(rvPermissionSrv, "getPermissionValue").and.callFake(function() {
            return true;
        });

        $scope.saveNewGroup();

        expect($scope.errorMessage[0]).toEqual("Group's name, from date, to date, room release date, hold status and nationality are mandatory");
    });

    it("form should be invalid if force contry at check-in and force nationality is selected in admin and country and nationality is not selected in group summary", function() {
        $rootScope.roverObj = {
            forceCountryAtCheckin: true,
            forceNationalityAtCheckin: true
        };

        $scope.groupConfigData.summary.country_id = '';
        $scope.groupConfigData.summary.nationality = '';
        
        spyOn(rvPermissionSrv, "getPermissionValue").and.callFake(function() {
            return true;
        });

        $scope.saveNewGroup();

        expect($scope.errorMessage[0]).toEqual("Group's name, from date, to date, room release date, hold status, nationality and country are mandatory");
    });


});