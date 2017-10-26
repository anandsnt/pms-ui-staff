admin.controller('ADHKSectionListCtrl', [
    '$scope',
    'ngTableParams',
    '$filter',
    '$state',
    'ADHKSectionSrv',
    function ($scope, ngTableParams, $filter, $state, ADHKSectionSrv) {

        BaseCtrl.call(this, $scope);

        /**
        * initialize table in view
        */
        $scope.setUptable = function() {
            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: $scope.data.length,    // count per page - Need to change when on pagination implemntation
                sorting: { number: 'asc'     // initial sorting
                }
            }, {
                total: $scope.data.length,
                counts: [], // hides page sizes
                getData: function($defer, params) {
                    // use build-in angular filter
                    var orderedData = params.sorting() ?
                                        $filter('orderBy')($scope.data, params.orderBy()) :
                                        $scope.data;

                    $scope.orderedData =  $scope.data;

                    $defer.resolve(orderedData);
                    $scope.showTableDetails = true;
                }
            });
        };

        // List all hk sections
        $scope.listHKSections = function () {
            var onHKSectionFetchSuccess = function(data) {
                $scope.data = data;
                $scope.setUptable ();
            };

            var options = {
                successCallBack: onHKSectionFetchSuccess
            };
            $scope.callAPI(ADHKSectionSrv.fetchHotelSectionList, options);
        };

        // // Navigate to create section screen
        $scope.gotoAddSection = function() {
            $state.go ('admin.addHKSection');
        };

        // Navigate to edit section screen
        $scope.gotoEditSection = function(sectionId) {
            $state.go ('admin.editHKSection', {sectionId: sectionId});
        };

        /*
        * To delete a hk section
        */
        $scope.deleteHKSection = function(sectionId) {
            var params = {};

            params.id = sectionId;
            var onSectionDeleteSuccess = function() {
                var pos = _.findIndex($scope.data, function (item) {
                    return item.id == sectionId;
                });
                $scope.data.splice(pos, 1);
                $scope.tableParams.page(1);
                $scope.tableParams.reload();
            };

            var options = {
                params: params,
                successCallBack: onSectionDeleteSuccess
            };
            $scope.callAPI(ADHKSectionSrv.deleteHKSection, options);
        };

        var init = function () {
            $scope.errorMessage = '';
            $scope.showTableDetails = false;
            $scope.sections  = [];
            $scope.listHKSections();
            $scope.stateVariables = {
                activeTab: "MANAGE" // MANAGE/ASSIGN
            };
        };

         $scope.toggleAssignSection = function() {
            $scope.stateVariables.activeTab = $scope.stateVariables.activeTab === 'MANAGE' ?  'ASSIGN' : 'MANAGE';
         };

        init();


}]);
