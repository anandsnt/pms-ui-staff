angular.module('sntRover')
    .controller('rvRateManagerHierarchyRestrictionSearchSetOnDetailsCtrl', [
        '$scope',
        'rvRateManagerHierarchyRestrictionsSrv',
        '$timeout',
        function(
            $scope,
            hierarchySrv,
            $timeout) {
                BaseCtrl.call(this, $scope);

                const setscroller = () => {
                    $scope.setScroller('searchSetOnDetailsScroll');
                    $scope.setScroller('searchSetOnResultsScroll');
                };

                const refreshScroller = function() {
                    $timeout(function () {
                        $scope.refreshScroller('searchSetOnDetailsScroll');
                        $scope.refreshScroller('searchSetOnResultsScroll');
                    }, 500);
                };

                $scope.searchObj = {
                    query: '',
                    results: [],
                    selectedList: [],
                    isApplyOnAll: false,
                    headerLabel: '',
                    noticeLabel: '',
                    placeholder: ''
                };

                let apiMethod = '';

                switch ($scope.ngDialogData.hierarchyLevel) {
                    case 'RoomType':
                        $scope.searchObj.headerLabel = 'Set on Room Type(s)';
                        $scope.searchObj.noticeLabel = 'Applies to All Room Types!';
                        $scope.searchObj.placeholder = 'Search by Room Name or Code';
                        apiMethod = hierarchySrv.searchRoomTypes;
                        break;

                    default:
                    break;
                }

                const fetchSetOnData = () => {
                    const fetchSetOnSuccessCallback = ( response ) => {
                        $scope.errorMessage = '';
                        $scope.searchObj.results = response.results;
                        refreshScroller();
                    };
                    const fetchSetOnFailureCallback = (errorMessage) => {
                        $scope.errorMessage = errorMessage;
                    };

                    let params = {
                        'exclude_pseudo': true
                    };
                    let options = {
                        params: params,
                        onSuccess: fetchSetOnSuccessCallback,
                        failureCallBack: fetchSetOnFailureCallback
                    };

                    $scope.callAPI(apiMethod, options);
                };

                /*
                 *  Handle list item click
                 *  @param {String} ['closed', 'close_arrival' etc.]
                 *  @param {Number | null} [ index of clicked item in 'min_length_of_stay', 'max_length_of_stay' etc.]
                 */
                $scope.clickedOnResult = function(index) {
                    let item = $scope.searchObj.results[index];

                    console.log($scope.searchObj.results[index]);
                    $scope.searchObj.selectedList.push($scope.searchObj.results[index]);
                    $scope.searchObj.results.splice(index, 1);

                    $scope.restrictionObj.selectedRoomTypeIds = _.pluck($scope.searchObj.selectedList, 'id');
                };

                /*
                 *  Handle delete button click on each item on LIST screen.
                 *  @param {String} ['closed', 'close_arrival' etc.]
                 *  @param {Boolean | null} [value will be false or null]
                 *  @param {Array | undefined} [set on list values]
                 */
                $scope.clickedOnRemoveItem = function(index) {
                    console.log($scope.searchObj.selectedList[index]);
                    $scope.searchObj.results.push($scope.searchObj.selectedList[index]);
                    $scope.searchObj.selectedList.splice(index, 1);

                    $scope.restrictionObj.selectedRoomTypeIds = _.pluck($scope.searchObj.selectedList, 'id');
                };

                $scope.clickedOnAllCheckBox = function() {
                    $scope.searchObj.isApplyOnAll = !$scope.searchObj.isApplyOnAll;
                };

                setscroller();
                fetchSetOnData();

            }
    ]);
