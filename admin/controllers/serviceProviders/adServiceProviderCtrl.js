admin.controller('ADServiceProviderListCtrl',['$scope','$rootScope', '$state','$stateParams', 'ADServiceProviderSrv','ngTableParams', '$filter',  function($scope, $state,$rootScope, $stateParams, ADServiceProviderSrv, ngTableParams, $filter){
    BaseCtrl.call(this, $scope);
    $scope.$emit("changedSelectedMenu", 0);
    var selectedHotel;




    /**
    *   A post method to update ReservationImport for a hotel
    *   @param {String} index value for the hotel list item.
    */

    $scope.toggleClicked = function(hotel){
        var confirmForReservationImport = true;
        // show confirm if it is going turn on stage
        if(hotel.is_res_import_on === 'false'){
            confirmForReservationImport = confirm("Do NOT switch ON, until hotel mapping and setup is completed!, Do you want to proceed?");
        }
        // If pressed OK button proceed toggle action ON.
        // Toggle OFF action perform without confirm box.
        if(confirmForReservationImport){
            var isResImportOn = hotel.is_res_import_on === 'true' ? false : true;
            var data = {'hotel_id' :  hotel.id,  'is_res_import_on': isResImportOn };
            selectedHotel = hotel;
            var postSuccess = function(){
                selectedHotel.is_res_import_on = (selectedHotel.is_res_import_on === 'true') ? 'false' : 'true';
                $scope.$emit('hideLoader');
            };
            $scope.invokeApi(ADHotelListSrv.postReservationImportToggle, data, postSuccess);
        }
    };

    var fetchServiceProviderList = function() {
        var onFetchSuccess = function(data){
            $scope.data = data;
            $scope.$emit('hideLoader');

            // REMEMBER - ADDED A hidden class in ng-table angular module js. Search for hidde or pull-right
            $scope.tableParams = new ngTableParams({
                // show first page
                page: 1,
                // count per page - Need to change when on pagination implemntation
                count: $scope.data.service.length,
                sorting: {
                    // initial sorting
                    name: 'asc'
                }
            }, {
                // length of data
                total: $scope.data.hotels.length,
                getData: function($defer, params) {
                    // use build-in angular filter
                    var orderedData = params.sorting() ?
                                        $filter('orderBy')($scope.data.hotels, params.orderBy()) :
                                        $scope.data.hotels;
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
        };
        $scope.invokeApi(ADServiceProviderSrv.fetchServiceProviderList, {}, onFetchSuccess);

    };

    var init = function() {
        fetchServiceProviderList();
    };

    init();


}]);