sntRover.controller('rvGroupConfigurationCtrl', [
    '$scope',
    '$rootScope',
    'rvGroupSrv',
    '$filter',
    '$stateParams',
    'rvGroupConfigurationSrv',
    'summaryData',
    'holdStatusList',
    '$state',
    'rvPermissionSrv',
    '$timeout',
    'rvAccountTransactionsSrv',
    function($scope, $rootScope, rvGroupSrv, $filter, $stateParams, rvGroupConfigurationSrv, summaryData, holdStatusList, $state, rvPermissionSrv, $timeout, rvAccountTransactionsSrv) {

        BaseCtrl.call(this, $scope);

        /**
         * to run angular digest loop,
         * will check if it is not running
         * return - None
         */
        var runDigestCycle = function() {
            if (!$scope.$$phase) {
                $scope.$digest();
            }
        };

        /**
         * whether current screen is in Add Mode
         * @return {Boolean}
         */
        $scope.isInAddMode = function() {
            return ($stateParams.id === "NEW_GROUP");
        };

        /**
         * Check if selecting Addons
         * @return {Boolean}
         */
        $scope.isInAddonSelectionMode = function() {
            return $scope.groupConfigData.selectAddons;
        }

        /**
         * function to set title and things
         * @return - None
         */
        var setTitle = function() {
            var title = $filter('translate')('GROUP_DETAILS');

            // we are changing the title if we are in Add Mode
            if ($scope.isInAddMode()) {
                title = $filter('translate')('NEW_GROUP');
            }

            //yes, we are setting the headting and title
            $scope.setHeadingTitle(title);
        };



        /**
         * Function to check the mandatory values while saving the reservation
         * Handling in client side owing to alleged issues on import if handled in the server side
         * @return boolean [true if all the mandatory values are present]
         */
        var ifMandatoryValuesEntered = function() {
            var summary = $scope.groupConfigData.summary;
            return !!summary.group_name && !!summary.hold_status && !!summary.block_from && !!summary.block_to && !!summary.release_date;
        }

        /**
         * shouldShowRoomingListTab whether to show rooming list tab
         * @return {Boolean} [description]
         */
        $scope.shouldShowRoomingListTab = function() {
            //we will not show it in add mode
            return (!$scope.isInAddMode());
        };

        /**
         * function to form data model for add/edit mode
         * @return - None
         */
        $scope.initializeDataModelForSummaryScreen = function() {
            $scope.groupConfigData = {
                activeTab: $stateParams.activeTab, // Possible values are SUMMARY, ROOM_BLOCK, ROOMING, ACCOUNT, TRANSACTIONS, ACTIVITY
                summary: summaryData.groupSummary,
                holdStatusList: holdStatusList.data.hold_status,
                selectAddons: false, // To be set to true while showing addons full view
                addons: {},
                selectedAddons: []
            };
            $timeout(function() {
                $scope.groupSummaryMemento = angular.copy($scope.groupConfigData.summary);
            }, 500);


            $scope.accountConfigData = {
                summary: summaryData.accountSummary
            }
            if (!$scope.groupConfigData.summary.release_date) {
                $scope.groupConfigData.summary.release_date = $scope.groupConfigData.summary.block_from;
            }

            if (!$scope.isInAddMode()) {
                $scope.groupConfigData.summary.block_from = new tzIndependentDate($scope.groupConfigData.summary.block_from);
                $scope.groupConfigData.summary.block_to = new tzIndependentDate($scope.groupConfigData.summary.block_to);
            }

        };

        /**
         * function to check whether the user has permission
         * to make view the transactions tab
         * @return {Boolean}
         */
        $scope.hasPermissionToViewTransactionsTab = function() {
            return rvPermissionSrv.getPermissionValue('ACCESS_GROUP_ACCOUNT_TRANSACTIONS');
        };

        /**
         * TAB - to swicth tab
         * @return - None
         */
        $scope.switchTabTo = function(tab) {

            //if there was any error message there, we are clearing
            $scope.errorMessage = '';

            //allow to swith to "transactions" tab only if the user has its permission
            if (tab == "TRANSACTIONS" && !$scope.hasPermissionToViewTransactionsTab()) {
                $scope.errorMessage = ["Sorry, you don't have the permission to access the transactions"];
                return;
            }

            var isInSummaryTab = $scope.groupConfigData.activeTab == "SUMMARY";

            // we will restrict tab swithing if we are in add mode
            var tryingFromSummaryToOther = isInSummaryTab && tab !== 'SUMMARY';
            if ($scope.isInAddMode() && tryingFromSummaryToOther) {
                $scope.errorMessage = ['Sorry, Please save the entered information and try to switch the tab'];
                return;
            }

            $scope.groupConfigData.activeTab = tab;

            //propogating an event that next clients are
            $timeout(function() {
                $scope.$broadcast('GROUP_TAB_SWITCHED', $scope.groupConfigData.activeTab);
            }, 100);

        };

        var preLoadTransactionsData = function() {
            var onTransactionFetchSuccess = function(data) {

                $scope.$emit('hideloader');
                $scope.transactionsDetails = data;
                $scope.groupConfigData.activeTab = 'TRANSACTIONS';

                /*
                 * Adding billValue and oldBillValue with data. Adding with each bills fees details
                 * To handle move to bill action
                 * Added same value to two different key because angular is two way binding
                 * Check in HTML moveToBillAction
                 */
                angular.forEach($scope.transactionsDetails.bills, function(value, key) {
                    angular.forEach(value.total_fees.fees_details, function(feesValue, feesKey) {

                        feesValue.billValue = value.bill_number; //Bill value append with bill details
                        feesValue.oldBillValue = value.bill_number; // oldBillValue used to identify the old billnumber
                    });
                });

            }
            var params = {
                "account_id": $scope.accountConfigData.summary.posting_account_id
            }
            $scope.callAPI(rvAccountTransactionsSrv.fetchTransactionDetails, {
                successCallBack: onTransactionFetchSuccess,
                params: params
            });

        };

         $scope.reloadPage = function() {
            $state.go('rover.groups.config', {
                id: $scope.groupConfigData.summary.group_id
            }, {
                reload: true
            });
        }

        /**
         * Handle closing of addons screen
         * @return undefined
         */
        $scope.closeGroupAddonsScreen = function() {
            $scope.groupConfigData.selectAddons = false;
            $scope.reloadPage();
        }

        /**
         * Handle opening the addons Management screen
         * @return undefined
         */
        $scope.openGroupAddonsScreen = function() {
            $scope.groupConfigData.selectAddons = true;
        }

        /**
         * to get the current tab url
         * @return {String}
         */
        $scope.getCurrentTabUrl = function() {
            var tabAndUrls = {
                'SUMMARY': '/assets/partials/groups/summary/rvGroupConfigurationSummaryTab.html',
                'ROOM_BLOCK': '/assets/partials/groups/roomBlock/rvGroupConfigurationRoomBlockTab.html',
                'ROOMING': '/assets/partials/groups/rooming/rvGroupRoomingListTab.html',
                'ACCOUNT': '/assets/partials/accounts/accountsTab/rvAccountsSummary.html',
                'TRANSACTIONS': '/assets/partials/accounts/transactions/rvAccountTransactions.html',
                'ACTIVITY': '/assets/partials/groups/activity/rvGroupConfigurationActivityTab.html'
            };

            return tabAndUrls[$scope.groupConfigData.activeTab];
        };

        /**
         * Save the new Group
         * @return undefined
         */
        $scope.saveNewGroup = function() {
            $scope.errorMessage = "";
            if (rvPermissionSrv.getPermissionValue('CREATE_GROUP_SUMMARY')) {
                if (ifMandatoryValuesEntered()) {
                    var onGroupSaveSuccess = function(data) {
                            $scope.groupConfigData.summary.group_id = data.group_id;
                            $state.go('rover.groups.config', {
                                id: data.group_id
                            })
                            $stateParams.id = data.group_id;
                        },
                        onGroupSaveFailure = function(errorMessage) {
                            $scope.errorMessage = errorMessage;
                        };

                    $scope.callAPI(rvGroupConfigurationSrv.saveGroupSummary, {
                        successCallBack: onGroupSaveSuccess,
                        failureCallBack: onGroupSaveFailure,
                        params: {
                            summary: $scope.groupConfigData.summary
                        }
                    });
                } else {
                    $scope.errorMessage = ["Group's name, from date, to date, room release date and hold status are mandatory"];
                }
            } else {
                $scope.$emit("showErrorMessage", ["Sorry, you don\'t have enough permission to save the details"])
            }

        }


        /**
         * Update the group data
         * @return boolean
         */
        $scope.updateGroupSummary = function() {

            if (rvPermissionSrv.getPermissionValue('EDIT_GROUP_SUMMARY')) {
                if (angular.equals($scope.groupSummaryMemento, $scope.groupConfigData.summary)) {
                    return false;
                }
                var onGroupUpdateSuccess = function(data) {
                        //client controllers should get an infromation whether updation was success
                        $scope.$broadcast("UPDATED_GROUP_INFO", angular.copy($scope.groupConfigData.summary));
                        $scope.groupSummaryMemento = angular.copy($scope.groupConfigData.summary);
                        return true;
                    },
                    onGroupUpdateFailure = function(errorMessage) {
                        //client controllers should get an infromation whether updation was a failure
                        $scope.$broadcast("FAILED_TO_UPDATE_GROUP_INFO", errorMessage);
                        $scope.errorMessage = errorMessage;
                        return false;
                    };

                var summaryData = _.extend({}, $scope.groupConfigData.summary);
                summaryData.block_from = $filter('date')(summaryData.block_from, $rootScope.dateFormatForAPI);
                summaryData.block_to = $filter('date')(summaryData.block_to, $rootScope.dateFormatForAPI);
                summaryData.release_date = $filter('date')(summaryData.release_date, $rootScope.dateFormatForAPI);
                $scope.callAPI(rvGroupConfigurationSrv.updateGroupSummary, {
                    successCallBack: onGroupUpdateSuccess,
                    failureCallBack: onGroupUpdateFailure,
                    params: {
                        summary: summaryData
                    }
                });
            } else {
                $scope.$emit("showErrorMessage", ["Sorry, the changes will not get saved as you don\'t have enough permission to update the details"])
            }
        }

        /**
         * Code to duplicate group
         * Future functionality
         * @return undefined
         */
        $scope.duplicateGroup = function() {
            //TODO: Duplicate Group - Future functionality
        }

        /**
         * Discard the new Group
         * @return undefined
         */
        $scope.discardNewGroup = function() {
            $scope.groupConfigData.summary = angular.copy(rvGroupConfigurationSrv.baseConfigurationSummary);
        }

        $scope.onCompanyCardChange = function() {
            if ($scope.groupConfigData.summary.company && $scope.groupConfigData.summary.company.name === "") {
                $scope.groupConfigData.summary.company = null
            }
        }

        $scope.onTravelAgentCardChange = function() {
            if ($scope.groupConfigData.summary.travel_agent && $scope.groupConfigData.summary.travel_agent.name === "") {
                $scope.groupConfigData.summary.travel_agent = null
            }
        }

        /**
         * Autocompletions for company/travel agent
         * @return {None}
         */
        var initializeAutoCompletions = function() {
            //this will be common for both company card & travel agent
            var cardsAutoCompleteCommon = {

                focus: function(event, ui) {
                    return false;
                }
            }

            //merging auto complete setting for company card with common auto cmplt options
            $scope.companyAutoCompleteOptions = angular.extend({
                source: function(request, response) {
                    rvGroupConfigurationSrv.searchCompanyCards(request.term)
                        .then(function(data) {
                            var list = [];
                            var entry = {}
                            $.map(data, function(each) {
                                entry = {
                                    label: each.account_name,
                                    value: each.id,
                                    type: each.account_type
                                };
                                list.push(entry);
                            });

                            response(list);
                        });
                },
                select: function(event, ui) {
                    this.value = ui.item.label;
                    $scope.groupConfigData.summary.company.name = ui.item.label;
                    $scope.groupConfigData.summary.company.id = ui.item.value;
                    if (!$scope.isInAddMode()) $scope.updateGroupSummary();
                    runDigestCycle();
                    return false;
                },
                change: function() {
                    if (!$scope.isInAddMode() && (!$scope.groupConfigData.summary.company || !$scope.groupConfigData.summary.company.name)) {
                        $scope.groupConfigData.summary.company = {
                            id: ""
                        }
                        $scope.updateGroupSummary();
                    }
                }
            }, cardsAutoCompleteCommon);

            //merging auto complete setting for travel agent with common auto cmplt options
            $scope.travelAgentAutoCompleteOptions = angular.extend({
                source: function(request, response) {
                    rvGroupConfigurationSrv.searchTravelAgentCards(request.term)
                        .then(function(data) {
                            var list = [];
                            var entry = {}
                            $.map(data, function(each) {
                                entry = {
                                    label: each.account_name,
                                    value: each.id,
                                    type: each.account_type
                                };
                                list.push(entry);
                            });

                            response(list);
                        });
                },
                select: function(event, ui) {
                    this.value = ui.item.label;
                    $scope.groupConfigData.summary.travel_agent.name = ui.item.label;
                    $scope.groupConfigData.summary.travel_agent.id = ui.item.value;
                    if (!$scope.isInAddMode()) $scope.updateGroupSummary();
                    runDigestCycle();
                    return false;
                },
                change: function() {
                    if (!$scope.isInAddMode() && (!$scope.groupConfigData.summary.travel_agent || !$scope.groupConfigData.summary.travel_agent.name)) {
                        $scope.groupConfigData.summary.travel_agent = {
                            id: ""
                        }
                        $scope.updateGroupSummary();
                    }
                }
            }, cardsAutoCompleteCommon);
        };

        /**
         * method to set groupConfigData.summary.addons_count
         */
        $scope.computeAddonsCount = function() {
            var count = 0;
            angular.forEach($scope.groupConfigData.selectedAddons, function(addon) {
                count += parseInt(addon.addon_count);
            })
            if (count > 0) {
                $scope.groupConfigData.summary.addons_count = count;
            } else {
                $scope.groupConfigData.summary.addons_count = null;
            }

        }

        $scope.updateAndBack = function() {
            if ($scope.groupConfigData.activeTab == "SUMMARY") {
                $scope.updateGroupSummary();
            } else if ($scope.groupConfigData.activeTab == "ACCOUNT") {
                $scope.$broadcast('UPDATE_ACCOUNT_SUMMARY');
            }
            $state.go('rover.groups.search');
        }

        /**
         * function to set Back Navigation params
         */
        var setBackNavigation = function() {
            // TODO : Currently hardcoded to go to groups search.. 
            // Change the same according to the requirements
            if ($scope.previousState && $scope.previousState.name == "rover.reservation.staycard.reservationcard.reservationdetails") {
                $rootScope.setPrevState = {
                    title: 'STAYCARD',
                    name: 'rover.reservation.staycard.reservationcard.reservationdetails',
                    param: {
                        "id": $scope.previousStateParams.id,
                        "confirmationId": $scope.previousStateParams.confirmationId,
                        "isrefresh": true
                    }
                };
            } else {
                $rootScope.setPrevState = {
                    title: $filter('translate')('GROUPS'),
                    callback: 'updateAndBack',
                    scope: $scope
                };
            }

            //setting title and things
            setTitle();
        }

        /**
         * When we recieve the error message from its child controllers, we have to show them
         * @param  {Object} event 
         * @param  {String} errorMessage)
         * @return undefined
         */
        $scope.$on('showErrorMessage', function(event, errorMessage) {
            $scope.errorMessage = errorMessage;
            runDigestCycle();
        });

        /**
         * function to initialize things for group config.
         * @return - None
         */
        var initGroupConfig = function() {

            //forming the data model if it is in add mode or populating the data if it is in edit mode
            $scope.initializeDataModelForSummaryScreen();

            //auto completion things
            initializeAutoCompletions();

            //back navigation
            setBackNavigation();
        };

        initGroupConfig();
    }
]);
