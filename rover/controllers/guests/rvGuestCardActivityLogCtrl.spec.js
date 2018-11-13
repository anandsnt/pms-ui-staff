describe('RVGuestCardActivityLogController', function() {

    var $controller,
        $scope = {},
        that;

    jasmine.getJSONFixtures().fixturesPath = 'base/unitTestSampleData/';
    var fixtures = loadJSONFixtures('activityLogSampleData.json'),
        jsonResultData = fixtures['activityLogSampleData.json'];

    beforeEach(function() {
        module('sntRover');
        inject(function (_$controller_, _$rootScope_) {
            $controller = _$controller_;
            $scope = _$rootScope_.$new();
        });

        that = $controller('RVGuestCardActivityLogController', {
            $scope: $scope
        });

        angular.extend($scope, {
            activityLogObj: {
                response: {},
                perPage: 50,
                page: 1,
                sortField: 'DATE',
                sortOrder: 'asc',
                accountId: ''
            },
            activityLogFilter: {
                user: '',
                date: 'asc',
                action: ''
            },
            activityLogPagination: {
                id: 'ACTIVITY_LOG',
                api: that.loadAPIData,
                perPage: $scope.activityLogObj.perPage
            },
            setScroller: function() {
                return true;
            },
            refreshScroller: function() {
                return true;
            }
        });
    });

    it('Check Show pagination logic', function() {

        $scope.activityLogObj.response = jsonResultData;
        $scope.activityLogObj.response.total_count = 99;
        var showPagination = $scope.showPagination();

        expect(showPagination).toEqual(true);
    });

    it('Check Hide pagination logic', function() {

        $scope.activityLogObj.response = jsonResultData;
        $scope.activityLogObj.response.total_count = 50;
        var showPagination = $scope.showPagination();

        expect(showPagination).toEqual(false);
    });

    it('Check sortByAction Action - Ascending', function() {

        $scope.activityLogFilter.user = 'desc';
        $scope.sortByAction('USERNAME');

        expect($scope.activityLogObj.sortOrder).toEqual('asc');
    });

    it('Check sortByAction Action - Descending', function() {

        $scope.activityLogFilter.user = 'asc';
        $scope.sortByAction('USERNAME');

        expect($scope.activityLogObj.sortOrder).toEqual('desc');
    });

    it('Check old value validation', function() {

        var responceOne = $scope.isOldValue();

        expect(responceOne).toEqual(false);

        var responceTwo = $scope.isOldValue('test data');

        expect(responceTwo).toEqual(true);
    });

});
