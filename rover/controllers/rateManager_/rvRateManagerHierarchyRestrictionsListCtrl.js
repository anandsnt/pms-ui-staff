angular.module('sntRover')
    .controller('rvRateManagerHierarchyRestrictionsListCtrl', [
        '$scope',
        'rvRateManagerHierarchyRestrictionsSrv',
        '$timeout',
        function(
            $scope,
            hierarchySrv,
            $timeout) {
                BaseCtrl.call(this, $scope);

                var setscroller = () => {
                    $scope.setScroller('hierarchyPopupListScroll');
                };

                var refreshScroller = function() {
                    $scope.refreshScroller('hierarchyPopupListScroll');
                };

                $scope.clickedOnRemove = function( key, value ) {
                    console.log(key);
                    console.log(value);
                };

                setscroller();
                refreshScroller();
            }
    ]);
