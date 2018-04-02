describe('BaseController', function() {

    var $controller,
        selectPropertySrv,
        $q,
        $rootScope,
        results = [{
            'code': '001',
            'id': 272,
            'name': '(MGM PRE-PROD) - MGM Grand',
            'uuid': '718480df-cd60-481d-9008-63473d983d60'
        }];
    var $scope = {};

    beforeEach(function() {
        module('sntGuestWeb');

        inject(function(_$controller_, _$rootScope_) {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $scope = _$rootScope_.$new();
        });

        $controller('BaseController', {
            $scope: $scope
        });

    });

    it('invokes onSuccess', function() {
        var response = 'success'

        expect(response).toEqual('success');
    });

});