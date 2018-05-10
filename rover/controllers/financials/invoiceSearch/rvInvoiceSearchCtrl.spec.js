describe('RVInvoiceSearchController', function () {

    jasmine.getJSONFixtures().fixturesPath = 'base/unitTestSampleData/';
    var fixtures = loadJSONFixtures('invoiceSearchSampleData.json'),
        jsonResult = fixtures['invoiceSearchSampleData.json']; 

    var $controller,
        $scope,
        $q,
        $rootScope,
        RVInvoiceSearchSrv,
        RVBillCardSrv,
        rvAccountTransactionsSrv,
        rvInvoiceSearchController,
        rvAccountsConfigurationSrv,
        results = jsonResult;    

        describe('variable initalizations', function () {

            beforeEach(function () {
                module('sntRover');

                inject(function (_$controller_, _RVInvoiceSearchSrv_, _RVBillCardSrv_, _$q_, _$rootScope_, _rvAccountTransactionsSrv_ ,_rvAccountsConfigurationSrv_) {
                    $controller = _$controller_;
                    RVInvoiceSearchSrv = _RVInvoiceSearchSrv_;
                    RVBillCardSrv = _RVBillCardSrv_;
                    $q = _$q_;
                    $rootScope = _$rootScope_;
                    rvAccountTransactionsSrv = _rvAccountTransactionsSrv_;
                    rvAccountsConfigurationSrv = _rvAccountsConfigurationSrv_;
                    $scope = _$rootScope_.$new();
                });

                rvInvoiceSearchController = $controller('RVInvoiceSearchController', {
                    $scope: $scope
                });

                angular.extend($scope, {
                    'refreshScroll': function() {
                        return true;
                    },
                    'closeDialog' : function() {
                        return true;
                    }
                });

            }); 
             // ============================================
            it('clearquery method should clear all data', function () {       

                 // var haha = suburbs;
                 // console.log(haha)

                $scope.invoiceSearchFlags = {};

                $scope.invoiceSearchData = {};

                $scope.clearQuery();

                expect($scope.invoiceSearchFlags.showFindInvoice).toBe(true);
                expect($scope.invoiceSearchFlags.isQueryEntered).toBe(false);
                expect($scope.invoiceSearchData.query).toBe('');
                expect($scope.invoiceSearchData.reservationsList).toEqual([]);
                expect($scope.totalResultCount).toBe(0);
               
            }); 
            // ============================================

            it('Search for the invoice', function () {       
                
                spyOn(RVInvoiceSearchSrv, 'searchForInvoice').and.callFake(function () {
                    var deferred = $q.defer();

                    deferred.resolve(results);
                    return deferred.promise;
                });

                $scope.invoiceSearchData = {};

                $scope.invoiceSearchData.query = 'ghl';

                $scope.results = results;

                $scope.searchInvoice(1);

                 // Promise won't be resolved till $apply runs....
                $rootScope.$apply();

                expect($scope.results.data.results[0].associated_item.number).toBe(results.data.results[0].associated_item.number);
                expect($scope.results.data.results[0].bills[2].routing_details.is_primary).toEqual(results.data.results[0].bills[2].routing_details.is_primary);
               
            }); 
            // ============================================

            it('initalization method', function () {
                
                rvInvoiceSearchController.init();

                expect($scope.invoiceSearchFlags.showFindInvoice).toEqual(true);
                expect($scope.invoiceSearchFlags.isQueryEntered).toEqual(false);                
               
            }); 
            // =================================================
            // 
            describe('clickedEmail', function() {

                const sampleData = {
                        sample_user_data: {
                            'name': 'test'
                        }
                    };
                    
                beforeEach(function() {

                    $scope.invoiceSearchFlags = {};
                    
                });

                it('clickedEmail method should call send mail method of accounts if clicked posting account call reservation mail if it is reservation', function() {
                    
                    spyOn(RVBillCardSrv, "sendEmail").and.callFake(function() {
                        var deferred = $q.defer();

                        deferred.resolve(results);
                        return deferred.promise;
                    });

                    $scope.invoiceSearchFlags.isClickedReservation = true;

                    $scope.clickedEmail();

                    expect(RVBillCardSrv.sendEmail).toHaveBeenCalled();

                });

                it('clickedEmail method should call send mail method of accounts if clicked posting account call reservation mail if it is reservation', function() {

                    spyOn(rvAccountsConfigurationSrv, "emailInvoice").and.callFake(function() {
                        var deferred = $q.defer();

                        deferred.resolve(results);
                        return deferred.promise;
                    });

                    $scope.invoiceSearchFlags.isClickedReservation = false;

                    $scope.clickedEmail(sampleData);

                    expect(rvAccountsConfigurationSrv.emailInvoice).toHaveBeenCalledWith(sampleData);

                });
            });

           

        });    
});
/*


1
2
3
4
5
6
7
8
describe("Person toString() Test", function() {
    it("calls the getName() function", function() {
        var testPerson = new Person();
        spyOn(testPerson, "getName");
        testPerson.toString();
        expect(testPerson.getName).toHaveBeenCalled();
    });
});


https://www.htmlgoodies.com/html5/javascript/spy-on-javascript-methods-using-the-jasmine-testing-framework.html

*/