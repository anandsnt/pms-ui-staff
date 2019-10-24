describe('selectPropertyCtrl', function () {

    var $controller,
        selectPropertySrv,
        loginSrv,
        $q,
        $rootScope,
        results = [{
            'code': '001',
            'id': 272,
            'name': '(MGM PRE-PROD) - MGM Grand',
            'uuid': '718480df-cd60-481d-9008-63473d983d60'
        }];

    describe('variable initalizations', function () {
        var $scope = {};

        beforeEach(function () {
            module('login');

            inject(function (_$controller_, _$rootScope_) {
                $controller = _$controller_;

                $scope = _$rootScope_.$new();
            });

            $controller('selectPropertyCtrl', {
                $scope: $scope
            });

        });

        it('declares and initializes propertyResults array', function () {
            expect($scope.propertyResults).toEqual([]);
        });

        it('sets modalClosing property to false by default', function () {
            expect($scope.modalClosing).toEqual(false);
        });

        it('highlights search code', function () {
            var highlightedText = '';

            inject(function (_$controller_) {
                $controller = _$controller_;
            });

            highlightedText = $scope.highlight('Grand Hotel (Bethesda)', 'Grand');

            expect(highlightedText).toEqual('<span class="highlight">Grand</span> Hotel (Bethesda)');

        });
    });

    it('should reset propertyResults to empty array if searchData.length < 3', function () {
        var $scope = {},
            $rootScope;


        module('login');

        inject(function (_$controller_, _$rootScope_) {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
        });

        $scope = $rootScope.$new();

        $controller('selectPropertyCtrl', {
            $scope: $scope
        });

        $scope.propertyResults = angular.copy(results);

        $scope.searchData = 'Gr';

        $scope.filterByQuery();

        expect($scope.propertyResults).toEqual([]);
    });

    it('should load search results', function () {
        var $scope = {};

        module('login');

        inject(function (_$controller_, _selectPropertySrv_, _$q_, _$rootScope_, _loginSrv_) {
            $controller = _$controller_;
            selectPropertySrv = _selectPropertySrv_;
            loginSrv = _loginSrv_;
            $q = _$q_;
            $rootScope = _$rootScope_;

            $scope = _$rootScope_.$new();
        });

        spyOn(loginSrv, 'getApplicationVersion').and.callFake(function () {
            var deferred = $q.defer();

            deferred.resolve(results);
            return deferred.promise;
        });

        spyOn(selectPropertySrv, 'searchChargeCode').and.callFake(function () {
            var deferred = $q.defer();

            deferred.resolve(results);
            return deferred.promise;
        });

        $controller('selectPropertyCtrl', {
            $scope: $scope
        });

        $scope.searchData = 'Grand';

        $scope.filterByQuery();

        // Promise won't be resolved till $apply runs....
        $rootScope.$apply();

        expect($scope.propertyResults[0].id).toBe(results[0].id);
    });

});
