angular.module('sntRover')
    .controller('rvRoomAvailabilityGridStatusController', [
        '$scope',
        'rvAvailabilitySrv',
        '$rootScope',
        '$q',
        function ($scope, rvAvailabilitySrv, $rootScope, $q) {

            /*
            * Function to set all toggle to close
            */
            var initToggleStatus = function () {
                $scope.toggleStatusOf = {};
                $scope.toggleStatusOf['availableRooms'] = false;
                $scope.toggleStatusOf['roomsSold'] = false;
                $scope.toggleStatusOf['occupancy'] = false;
                $scope.toggleStatusOf['roomInventory'] = false;
            };

            var init = function () {
                // we need horizonat scroller so adding option 'scrollX', also need to get the click event on toggling button on available room
                var scrollerOptions = {
                    scrollX: true,
                    preventDefault: false
                };
                $scope.setScroller('room_availability_scroller', scrollerOptions);

                $scope.hideMeBeforeFetching = false;
                initToggleStatus();
                $scope.data = rvAvailabilitySrv.getGridData();

                // if already fetched we will show without calling the API
                if ( !isEmptyObject($scope.data) ) {
                    $scope.refreshScroller('room_availability_scroller');
                    $scope.hideMeBeforeFetching = true;
                    $scope.$emit('hideLoader');
                }
            };

            BaseCtrl.call(this, $scope);

            
            

            // -------------------------------------------------------------------------------------------------------------- GRID DETAILED VIEW
            /**
             * NOTE: The below three methods handle the Expanded view of the Availability Grid
             * To start with A. Occupancy B. Available Rooms C. Rooms Sold are collapsed
             * The data required to show these sections are catered through different APIs.
             */

            var isSectionOpen = function(name) {
                return $scope.toggleStatusOf.hasOwnProperty(name) && !! $scope.toggleStatusOf[name];
            }

            var toggleSection = function(key, value) {
                if ( $scope.toggleStatusOf.hasOwnProperty(key) ) {
                    if ( typeof value === typeof true ) {
                        $scope.toggleStatusOf[key] = value
                    } else {
                        $scope.toggleStatusOf[key] = ! $scope.toggleStatusOf[key];
                    }
                }
            }

            var hasAdditionalData = function () {
                return !! $scope.data.additionalData;
            };

            var hasBestAvailabilityRate = function () {
                return hasAdditionalData() && !! $scope.data.additionalData.bestAvailabilityRate;
            };

            var hasRoomTypeWiseDetails = function () {
                return hasAdditionalData() && !! $scope.data.additionalData.roomTypeWiseDetails;
            };

            var hasSoldRooms = function () {
                return hasAdditionalData() && (!! $scope.data.additionalData.roomTypeWiseDetails || !! $scope.data.additionalData.adultsChildrenCounts);
            };

            /** 
             * This is a higher order function that will generate funtion for the purpose
             * 
             * @param {string} section - name of the section to be toggled
             * @param {function} APIMethod - the deep method from the service
             * @param {function} toggleOnly - a funtion that return if we have data and the section only needs to be toggled
             * @returns {function} - the actual repeated functionality as function
             */
            var toggleSectionGenerator = function (section, APIMethod, toggleOnly) {

                /** 
                 * The generated function that:
                 * either toggle to show the section, when data is present
                 * fetch data first and then toggle the section
                 *  
                 * @return {object} - a promise object
                 */
                return function () {
                    var SCROLL = 'room_availability_scroller',
                        deferred = $q.defer();

                    if ( toggleOnly() ) {
                        toggleSection( section );
                        $scope.refreshScroller( SCROLL );
                        deferred.resolve( true );
                    } else {
                        $scope.callAPI(APIMethod, {
                            params: $scope.getDateParams(),
                            successCallBack: function () {
                                handleDataChange();
                                toggleSection( section, true );
                                deferred.resolve( true );
                            }
                        });
                    };

                    return deferred.promise;
                }
            }

            /** */
            $scope.toggleOccupancy = toggleSectionGenerator(
                    'occupancy',
                    rvAvailabilitySrv.fetchBARs,
                    function(){
                        return isSectionOpen('occupancy') && hasBestAvailabilityRate()
                    }
                );

            $scope.toggleAvailableRooms = toggleSectionGenerator(
                    'availableRooms',
                    rvAvailabilitySrv.getRoomsAvailability,
                    function(){
                        return isSectionOpen('availableRooms') && hasRoomTypeWiseDetails()
                    }
                );

            $scope.toggleSoldRooms = toggleSectionGenerator(
                    'roomsSold',
                    rvAvailabilitySrv.getOccupancyCount,
                    function(){
                        return isSectionOpen('roomsSold') && hasSoldRooms()
                    }
                );

            $scope.toggleRoomInventory = function () {
                toggleSection( 'roomInventory' );
                $scope.refreshScroller('room_availability_scroller');
            };

            $scope.toggleShowGroupAllotmentTotals = function () {
                if ($scope.showShowGroupAllotmentTotals) {
                    $scope.showShowGroupAllotmentTotals = false;
                    $scope.refreshScroller('room_availability_scroller');
                } else {
                    $scope.$parent.fetchGrpNAllotData();
                }
            };
        // --------------------------------------------------------------------------------------------------------------

            $scope.$on('$includeContentLoaded', function (event) {
                $scope.$emit("hideLoader");
                $scope.refreshScroller('room_availability_scroller');
            });
        /*
        *  Checks whether additional data available or not
        */
            var isFullDataAvaillable = function () {
                return $scope.data.hasOwnProperty('additionalData');
            };


            var handleDataChange = function () {
                $scope.data = rvAvailabilitySrv.getGridData();
                if (!isFullDataAvaillable()) {
                    initToggleStatus();
                }
                $scope.refreshScroller('room_availability_scroller');
                $scope.hideMeBeforeFetching = true;
                $scope.$emit("hideLoader");
            };
        /**
        * when data changed from super controller, it will broadcast an event 'changedRoomAvailableData'
        */
            $scope.$on("changedRoomAvailableData", handleDataChange);

            $scope.$on('changedGrpNAllotData', function () {
                $scope.data.gridDataForGroupAvailability = rvAvailabilitySrv.getGridDataForGroupAvailability();
                $scope.data.gridDataForAllotmentAvailability = rvAvailabilitySrv.getGridDataForAllotmentAvailability();

                $scope.showShowGroupAllotmentTotals = true;

                $scope.refreshScroller('room_availability_scroller');
                $scope.$emit('hideLoader');
            });

        /*
        * function to toggle the display of individual group/allotmet on clicking
        * the toogle button
        */
            

        /*
        * param - Holdstatus id
        * return Hold status name
        */
            $scope.getGroupAllotmentName = function (source, id) {
                var found = _.findWhere(source.holdStatus, { id: id });
                return found && found.name;
            };


        /**
         * For iScroll, we need width of the table
         * @return {Integer}
         */
            $scope.getWidthForTable = function () {

                var leftMostRowCaptionWidth = 130, // 120px cell width + 10px cell spacing
                totalColumns = $scope.data && $scope.data.dates && $scope.data.dates.length,
                individualColWidth = 60; // 55px cell width + 5px cell spacing

                if (!_.has($scope.data, 'dates') && totalColumns < 30) {
                return 0;
            };

                if (totalColumns == 30) {
                return (totalColumns * individualColWidth + leftMostRowCaptionWidth);
            }
            };

            $scope.getClassForHoldStatusRow = function (source, id) {
                var group,
                isDeduct,
                retCls;

                if (!$scope.showShowGroupAllotmentTotals || !source) {
                retCls = 'hidden';
            } else {
                group = _.findWhere(source.holdStatus, { id: id });
                isDeduct = group && group['is_take_from_inventory'];

                if (group && isDeduct) {
                retCls = '';
            } else {
                retCls = 'hidden';
            };
            };

                return retCls;
            };

            init();

        }
    ]);
