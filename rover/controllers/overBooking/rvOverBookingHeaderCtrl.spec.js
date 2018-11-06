describe('RvOverBookingHeaderCtrl', function() {

    var $controller,
        $scope = {},
        $rootScope = {},
        rvOverBookingSrv;

    jasmine.getJSONFixtures().fixturesPath = 'base/unitTestSampleData/';
    var fixtures = loadJSONFixtures('overbookingSampleData.json'),
        jsonResultData = fixtures['overbookingSampleData.json'],
        completeRoomTypeListSampleData = loadJSONFixtures('completeRoomTypeListSampleData.json')['completeRoomTypeListSampleData.json'];

    beforeEach(function() {
        module('sntRover');
        inject(function (_$controller_, _rvOverBookingSrv_, _$rootScope_) {
            $controller = _$controller_;
            $scope = _$rootScope_.$new();
            $rootScope = _$rootScope_.$new();
            rvOverBookingSrv = _rvOverBookingSrv_;
        });

        angular.extend($scope, {
            overBookingObj: jsonResultData,
            addOverBookingObj: {
                fromDate: moment(tzIndependentDate($rootScope.businessDate)).format($rootScope.momentFormatForAPI),
                toDate: moment(tzIndependentDate($rootScope.businessDate)).format($rootScope.momentFormatForAPI),
                weekDayList: [
                    { name: 'MON', id: 1, isChecked: true },
                    { name: 'TUE', id: 2, isChecked: true },
                    { name: 'WED', id: 3, isChecked: true },
                    { name: 'THU', id: 4, isChecked: true },
                    { name: 'FRI', id: 5, isChecked: true },
                    { name: 'SAT', id: 6, isChecked: true },
                    { name: 'SUN', id: 0, isChecked: true }
                ],
                applyForHouse: true,
                applyForRoomTypes: false,
                isShowRoomsLeftToSell: false,
                limitType: 'RMS',
                completeRoomTypeListData: jsonResultData.completeRoomTypeListData,
                roomTypeList: [],
                limitValue: ''
            },
            setScroller: function() {
                return true;
            },
            refreshScroller: function() {
                return true;
            }
        });

        $controller('RvOverBookingHeaderCtrl', {
            $scope: $scope
        });
    });

    it('On clicked clickedPrevDateButton', function() {
        $scope.overBookingObj.startDate = '2017-02-16';

        $scope.clickedPrevDateButton();

        expect($scope.overBookingObj.startDate.slice(0, 10)).toBe('2017-02-03');
        expect($scope.overBookingObj.endDate.slice(0, 10)).toBe('2017-02-16');
    });

    it('On clicked clickedNextDateButton', function() {
        $scope.overBookingObj.startDate = '2017-02-16';

        $scope.clickedNextDateButton();

        expect($scope.overBookingObj.startDate.slice(0, 10)).toBe('2017-02-16');
        expect($scope.overBookingObj.endDate.slice(0, 10)).toBe('2017-03-01');
    });

    it('On clicked toggleRoomTypeFilter', function() {
        var isCheckedBefore = $scope.overBookingObj.isShowRoomTypeFilter,
            isCheckedAfter = '';

        $scope.toggleRoomTypeFilter();
        
        isCheckedAfter = $scope.overBookingObj.isShowRoomTypeFilter;
        expect(isCheckedBefore).toBe(!isCheckedAfter);
    });

    it('On clicked clickedRoomTypeCheckbox', function() {
        var isCheckedBefore = $scope.overBookingObj.roomTypeList[0].isChecked,
            isCheckedAfter = '';

        $scope.clickedRoomTypeCheckbox(0);
        
        isCheckedAfter = $scope.overBookingObj.roomTypeList[0].isChecked;
        expect(isCheckedBefore).toBe(!isCheckedAfter);
    });

    describe('Get showRoomTypeSelectionStatus', function() {

        it('check NOT SHOWING', function() {

            $scope.overBookingObj.roomTypeList = completeRoomTypeListSampleData.isCheckedFalse;

            var status = $scope.showRoomTypeSelectionStatus();
        
            expect(status).toBe('NOT SHOWING');
        });

        it('check SHOW ALL', function() {

            $scope.overBookingObj.roomTypeList = completeRoomTypeListSampleData.isCheckedTrue;

            var status = $scope.showRoomTypeSelectionStatus();
        
            expect(status).toBe('SHOW ALL');
        });

        it('check Select 1 item', function() {
            $scope.overBookingObj.roomTypeList = [{
                "name": "00_a",
                "id": 611,
                "isChecked": false
            }, {
                "name": "00_b",
                "id": 612,
                "isChecked": false
            }, {
                "name": "BB",
                "id": 628,
                "isChecked": false
            }, {
                "name": "Bunk",
                "id": 232,
                "isChecked": true
            }, {
                "name": "comp_one",
                "id": 584,
                "isChecked": false
            }, {
                "name": "comp_two",
                "id": 585,
                "isChecked": false
            }];

            var status = $scope.showRoomTypeSelectionStatus();
        
            expect(status).toBe('Bunk');
        });

        it('check Select more than 1 item', function() {
            $scope.overBookingObj.roomTypeList = [{
                "name": "00_a",
                "id": 611,
                "isChecked": false
            }, {
                "name": "00_b",
                "id": 612,
                "isChecked": false
            }, {
                "name": "BB",
                "id": 628,
                "isChecked": true
            }, {
                "name": "Bunk",
                "id": 232,
                "isChecked": true
            }, {
                "name": "comp_one",
                "id": 584,
                "isChecked": false
            }, {
                "name": "comp_two",
                "id": 585,
                "isChecked": true
            }];

            var status = $scope.showRoomTypeSelectionStatus();
        
            expect(status).toBe('3 OF 6 SELECTED');
        });
        
    });
});