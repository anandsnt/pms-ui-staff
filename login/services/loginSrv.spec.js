describe('LoginSrv', function () {


    describe('.login(data, onSuccess, onFailure)', function () {
        var
            successLoginResponse = {
                'status': 'success',
                'data': {'redirect_url': '/staff', 'token': '', 'notifications': '', 'is_sp_admin': true, data: 'x'},
                'errors': []
            };

        beforeEach(function () {
            module('login');

            inject(function (_loginSrv_, _$httpBackend_) {
                this.loginSrv = _loginSrv_;
                this.$httpBackend = _$httpBackend_;
            });


        });

        afterEach(function () {
            this.$httpBackend.verifyNoOutstandingExpectation();
            this.$httpBackend.verifyNoOutstandingRequest();
        });



        it('invokes onSuccess', inject(function () {
            var response;

            $httpBackend.when('POST', '/login/submit')
                .respond(200, successLoginResponse);


            loginSrv.login({
                email: 'wrong_email',
                password: 'password'
            }, function () {
                response = 'success';
            }, function () {
                response = 'failure';
            }).then(function (data) {
                response = data;
            });

            $httpBackend.flush(1);

            expect(response).toEqual('success');
        }));

        /**
         * CICO-
         */
        it('handle internal server error', inject(function () {
            var response;

            $httpBackend.when('POST', '/login/submit')
                .respond(500);

            loginSrv.login({
                email: 'email',
                password: 'password'
            }, function () {
                response = 'success';
            }, function () {
                response = 'failure';
            }).then(function (data) {
                response = data;
            }, function (data) {
                response = data;
            });

            $httpBackend.flush(1);
            expect(response).toEqual(['Internal server error occured']);
        }));
    })


});
