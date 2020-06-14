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
                let initialSetOnListData = [];

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
                        initialSetOnListData = angular.copy(response.results);
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
                        headerLabel: '',
                        noticeLabel: '',
                        placeholder: ''
                    };

                    switch ($scope.ngDialogData.hierarchyLevel) {
                        case 'RoomType':
                            $scope.searchObj.headerLabel = 'Set on Room Type(s)';
                            $scope.searchObj.noticeLabel = 'Applies to All Room Types!';
                            $scope.searchObj.placeholder = 'Search by Room Name or Code';
                            apiMethod = hierarchySrv.fetchAllRoomTypes;
                            break;

                        default:
                        break;
                    }

                    fetchSetOnData();
                    setscroller();
                    refreshScroller();
                };

                const updateSetOnIdList = () => {
                    $scope.restrictionObj.selectedSetOnIds = _.pluck($scope.searchObj.selectedList, 'id');
                };

                /*
                 *  Handle list item click
                 *  @param {Object} [clicked item data]
                 */
                $scope.clickedOnResult = function( clickedItem ) {
                    $scope.searchObj.selectedList.push(clickedItem);
                    $scope.searchObj.query = '';
                    initialSetOnListData = initialSetOnListData.filter((item) => item.id !== clickedItem.id);
                    updateSetOnIdList();
                    $scope.$emit('REFRESH_FORM_SCROLL');
                };

                /*
                 *  Handle Remove action.
                 *  @param {Number} [index value]
                 */
                $scope.clickedOnRemoveItem = function(index) {
                    initialSetOnListData.push($scope.searchObj.selectedList[index]);
                    $scope.searchObj.selectedList.splice(index, 1);
                    updateSetOnIdList();
                    $scope.$emit('REFRESH_FORM_SCROLL');
                };
                // Handle ON ALL checkbox toggle.
                $scope.clickedOnAllCheckBox = function() {
                    $scope.restrictionObj.isSetOnAllActive = !$scope.restrictionObj.isSetOnAllActive;
                    if ($scope.restrictionObj.isSetOnAllActive) {
                        $scope.restrictionObj.selectedSetOnIds = [];
                        $scope.searchObj.selectedList = [];
                        $scope.$emit('REFRESH_FORM_SCROLL');
                    }
                };
                // Handle query entered on change event.
                $scope.queryEntered = () => {
                    $scope.$emit('REFRESH_FORM_SCROLL');
                    refreshScroller();
                    var displayResults = [];

                    if ($scope.searchObj.query && $scope.searchObj.query.length > 0) {
                        displayResults = initialSetOnListData.filter(function(item) {
                            // check if the querystring is number or string
                            var result = 
                                (
                                    isNaN($scope.searchObj.query) &&
                                    item.name.toUpperCase().includes($scope.searchObj.query.toUpperCase())
                                ) ||
                                (
                                    isNaN($scope.searchObj.query) &&
                                    item.code.toUpperCase().includes($scope.searchObj.query.toUpperCase())
                                );

                            return result;
                        });
                        
                        $scope.searchObj.results = displayResults;
                    }
                };
                
                init();

                $scope.addListener('INIT_SET_ON_SEARCH', init);
            }
    ]);
