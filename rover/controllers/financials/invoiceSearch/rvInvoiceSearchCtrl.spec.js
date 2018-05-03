 // import suburbs from '../../../unitTestSampleData/invoiceSearchSampleData.json';

describe('RVInvoiceSearchController', function () {

    var jsonResult = readJSON('unitTestSampleData/invoiceSearchSampleData.json');

    var $controller,
        $scope,
        $q,
        $rootScope,
        RVInvoiceSearchSrv,
        rvInvoiceSearchController,
        results = jsonResult;    

        describe('variable initalizations', function () {

            beforeEach(function () {
                module('sntRover');

                inject(function (_$controller_, _RVInvoiceSearchSrv_, _$q_, _$rootScope_) {
                    $controller = _$controller_;
                    RVInvoiceSearchSrv = _RVInvoiceSearchSrv_;
                    $q = _$q_;
                    $rootScope = _$rootScope_;

                    $scope = _$rootScope_.$new();
                });

                rvInvoiceSearchController = $controller('RVInvoiceSearchController', {
                    $scope: $scope
                });

                angular.extend($scope, {
                    'refreshScroll': function() {
                        return true;
                    }
                });

            }); 
             // ============================================
            it('clearquery method should clear all data', function () {       

                 // var haha = suburbs;
                 // console.log(haha)

                $scope.invoiceSearchFlags = {};

                $scope.invoiceSearchData = {}

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
        });    
});
