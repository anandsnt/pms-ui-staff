describe('ADSntAppsListCtrl', function() {

    var $controller,
        $scope = {},
        adAppVersionsSrv,
        appTypes,
        ngDialog,
        $q;

    beforeEach(function() {

        module('admin', function($provide) {
            $provide.value('appTypes', [{
                'id': 1,
                'value': 'iPad App'
            }, {
                'id': 2,
                'value': 'Rover Service Windows'
            }]);
        });

        inject(function(_$controller_, _$rootScope_, _adAppVersionsSrv_, _$q_, _appTypes_, _ngDialog_) {
            $controller = _$controller_;
            adAppVersionsSrv = _adAppVersionsSrv_;
            $q = _$q_;
            $scope = _$rootScope_.$new();
            appTypes = _appTypes_;
            ngDialog = _ngDialog_;
        });

        $controller('ADSntAppsListCtrl', {
            $scope: $scope,
            _ngDialog_: ngDialog
        });

        $scope.errorMessage = '';
    });

    var commonApiActions = function() {
        var deferred = $q.defer();

        deferred.resolve();
        return deferred.promise;
    };

    describe('Fetch Service versions', function() {

        beforeEach(function() {
            spyOn(adAppVersionsSrv, 'checkVersionStatus').and.callFake(function() {
                commonApiActions();
            });
        });

        it('If one of the verion upload status is PENDING, Call the API for checking the status.', function() {

            spyOn(adAppVersionsSrv, 'fetchAppVersions').and.callFake(function() {
                var deferred = $q.defer(),
                    response = [{
                        'id': 87,
                        'version': '1.5.0.3',
                        'upload_status': 'PENDING'
                    }];

                deferred.resolve(response);
                return deferred.promise;
            });

            $scope.continueToVersionList();
            $scope.$digest();
            expect(adAppVersionsSrv.checkVersionStatus).toHaveBeenCalled();
        });

        it('If none of the verions has a upload status PENDING, Don\'t call the API for checking the status.', function() {

            spyOn(adAppVersionsSrv, 'fetchAppVersions').and.callFake(function() {
                var deferred = $q.defer(),
                    response = [{
                        'id': 87,
                        'version': '1.5.0.3',
                        'upload_status': 'SUCCESS'
                    }];

                deferred.resolve(response);
                return deferred.promise;
            });

            $scope.continueToVersionList();
            $scope.$digest();
            expect(adAppVersionsSrv.checkVersionStatus).not.toHaveBeenCalled();
        });
    });

    it('if app type is changed, fetch the list again with new params', function() {
        spyOn(adAppVersionsSrv, 'fetchAppVersions').and.callFake(function() {
            var deferred = $q.defer();

            deferred.resolve();
            return deferred.promise;
        });
        $scope.appTypeChanged();
        $scope.$digest();
        expect(adAppVersionsSrv.fetchAppVersions).toHaveBeenCalled();
    });

    it('On clicking Delete button for a version, show the confirmation popup', function() {
        spyOn(ngDialog, 'open').and.callThrough();
        $scope.deleteVersion({
            id: 1
        });
        expect(ngDialog.open).toHaveBeenCalled();
    });

    describe('Build Upload', function() {

        beforeEach(function() {
            spyOn(adAppVersionsSrv, 'uploadBuild').and.callFake(function() {
                commonApiActions();
            });

            $scope.selectedApp = {
                'build': 'data:application/x-msdownload;base64,TVqQAAMAAAAEAAAA//8A',
                'service_application_type_id': 2,
                'version': '1.5.0.3'
            };

            spyOn(adAppVersionsSrv, 'checkIfVersionIsValid').and.callFake(function() {
                var deferred = $q.defer();
                deferred.resolve({
                    "status": "success"
                });
                return deferred.promise;
            });
        });

        it('if the version is valid, proceed with Build Upload', function() {
            $scope.selectedApp.sftp_path = 'setup-v1.5.0.3-installer.exe';
            $scope.checkIfVersionIsValid();
            $scope.$digest();
            expect(adAppVersionsSrv.uploadBuild).toHaveBeenCalled();
        });

        it('if the build is empty, Don\'t proceed with Build Upload', function() {
            $scope.fileName = 'setup-v1.5.0.3-installer.exe';
            $scope.selectedApp.build = '';
            $scope.checkIfVersionIsValid();
            $scope.$digest();
            expect(adAppVersionsSrv.uploadBuild).not.toHaveBeenCalled();
        });

        it('if the app type is not correct, Don\'t proceed with Build Upload', function() {
            $scope.fileName = 'setup-v1.5.0.3-installer.pkg';
            $scope.checkIfVersionIsValid();
            $scope.$digest();
            expect(adAppVersionsSrv.uploadBuild).not.toHaveBeenCalled();
        });

    });
});
