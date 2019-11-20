describe('ADChannelMgrRatesEditCtrl', function () {

    var $controller,
        $scope = {},
        ADChannelMgrSrv,
        $q;

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

        $controller('ADChannelMgrRatesEditCtrl', {
            $scope: $scope
        });

        $scope.state = {
            mode: 'LIST'
        };

        $scope.currentMapping = {
            availableRoomTypes: [{id: 1}, {id: 2}],
            room_types: [{id: 3}, {id: 4}]
        };
    });

    it('moveSelected: assign the selected room', function () {
        $scope.selectedUnAssignedRoomIndex = 1;
        $scope.moveSelected('ASSIGN');

        expect(_.filter($scope.currentMapping.room_types, {id: 2}).length)
            .toBe(1);
    });

    it('moveSelected: un-assign the selected room', function () {
        $scope.selectedAssignedRoomIndex = 1;
        $scope.moveSelected('UNASSIGN');

        expect(_.filter($scope.currentMapping.availableRoomTypes, {id: 4}).length)
            .toBe(1);
    });

    it('moveAll: assign all', function () {
        $scope.moveAll('ASSIGN');

        expect($scope.currentMapping.availableRoomTypes.length)
            .toBe(0);
        expect($scope.currentMapping.room_types.length)
            .toBe(4);
    });

    it('moveAll: un-assign all', function () {
        $scope.moveAll('UNASSIGN');

        expect($scope.currentMapping.availableRoomTypes.length)
            .toBe(4);
        expect($scope.currentMapping.room_types.length)
            .toBe(0);
    });

    it('reachedAssignedRoomTypes: unset selectedAssignedRoomIndex', function () {
        $scope.selectedAssignedRoomIndex = 9;
        $scope.reachedAssignedRoomTypes();

        expect($scope.selectedAssignedRoomIndex)
            .toBe(-1);
    });

    it('reachedUnAssignedRoomTypes: unset selectedUnAssignedRoomIndex', function () {
        $scope.selectedUnAssignedRoomIndex = 9;
        $scope.reachedUnAssignedRoomTypes();

        expect($scope.selectedUnAssignedRoomIndex)
            .toBe(-1);
    });

    it('unAssignedRoomSelected: set selectedUnAssignedRoomIndex', function () {
        $scope.selectedUnAssignedRoomIndex = 7;

        $scope.unAssignedRoomSelected(null, 6);
        expect($scope.selectedUnAssignedRoomIndex)
            .toBe(6);
    });

    it('unAssignedRoomSelected: reset selectedUnAssignedRoomIndex if same room type is selected', function () {
        $scope.selectedUnAssignedRoomIndex = 7;

        $scope.unAssignedRoomSelected(null, 7);
        expect($scope.selectedUnAssignedRoomIndex)
            .toBe(-1);
    });

    it('assignedRoomSelected: set selectedAssignedRoomIndex', function () {
        $scope.selectedAssignedRoomIndex = 7;

        $scope.assignedRoomSelected(null, 6);
        expect($scope.selectedAssignedRoomIndex)
            .toBe(6);
    });

    it('assignedRoomSelected: reset selectedAssignedRoomIndex if same room type is selected', function () {
        $scope.selectedAssignedRoomIndex = 7;

        $scope.assignedRoomSelected(null, 7);
        expect($scope.selectedAssignedRoomIndex)
            .toBe(-1);
    });

    it('stopEditing: should reset mode to LIST if adding a new entry', function () {
        $scope.state.mode = 'ADD';
        $scope.stopEditing();

        expect($scope.state.mode)
            .toEqual('LIST');
    });

    it('stopEditing: should reset editing flag of the passed rate', function () {
        var map = {
            editing: true
        };

        $scope.stopEditing(map);

        expect(map.editing)
            .toEqual(false);
    });

    describe('methods invoking services', function () {
        beforeEach(function () {
            spyOn(ADChannelMgrSrv, 'update')
                .and
                .callFake(function () {
                    var deferred = $q.defer();

                    deferred.resolve({});
                    return deferred.promise;
                });
            ;
            spyOn(ADChannelMgrSrv, 'add')
                .and
                .callFake(function () {
                    var deferred = $q.defer();

                    deferred.resolve({});
                    return deferred.promise;
                });
            ;
        });

        it('save: calls update API if editing', function () {
            $scope.save();
            expect(ADChannelMgrSrv.update)
                .toHaveBeenCalled();
        });

        it('save: calls add API if adding new rate and room types', function () {
            $scope.state.mode = 'ADD';
            $scope.save();
            expect(ADChannelMgrSrv.add)
                .toHaveBeenCalled();
        });
    });
});
