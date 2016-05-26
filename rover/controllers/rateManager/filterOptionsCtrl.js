angular.module('sntRover').controller('RMFilterOptionsCtrl', ['filterDefaults', '$scope', 'RMFilterOptionsSrv', 'ngDialog',
    function(filterDefaults, $scope, RMFilterOptionsSrv, ngDialog) {
        'use strict';

        /*CACHE PROPERTY REFERENCES TO REDUCE OBJECT PROPERTY ACCESS BURDEN*/
        var filterData = $scope.currentFilterData;

        BaseCtrl.call(this, $scope);

        $scope.defaults = filterDefaults;

        /*
         * Method to fetch all filter options
         */

        $scope.leftMenuDimensions = {};
        //company card search query text
        $scope.companySearchText = "";
        $scope.companyLastSearchText = "";
        $scope.companyCardResults = [];

        $scope.cmpCardSearchDivHgt = 42;
        $scope.cmpCardSearchDivTop = 0;
        $scope.arrowPosFromTop = 0;

        var companyCardFetchInterval = '';

        var headerHeight = 60;//Top header showing Rate manager title
        var heightOfFixedComponents = 150;
        //and little blank space between show rate button and the scolling content
        var maxSize = $(window).height() - headerHeight;

        $scope.leftMenuDimensions.outerContainerHeight = maxSize;
        $scope.leftMenuDimensions.scrollableContainerHeight = $scope.leftMenuDimensions.outerContainerHeight - heightOfFixedComponents;
        $scope.setScroller('filter_details', {preventDefault: false});
        $scope.setScroller('nameOnCard', {'click': true, 'useTransform': false});

        $scope.$on('$viewContentLoaded', function() {
            setTimeout(function() {
                    $scope.$parent.myScroll['filter_details'].refresh();
            }, 3000);
        });

        $scope.selFirst = function(){
            //ensure the first child el is re-selected (chrome/chromium/ie9 fix for latest ipad:chrome:iOS version- 41.0.2272.58)
            var rmRateType = $('#rmRateType');
            if (rmRateType){
                if (rmRateType && rmRateType.children){
                    try { setTimeout(function() {
                        if (!rmRateType.children()[0].selected){
                            $('#rmRateType').children()[0].selected = true;
                        }
                    }, 100);
                    } catch(err){

                    }
                }
            }
            var rmRate = $('#rmRate');
            if (rmRate){
                if (rmRate && rmRate.children){
                    try { setTimeout(function() {
                        if (!rmRate.children()[0].selected){
                            $('#rmRate').children()[0].selected = true;
                        }
                    }, 100);
                    } catch(err){

                    }
                }
            }
        };

        $scope.refreshFilterScroll = function() {
            setTimeout(function() {
                $scope.$$childTail.$parent.myScroll['filter_details'].refresh();
            }, 300);
        };
        $scope.fetchFilterOptions = function() {
            var fetchRatesSuccessCallback = function(data) {
                $scope.$emit('hideLoader');

                filterData.allRates = data.results;
                filterData.rates = data.results;


            },
            fetchRateTypesSuccessCallback = function(data) {
                $scope.$emit('hideLoader');

                filterData.rate_types = data;


            };

            $scope.invokeApi(RMFilterOptionsSrv.fetchRates, {}, fetchRatesSuccessCallback).then(function(data) {
                filterData.isPending = true;
                filterData.isResolved = false;
                return $scope.invokeApi(RMFilterOptionsSrv.fetchRateTypes, {}, fetchRateTypesSuccessCallback);
            }).then(function(data) {
                filterData.isPending = false;
                filterData.isResolved = true;
            });
        };

        $scope.fetchFilterOptions();

        $scope.clickedAllRates = function() {
            //If allrates option is selected, unset all rates and rate types
            if(filterData.is_checked_all_rates) {
                filterData.rate_type_selected_list = [];
                filterData.rates_selected_list = [];
            }

            setTimeout(function() {
                $scope.$$childTail.$parent.myScroll['filter_details'].refresh();
            }, 300);
        };

        /**
        * Filter the allrates based on the rate type selected.
        */
        var calculateRatesList = function() {
            var rates = filterData.rates = [],
                rateTypeSelected = filterData.rate_type_selected_list,
                allRates = filterData.allRates;

            if(rateTypeSelected.length === 0) {
                rates = dclone(allRates);
            }

            for (var j = 0, jlen = rateTypeSelected.length, rate_sel = rateTypeSelected[j]; j < jlen; rate_sel = rateTypeSelected[++j]) {
                for(var i = 0, ilen = allRates.length, rate = allRates[i]; i < ilen; rate = allRates[++i]) {
                    if(_.isObject(rate.rate_type)) {
                        if(rate.rate_type.id === rate_sel.id) {
                            rates.push(rate);
                        }
                    }
                }
            }
        };

        $scope.deleteSelectedRateType = function(id) {
            if(filterData.isResolved) {
                if (id === "ALL") {
                    filterData.rate_type_selected_list = [];
                } else {
                    angular.forEach(filterData.rate_type_selected_list, function(item, index) {
                        if (item.id === id) {
                            filterData.rate_type_selected_list.splice(index, 1);
                        }
                    });
                }
                calculateRatesList();
            }

            $scope.refreshFilterScroll();
            if (filterData.rate_type_selected_list.length === 0){
                $scope.resetRatesList();
            }
        };
        $scope.resetRatesList = function(){
            filterData.rates = filterData.allRates;
        };
        /**
        * Display the selected rates in a list having close button.
        * Duplicates are not allowed in the list.
        */
        $scope.$watch('currentFilterData.rate_selected', function() {
            if(filterData.isResolved && !_.isEmpty(filterData.rate_selected)) {
                _update(filterData.rates_selected_list, filterData.rates, filterData.rate_selected);

                filterData.rate_selected = '';
            }
        });

        $scope.$watch('currentFilterData.rate_type_selected', function() {
            if(filterData.isResolved && !_.isEmpty(filterData.rate_type_selected)) {
                _update(filterData.rate_type_selected_list, filterData.rate_types, filterData.rate_type_selected);

                filterData.rate_type_selected = '';

                calculateRatesList();
            }
        });

        var _update = function(sel_list, orig_list, sel_id) {
            var selected_id = { id: +sel_id }, item;

            if(!_.findWhere(sel_list, selected_id) &&
               (item = _.findWhere(orig_list, selected_id))) {
                    sel_list.push(item);
            }
        };

        /**
         * company card search text entered
         */
        $scope.companySearchTextEntered = function() {
            if ($scope.companySearchText.length === 0) {
                $scope.companyCardResults = [];
                $scope.companyLastSearchText = "";
            } else if($scope.companySearchText.length === 1) {
                $scope.companySearchText = $scope.companySearchText.charAt(0).toUpperCase() + $scope.companySearchText.substr(1);
            } else if($scope.companySearchText.length > 2){
                companyCardFetchInterval = window.setInterval(function() {
                    displayFilteredResults();
                }, 500);
            }
        };


        //if no replace value is passed, it returns an empty string

        var escapeNull = function(value) {
            var valueToReturn = ((value === null || typeof value === 'undefined') ? '' : value);
            return valueToReturn;
        };

        var refreshScroller = function() {
            // setting popver height and each element height
            $scope.cmpCardSearchDivHgt = 250;
            var totalHeight = 42;
            $scope.arrowPosFromTop = $('#company-card').offset().top;
            var popOverBottomPosFromTop = $('#company-card').offset().top - 20;
            if ($scope.companyCardResults.length === 0) {
                $scope.cmpCardSearchDivHgt = totalHeight;
            } else {
                $scope.cmpCardSearchDivHgt = $scope.companyCardResults.length * totalHeight;
            }
            if( $scope.cmpCardSearchDivHgt > 250 ){
                $scope.cmpCardSearchDivHgt = 250;
            }
            var halfOfInputHeight = $('#company-card').height() / 2;
            $scope.cmpCardSearchDivTop = popOverBottomPosFromTop - $scope.cmpCardSearchDivHgt - halfOfInputHeight;
           
            setTimeout(function() {
                $scope.$parent.myScroll['nameOnCard'].refresh();
            }, 300);

        };


        /**
         * function to perform filering on results.
         * if not fouund in the data, it will request for webservice
         */
        var displayFilteredResults = function() {
            if ($scope.companySearchText !== '' && $scope.companyLastSearchText !== $scope.companySearchText) {

                var successCallBackOfCompanySearch = function(data) {
                    $scope.$emit("hideLoader");
                    $scope.companyCardResults = data.accounts;
                    refreshScroller();
                };
                var paramDict = {
                    'query': $scope.companySearchText.trim()
                };
                $scope.invokeApi(RMFilterOptionsSrv.fetchCompanyCard, paramDict, successCallBackOfCompanySearch);
                // we have changed data, so we dont hit server for each keypress
                $scope.companyLastSearchText = $scope.companySearchText;
                clearInterval(companyCardFetchInterval);
            }
        };

        $scope.setCompanyCardFilter = function(cmpCardObj, event) {
            event.stopPropagation();
            event.preventDefault();
            $scope.companySearchText = "";

            $scope.currentFilterData.name_cards.push(cmpCardObj);
            // reset company card result array
            $scope.companyCardResults = [];
            $scope.refreshFilterScroll();
        };

        $scope.hideCompanyCardSearchResults = function() {
            $scope.companyCardResults = [];
        };

        $scope.deleteCards = function(id) {
            angular.forEach($scope.currentFilterData.name_cards, function(item, index) {
                if (item.id === id) {
                    $scope.currentFilterData.name_cards.splice(index, 1);
                }
            });
            $scope.companySearchText = "";
            $scope.refreshFilterScroll();
        };

        $scope.deleteRate = function(id) {
            if (id === "ALL") {
                filterData.rates_selected_list = [];
            } else {
                angular.forEach(filterData.rates_selected_list, function(item, index) {
                    if (item.id === id) {
                        filterData.rates_selected_list.splice(index, 1);
                    }
                });
            }

            $scope.refreshFilterScroll();
        };

        $scope.showCalendar = function() {
            ngDialog.open({
                template: '/assets/partials/rateManager/selectDateRangeModal.html',
                controller: 'SelectDateRangeModalCtrl',
                className: 'ngdialog-theme-default calendar-modal',
                scope: $scope
            });
        };

        $scope.toggleShowRates = function() {
            return (_.isEmpty(filterData.selected_date_range));
        };

        $scope.$on('closeFilterPopup', function() {
            $scope.companyCardResults = [];
        });

        /**
         * This is a filter method used to removed expired rates from the date range selected
         * CICO-17201
         * https://stayntouch.atlassian.net/browse/CICO-17201?focusedCommentId=49127&page=com.atlassian.jira.plugin.system.issuetabpanels:comment-tabpanel#comment-49127
         * -- show only rates that are active and aren't expired in the date range(when provided)
         * @param  {Object} rate Rate object from the array of rates
         * @return {Boolean}      True if the rate is not expired
         */
        $scope.removeExpiredRates = function(rate){
            return !$scope.currentFilterData.begin_date || // Need to filter only when date range is provided
                !$scope.currentFilterData.end_date || // Need to filter only when date range is provided
                !rate.end_date || // Need to filter only rates which have an expiry date (end date)
                (new tzIndependentDate($scope.currentFilterData.begin_date) < new tzIndependentDate(rate.end_date)); //Blocking only expired rates... rates expiring in the date range would still show up.
        };
    }
]);