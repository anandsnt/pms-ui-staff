describe('RVReportsMainCtrl', function() {
    var $controller,
        $scope,
        $rootScope,
        $state,
        ngDialog,
        reportsMainCtrl;        

    beforeEach( function() {
        // module("sntRover" ,function(_$stateProvider_) {
        //     _$stateProvider_.state('rover.reports.dashboard', { url: '/' }); 
        // });
        module("sntRover");
        inject(function (_$controller_, _$rootScope_, _$state_, _ngDialog_) {
           $controller = _$controller_;
           $rootScope = _$rootScope_;
           $scope = $rootScope.$new(); 
           $state = _$state_;
           ngDialog = _ngDialog_;
        });      

    });

    

    // it("checks whether user is shown with generated popup once the report is run", function() {
    //     var payload = {
    //         reportsResponse: {
    //             results: [],
    //             total_count: 0
    //         },
    //         codeSettings: {},
    //         activeUserList: []
    //     };
    //     $rootScope.businessDate = "2018-05-17";
    //     $rootScope.isBackgroundReportsEnabled = true;        
    //     var response = {
    //         isPaginatedResponse: false
    //     };

    //     $state = {
    //         transition :{
    //             params: function() {
    //                 return {};
    //             }
    //         }
    //     };
    //     console.log($state.transition);

    //     reportsMainCtrl = $controller("RVReportsMainCtrl", {
    //         $scope: $scope,
    //         $state: $state,
    //         payload: payload            
    //     });

    //     spyOn(ngDialog, 'open');
         
    //     console.log(reportsMainCtrl);
    //     //$state.current.name = "rover.reports.dashboard";
        

    //     reportsMainCtrl.sucssCallback(response);

    //     expect(ngDialog.open).toHaveBeenCalled();
    // });

})