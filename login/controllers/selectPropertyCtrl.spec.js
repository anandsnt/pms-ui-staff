describe('selectPropertyCtrl', function () {

    var $controller,
        selectPropertySrv,
        $q,
        $rootScope,
        results = [{
            'code': '001',
            'id': 272,
            'name': '(MGM PRE-PROD) - MGM Grand',
            'uuid': '718480df-cd60-481d-9008-63473d983d60'
        }, {
            'code': 'HS1234',
            'id': 80,
            'name': 'Grand Hotel Bethesda',
            'uuid': '2806f550-690d-11e6-861e-04018298a601'
        }, {
            'code': 'GHG123',
            'id': 172,
            'name': 'Grand Hotel Govindapuram',
            'uuid': '28089b73-690d-11e6-861e-04018298a601'
        }, {
            'code': 'GHI',
            'id': 104,
            'name': 'Grand Hotel India',
            'uuid': '280739d1-690d-11e6-861e-04018298a601'
        }, {
            'code': null,
            'id': 225,
            'name': 'Grand Maratha',
            'uuid': '85d9a8f5-ded9-4dbc-810b-d49785385a3c'
        }, {'code': 'TGP', 'id': 117, 'name': 'The Grande Palace', 'uuid': '28077449-690d-11e6-861e-04018298a601'}];

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


    it('should load search results', function () {
        var $scope = {};

        module('login');

        inject(function (_$controller_, _selectPropertySrv_, _$q_, _$rootScope_) {
            $controller = _$controller_;
            selectPropertySrv = _selectPropertySrv_;
            $q = _$q_;
            $rootScope = _$rootScope_;

            $scope = _$rootScope_.$new();
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

        $rootScope.$apply();

        expect($scope.propertyResults[0].id).toBe(results[0].id);
    });

});
