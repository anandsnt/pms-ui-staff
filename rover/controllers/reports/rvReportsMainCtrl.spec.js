describe('RVReportsMainCtrl', function() {
    var $controller;        

    describe("Report generation requests", function() {
        var $scope,
            $rootScope,
            $state,
            $ngDialog;
        beforeEach( function() {
            module("sntRover");

            $inject(_$controller_, _$rootScope_, _$state_, _$ngDialog_) {
               $controller = _$controller_;
               $rootScope = _$rootScope_;
               $scope = $rootScope.$new(); 
               $state = _$state_;
               $ngDialog = _$ngDialog_;
            }

            $controller("RVReportsMainCtrl", {
                $scope: $scope,
                $state: $state
            });

        });

        it("checks whether user is shown with generated popup once the report is run", function() {
            $state.current.name = "rover.reports.dashboard";
            $rootScope.isBackgroundReportsEnabled = true;
            var response = {
                isPaginatedResponse: false;
            };

            self.sucssCallback(response);

            expect($ngDialog.open).toHaveBeenCalled();
        });

    });

})