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
                let apiMethod = '';

                const setscroller = () => {
                    $scope.setScroller('searchSetOnDetailsScroll');
                };

                const refreshScroller = function() {
                    $timeout(function () {
                        $scope.refreshScroller('searchSetOnDetailsScroll');
                    }, 500);
                };

                // Fetch comeplete list for set on filter/search.
                const fetchSetOnData = () => {
                    const fetchSetOnSuccessCallback = ( response ) => {
                        $scope.errorMessage = '';
                        $scope.searchObj.results = response.results;
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

                const init = () => {
                    $scope.searchObj = {
                        query: '',
                        results: [],
                        selectedList: [],
                        isApplyOnAll: false,
                        headerLabel: '',
                        noticeLabel: '',
                        placeholder: ''
                    };

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

                    fetchSetOnData();
                    setscroller();
                    refreshScroller();
                };

                const updateSetOnIdList = () => {
                    $scope.restrictionObj.selectedRoomTypeIds = _.pluck($scope.searchObj.selectedList, 'id');
                };

                /*
                 *  Handle list item click
                 *  @param {Object} [clicked item data]
                 */
                $scope.clickedOnResult = function( clickedItem ) {
                    $scope.searchObj.selectedList.push(clickedItem);
                    $scope.searchObj.query = '';
                    $scope.searchObj.results = $scope.searchObj.results.filter((item) => item.id !== clickedItem.id);
                    updateSetOnIdList();
                    $scope.$emit('REFRESH_FORM_SCROLL');
                };

                /*
                 *  Handle Remove action.
                 *  @param {Number} [index value]
                 */
                $scope.clickedOnRemoveItem = function(index) {
                    $scope.searchObj.results.push($scope.searchObj.selectedList[index]);
                    $scope.searchObj.selectedList.splice(index, 1);
                    updateSetOnIdList();
                    $scope.$emit('REFRESH_FORM_SCROLL');
                };
                // Handle ON ALL checkbox toggle.
                $scope.clickedOnAllCheckBox = function() {
                    $scope.searchObj.isApplyOnAll = !$scope.searchObj.isApplyOnAll;
                    if ($scope.searchObj.isApplyOnAll) {
                        $scope.restrictionObj.selectedRoomTypeIds = [];
                        $scope.searchObj.selectedList = [];
                        $scope.$emit('REFRESH_FORM_SCROLL');
                    }
                };
                // Handle query entered on change event.
                $scope.queryEntered = () => {
                    $scope.$emit('REFRESH_FORM_SCROLL');
                    refreshScroller();
                };
                
                init();

                $scope.addListener('INIT_SET_ON_SEARCH', init);
            }
    ]);
