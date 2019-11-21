describe('rvGroupRoomingListCtrl', function() {
    var $controller,
        $scope,
        util;

    beforeEach(function() {
        module('sntRover');
        inject(function (_$controller_, _$rootScope_, _rvUtilSrv_) {
            $controller = _$controller_;
            $scope = _$rootScope_.$new();
            util = _rvUtilSrv_;
        });

        angular.extend($scope, {
            isInAddMode: function() {
                return false;
            },
            groupConfigData: {
                summary: {}
            }
        });
        $controller("rvGroupRoomingListCtrl", {
            $scope: $scope
        });
    });

    it('should show the assigned room block while printing when exclude room no is false', function() {
        $scope.emailPrintFilters.excludeRoomNumber = false;
        $scope.isPrintClicked = true;

        var reservation = {
            room_no: 10
        };

        expect($scope.shouldShowAssignedRoom(reservation)).toBe(true);
    });

    it('should not show the assigned room block while printing when exclude room no is true', function() {
        $scope.emailPrintFilters.excludeRoomNumber = true;
        $scope.isPrintClicked = true;

        var reservation = {
            room_no: 10
        };

        expect($scope.shouldShowAssignedRoom(reservation)).toBe(false);
    });

    it('should show the unassigned assigned room block while printing when exclude room no is false', function() {
        $scope.emailPrintFilters.excludeRoomNumber = false;
        $scope.isPrintClicked = true;

        var reservation = {
            room_no: ''
        };

        expect($scope.shouldShowUnAssigned(reservation)).toBe(true);
    });

    it('should not show the unassigned assigned room block while printing when exclude room no is true', function() {
        $scope.emailPrintFilters.excludeRoomNumber = true;
        $scope.isPrintClicked = true;

        var reservation = {
            room_no: ''
        };

        expect($scope.shouldShowUnAssigned(reservation)).toBe(false);
    });

    it('should show the accompany guests while printing when exclude accompany guests is false', function() {
        $scope.emailPrintFilters.excludeAccompanyingGuests = false;
        $scope.isPrintClicked = true;

        var reservation = {
            is_accompanying_guest: true
        };

        expect($scope.shouldHideAccompanyGuests(reservation)).toBe(false);
    });

    it('should hide the accompany guests while printing when exclude accompany guests is true', function() {
        $scope.emailPrintFilters.excludeAccompanyingGuests = true;
        $scope.isPrintClicked = true;

        var reservation = {
            is_accompanying_guest: true
        };

        expect($scope.shouldHideAccompanyGuests(reservation)).toBe(true);
    });


});