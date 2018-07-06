describe('rvAddOverBookingPopupCtrl', function() {

    var $controller,
        $scope = {},
        $rootScope = {},
        $q,
        that,
        rvOverBookingSrv;

    jasmine.getJSONFixtures().fixturesPath = 'base/unitTestSampleData/';
    var fixtures = loadJSONFixtures('overbookingSampleData.json'),
        jsonResultData = fixtures['overbookingSampleData.json'];

    beforeEach(function() {
        module('sntRover');
        inject(function (_$controller_, _rvOverBookingSrv_, _$rootScope_, _$q_) {
            $controller = _$controller_;
            $scope = _$rootScope_.$new();
            $rootScope = _$rootScope_.$new();
            $q = _$q_;
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

        that = $controller('rvAddOverBookingPopupCtrl', {
            $scope: $scope
        });

    });

    it('Show date picker', function() {
        var type = 'FROM';

        $scope.showDatePicker(type);
        expect($scope.addOverBookingObj.type).toBe(type);
    });

    it('On clicked ApplyForHouse', function() {
        var isCheckedBefore = $scope.addOverBookingObj.applyForHouse;

        $scope.clickedApplyForHouse();
        var isCheckedAfter = $scope.addOverBookingObj.applyForHouse;

        expect(isCheckedBefore).toBe(!isCheckedAfter);
    });

    it('On clicked ApplyForRoomTypes', function() {
        var isCheckedBefore = $scope.addOverBookingObj.applyForRoomTypes;

        $scope.clickedApplyForRoomTypes();
        var isCheckedAfter = $scope.addOverBookingObj.applyForRoomTypes;

        expect(isCheckedBefore).toBe(!isCheckedAfter);
    });

    it('On clicked RoomTypeCheckbox', function() {
        var isCheckedBefore = $scope.addOverBookingObj.roomTypeList[0].isChecked;

        $scope.clickedRoomTypeCheckbox(0);
        var isCheckedAfter = $scope.addOverBookingObj.roomTypeList[0].isChecked;

        expect(isCheckedBefore).toBe(!isCheckedAfter);
    });

    it('On clicked WeekDays cell', function() {
        var isCheckedBefore = $scope.addOverBookingObj.weekDayList[5].isChecked;

        $scope.clickedWeekDay(5);
        var isCheckedAfter = $scope.addOverBookingObj.weekDayList[5].isChecked;
        
        expect(isCheckedBefore).toBe(!isCheckedAfter);
    });

    it('Invoke getSelectedIdList', function() {

        var input = [
            {
                "name": "00_a",
                "id": 611,
                "isChecked": true
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
                "isChecked": false
            }, {
                "name": "comp_one",
                "id": 584,
                "isChecked": true
            }, {
                "name": "comp_two",
                "id": 585,
                "isChecked": false
            }],
            output = [],
            selectedIdList = [611, 628, 584];

            output = that.getSelectedIdList(input);

        expect(output[0]).toBe(selectedIdList[0]);
        expect(output[1]).toBe(selectedIdList[1]);
        expect(output[2]).toBe(selectedIdList[2]);
    });

    it('Invoke POST addOverBookingApiCall', function() {
        
        spyOn(rvOverBookingSrv, 'addOrEditOverBooking').and.callFake(function () {
            var deferred = $q.defer(),
                response = {};

            deferred.resolve(response);
            return deferred.promise;
        });

        $scope.addOverBookingApiCall();

        $scope.$apply();

        expect(true).toEqual(true);
    });

});