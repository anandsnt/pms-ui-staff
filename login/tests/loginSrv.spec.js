describe('Login Services', function () {
    var loginSrv;

    beforeEach(module('login'));

    beforeEach(inject(function (_loginSrv_) {
        loginSrv = _loginSrv_;
    }));

    it('service should exist', function () {
        expect(loginSrv).toBeDefined();
    });

    it('this should fail', function () {
        expect(true).toBe(false);
    });
});
