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
                };

                const refreshScroller = function() {
                    $timeout(function () {
                        $scope.refreshScroller('searchSetOnDetailsScroll');
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

                const updateSetOnIdList = () => {
                    $scope.restrictionObj.selectedRoomTypeIds = _.pluck($scope.searchObj.selectedList, 'id');
                };

                /*
                 *  Handle list item click
                 *  @param {String} ['closed', 'close_arrival' etc.]
                 *  @param {Number | null} [ index of clicked item in 'min_length_of_stay', 'max_length_of_stay' etc.]
                 */
                $scope.clickedOnResult = function( clickedItem ) {
                    $scope.searchObj.selectedList.push(clickedItem);
                    $scope.searchObj.query = '';
                    $scope.searchObj.results = $scope.searchObj.results.filter((item) => item.id !== clickedItem.id);
                    updateSetOnIdList();
                    $scope.$emit('REFRESH_FORM_SCROLL');
                };

                /*
                 *  Handle delete button click on each item on LIST screen.
                 *  @param {String} ['closed', 'close_arrival' etc.]
                 *  @param {Boolean | null} [value will be false or null]
                 *  @param {Array | undefined} [set on list values]
                 */
                $scope.clickedOnRemoveItem = function(index) {
                    $scope.searchObj.results.push($scope.searchObj.selectedList[index]);
                    $scope.searchObj.selectedList.splice(index, 1);
                    updateSetOnIdList();
                    $scope.$emit('REFRESH_FORM_SCROLL');
                };

                $scope.clickedOnAllCheckBox = function() {
                    $scope.searchObj.isApplyOnAll = !$scope.searchObj.isApplyOnAll;
                    if ($scope.searchObj.isApplyOnAll) {
                        $scope.restrictionObj.selectedRoomTypeIds = [];
                        $scope.searchObj.selectedList = [];
                        $scope.$emit('REFRESH_FORM_SCROLL');
                    }
                };

                $scope.queryEntered = () => {
                    $scope.$emit('REFRESH_FORM_SCROLL');
                    refreshScroller();
                };
                
                fetchSetOnData();
            }
    ]);
