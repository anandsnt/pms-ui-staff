describe('LoginSrv', function() {
    describe('.login(data, onSuccess, onFailure)', function() {
        var successLoginResponse = {
            'status': 'success',
            'data': {
                'redirect_url': '/staff',
                'token': '',
                'notifications': '',
                'is_sp_admin': true,
                data: 'x'
            },
            'errors': []
        };

        beforeEach(function() {
            module('login');

            inject(function(_loginSrv_, _$httpBackend_) {
                this.loginSrv = _loginSrv_;
                this.$httpBackend = _$httpBackend_;
            });
        });

        afterEach(function() {
            this.$httpBackend.verifyNoOutstandingRequest();
        });

        it('invokes onSuccess', function() {
            var response;

            this.$httpBackend.when('POST', '/login/submit').
                respond(200, successLoginResponse);

            this.loginSrv.login({
                email: 'wrong_email',
                password: 'password'
            }, function() {
                response = 'success';
            }, function() {
                response = 'failure';
            }).then(function(data) {
                response = data;
            });

            this.$httpBackend.flush(1);

            expect(response).toEqual('success');
        });

        it('validate token', function() {
            var response;

            this.$httpBackend.when('GET', '/login/validate').
                respond(200, {
                    is_sp_admin: false,
                    redirect_url: '/staff'
                });

            this.loginSrv.checkSession(null,
                function() {
                    response = 'success';
                }, function() {
                    response = 'failure';
                }).
                then(function(data) {
                    response = data;
                });

            this.$httpBackend.flush(1);

            expect(response).
                toEqual('success');
        });

        it('validate token - expired or missing token', function() {
            var response,
                unauthorizedStatusCode = 401;

            this.$httpBackend.when('GET', '/login/validate').
                respond(unauthorizedStatusCode);

            this.loginSrv.checkSession(null,
                function() {
                    response = 'success';
                }, function() {
                    response = 'failure';
                }).
                then(function(data) {
                    response = data;
                });

            this.$httpBackend.flush(1);

            expect(response).
                toEqual('failure');
        });

        /**
         * CICO-
         */
        it('handle internal server error', function() {
            var response;

            this.$httpBackend.when('POST', '/login/submit').respond(500);

            this.loginSrv.login({
                email: 'email',
                password: 'password'
            }, function() {
                response = 'success';
            }, function() {
                response = 'failure';
            }).then(function(data) {
                response = data;
            }, function(data) {
                response = data;
            });

            this.$httpBackend.flush(1);
            expect(response).toEqual(['Internal server error occured']);
        });
    });

});
