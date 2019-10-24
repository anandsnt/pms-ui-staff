describe('RvOverBookingMainCtrl', function() {

    var $controller,
        $scope = {},
        $rootScope = {},
        that,
        rvOverBookingSrv;

    jasmine.getJSONFixtures().fixturesPath = 'base/unitTestSampleData/';
    var fixtures = loadJSONFixtures('overbookingSampleData.json'),
        jsonResultData = fixtures['overbookingSampleData.json'],
        completeRoomTypeListSampleData = loadJSONFixtures('completeRoomTypeListSampleData.json')['completeRoomTypeListSampleData.json'],
        overBookingGridSampleData = loadJSONFixtures('overBookingGridSampleData.json')['overBookingGridSampleData.json'];

    beforeEach(function() {
        module('sntRover');
        inject(function (_$controller_, _rvOverBookingSrv_, _$rootScope_) {
            $controller = _$controller_;
            $scope = _$rootScope_.$new();
            $rootScope = _$rootScope_.$new();
            rvOverBookingSrv = _rvOverBookingSrv_;
        });

        that = $controller('RvOverBookingMainCtrl', {
            $scope: $scope,
            completeRoomTypeListData: completeRoomTypeListSampleData,
            overBookingGridData: overBookingGridSampleData
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
    });

    it('Invoke getSelectedRoomTypeIdList', function() {

        var selectedRoomTypeIdList = [611, 612, 628, 232, 584, 585, 66, 630, 90, 97, 93, 438, 604, 92, 121, 473, 94, 227, 120, 625, 470, 91],
            outputList = [];
        
        that.init();
        outputList = that.getSelectedRoomTypeIdList();

        expect(selectedRoomTypeIdList[0]).toBe(outputList[0]);
        expect(selectedRoomTypeIdList[3]).toBe(outputList[3]);
        expect(selectedRoomTypeIdList[6]).toBe(outputList[6]);
        expect(selectedRoomTypeIdList[8]).toBe(outputList[8]);
        expect(selectedRoomTypeIdList[11]).toBe(outputList[11]);
    });

});