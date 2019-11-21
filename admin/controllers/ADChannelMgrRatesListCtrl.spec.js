describe('ADChannelMgrRatesListCtrl', function () {

    var $controller,
        $scope = {},
        ADChannelMgrSrv,
        $q,
        controller;

    beforeEach(function () {
        module('admin');

        inject(function (_$controller_, _$rootScope_, _ADChannelMgrSrv_, _$q_) {
            $controller = _$controller_;
            $scope = _$rootScope_.$new();
            ADChannelMgrSrv = _ADChannelMgrSrv_;
            $q = _$q_;
        });
        angular.extend($scope, {
            'setScroller': function () {
                return true;
            }
        });

        controller = $controller('ADChannelMgrRatesListCtrl', {
            $scope: $scope
        });

        $scope.currentMapping = {
            availableRoomTypes: [{id: 1}, {id: 2}],
            room_types: [{id: 3}, {id: 4}]
        };

        spyOn(ADChannelMgrSrv, 'deleteRateOnChannel').and.callFake(function() {
            var deferred = $q.defer();

            deferred.resolve({});
            return deferred.promise;
        });

        spyOn(ADChannelMgrSrv, 'toggleMappingStatus').and.callFake(function() {
            var deferred = $q.defer();

            deferred.resolve({});
            return deferred.promise;
        });

    });

    it('removeAssignedRoomTypes: only room types that havent been assigned already should be available in the first column', function () {
        var allRoomTypes = [{id: 1}, {id: 2}, {id: 3}],
            assignedRoomTypes = [{id: 2}];

        expect(controller.removeAssignedRoomTypes(allRoomTypes, assignedRoomTypes))
            .toEqual([{id: 1}, {id: 3}]);
    });

    it('toggleActivate', function () {
        $scope.toggleActivate($scope.currentMapping);

        expect(ADChannelMgrSrv.toggleMappingStatus)
            .toHaveBeenCalled();
    });

    it('deleteRateOnChannel', function () {
        $scope.delete($scope.currentMapping);

        expect(ADChannelMgrSrv.deleteRateOnChannel)
            .toHaveBeenCalled();
    });


});
