admin.controller('ADRatesAddonsCtrl', [
    '$scope',
    '$rootScope',
    'ADRatesAddonsSrv',
    'ADHotelSettingsSrv',
    '$filter',
    'ngTableParams',
    'ngDialog',
    '$timeout',
    'activeRates',
    'availableLanguages',
    'addonUpsellSettings',
    function($scope, $rootScope, ADRatesAddonsSrv, ADHotelSettingsSrv, $filter, ngTableParams, ngDialog, $timeout, activeRates, availableLanguages, addonUpsellSettings) {


        // extend base controller
        $scope.init = function() {
            ADBaseTableCtrl.call(this, $scope, ngTableParams);
            // higlight the selected Main menu (can come to this screen using the addon shortcuts)
            $scope.$emit("changedSelectedMenu", $scope.findMainMenuIndex('Rates'));

            // various addon data holders
            $scope.data = [];
            $scope.singleAddon = {};

            // for adding
            $scope.isAddMode = false;

            // api load count
            $scope.fileName = "Choose file...";
            $scope.initialImage = '';
            $scope.apiLoadCount = 0;
            $scope.chargeCodesForChargeGrp = [];
            $scope.singleAddon.charge_group_id = "";
            $scope.currentClickedAddon = -1;
            $scope.errorMessage = "";
            $scope.successMessage = "";
            $scope.state = {
                rates: activeRates.results
            };

            $scope.isConnectedToPMS = !$rootScope.isStandAlone;
            $scope.showZestWebSettings = addonUpsellSettings.zest_web_addon_upsell_availability;
            $scope.showZestStationSettings = addonUpsellSettings.zest_station_addon_upsell_availability;
        };

        $scope.init();
        $scope.showChargeFullWeeksOnly = function() {
            if (!$scope.isConnectedToPMS && ($scope.singleAddon.post_type_id === 3) && ($scope.singleAddon.is_reservation_only === true)) {
                return true;
            } else {
                return false;
            }
        };

        $scope.fetchTableData = function($defer, params) {
            var getParams = $scope.calculateGetParams(params);

            $scope.currentClickedAddon = -1;

            var fetchSuccessOfItemList = function(data) {
                $scope.totalCount = data.total_count;
                $scope.totalPage = Math.ceil(data.total_count / $scope.displyCount);

                $scope.currentPage = params.page();
                params.total(data.total_count);

                // sort the results
                $scope.data = params.sorting() ?
                    $filter('orderBy')(data.results, params.orderBy()) :
                    data.results;

                $defer.resolve($scope.data);

                $scope.$emit('hideLoader');
                $scope.fetchOtherApis();
            };

            $scope.invokeApi(ADRatesAddonsSrv.fetch, getParams, fetchSuccessOfItemList);
        };

        $scope.loadTable = function() {
            $scope.currentClickedAddon = -1;
            $scope.tableParams = new ngTableParams({
                page: 1, // show first page
                count: $scope.displyCount, // count per page
                sorting: {
                    name: 'asc' // initial sorting
                }
            }, {
                total: 0, // length of data
                getData: $scope.fetchTableData
            });
        };

        $scope.loadTable();

        // map charge codes for selected charge charge group

        var manipulateChargeCodeForChargeGroups = function() {

            if (!$scope.singleAddon.charge_group_id) {
                $scope.chargeCodesForChargeGrp = $scope.chargeCodes;
            } else {
                var selectedChargeGrpId = $scope.singleAddon.charge_group_id;

                $scope.chargeCodesForChargeGrp = [];
                angular.forEach($scope.chargeCodes, function(chargeCode, key) {
                    angular.forEach(chargeCode.associcated_charge_groups, function(associatedChargeGrp, key) {
                        if (associatedChargeGrp.id === selectedChargeGrpId) {
                            $scope.chargeCodesForChargeGrp.push(chargeCode);
                        }
                    });
                });

            }
        };


        // fetch charge groups, charge codes, amount type and post type
        $scope.fetchOtherApis = function() {
            // fetch charge groups
            var cgCallback = function(data) {
                $scope.chargeGroups = data.results;

                // when ever we are ready to emit 'hideLoader'
                $scope.apiLoadCount++;
                if ($scope.apiLoadCount > 4) {
                    $scope.$emit('hideLoader');
                }
            };

            $scope.invokeApi(ADRatesAddonsSrv.fetchChargeGroups, {}, cgCallback, '', 'NONE');


            // fetch charge codes
            var ccCallback = function(data) {
                $scope.chargeCodes = data.results;
                manipulateChargeCodeForChargeGroups();
                $scope.$emit('hideLoader');
            };

            $scope.invokeApi(ADRatesAddonsSrv.fetchChargeCodes, {}, ccCallback, '', 'NONE');

            // fetch amount types
            var atCallback = function(data) {
                $scope.amountTypes = data;
                $scope.$emit('hideLoader');
            };

            $scope.invokeApi(ADRatesAddonsSrv.fetchReferenceValue, {
                'type': 'amount_type'
            }, atCallback, '', 'NONE');

            // fetch post types
            var ptCallback = function(data) {
                // CICO-23575 - Disable all posting types apart from First Night for Hourly.
                if ($rootScope.isHourlyRatesEnabled || $rootScope.hotelDiaryConfig.mode === 'FULL') {
                    $scope.postTypes = [data[2]];
                } else {
                    $scope.postTypes = data;
                }

                $scope.$emit('hideLoader');
            };

            $scope.invokeApi(ADRatesAddonsSrv.fetchReferenceValue, {
                'type': 'post_type'
            }, ptCallback, '', 'NONE');

            // fetch the current business date
            var bdCallback = function(data) {

                // dwad convert the date to 'MM-dd-yyyy'
                $scope.businessDate = data.business_date;
                $scope.$emit('hideLoader');
            };

            $scope.invokeApi(ADRatesAddonsSrv.fetchBusinessDate, {}, bdCallback, '', 'NONE');
        };


        // To fetch the template for chains details add/edit screens
        $scope.getTemplateUrl = function() {
            return "/assets/partials/rates/adNewAddon.html";
        };

        // to add new addon
        $scope.addNew = function() {
            $scope.setDefaultLanguageForTranslation();
            $scope.singleAddon.charge_group_id = "";
            manipulateChargeCodeForChargeGroups();

            $scope.isAddMode = true;
            $scope.isEditMode = false;

            // reset any currently being edited
            $scope.currentClickedAddon = -1;

            // title for the sub template
            $scope.addonTitle = $filter('translate')('ADD_NEW_SMALL');
            $scope.addonSubtitle = $filter('translate')('ADD_ON');

            // params to be sent to server
            $scope.singleAddon = {};
            $scope.singleAddon.activated = true;

            // CICO-23575 - Disable all posting types apart from First Night for Hourly.
            if ($rootScope.isHourlyRatesEnabled) {
                $scope.singleAddon.post_type_id = 2;
            }

            // today should be business date, currently not avaliable
            var today = tzIndependentDate();
            var weekAfter = today.setDate(today.getDate() + 7);

            // the inital dates to business date // CICO-17736 Addons can have blank begin-end dates
            $scope.singleAddon.begin_date = null;
            $scope.singleAddon.end_date = null;

            // initate to include all rates here
            $scope.filterRates($scope.singleAddon);
            $scope.singleAddon.addon_image = "";
        };

        // listen for datepicker update from ngDialog
        var updateBind = $rootScope.$on('datepicker.update', function(event, chosenDate) {

            // covert the date back to 'MM-dd-yyyy' format
            if ($scope.dateNeeded === 'From') {
                $scope.singleAddon.begin_date = chosenDate;
                // convert system date to MM-dd-yyyy format
                $scope.singleAddon.begin_date_for_display = $filter('date')(tzIndependentDate(chosenDate), $rootScope.dateFormat);


                // if user moved begin_date in a way
                // that the end_date is before begin_date
                // we must set the end_date to begin_date
                // so that user may not submit invalid dates
                if (tzIndependentDate($scope.singleAddon.begin_date) - tzIndependentDate($scope.singleAddon.end_date) > 0) {
                    $scope.singleAddon.end_date = chosenDate;
                    $scope.singleAddon.end_date_for_display = $filter('date')(tzIndependentDate(chosenDate), $rootScope.dateFormat);
                }
            } else {
                $scope.singleAddon.end_date = chosenDate;
                $scope.singleAddon.end_date_for_display = $filter('date')(tzIndependentDate(chosenDate), $rootScope.dateFormat);
            }
        });

        $scope.resetDate = function(pickerId) {

            if (pickerId === 'From') {
                $scope.singleAddon.begin_date_for_display = "";
                $scope.singleAddon.begin_date = null;
            } else {
                $scope.singleAddon.end_date_for_display = "";
                $scope.singleAddon.end_date = null;
            }

        };

        // the listner must be destroyed when no needed anymore
        $scope.$on('$destroy', updateBind);

        $scope.editSingle = function() {
            $scope.setDefaultLanguageForTranslation();
            $scope.isAddMode = false;
            $scope.isEditMode = true;

            // set the current selected
            $scope.currentClickedAddon = this.$index;

            // title for the sub template
            $scope.addonTitle = $filter('translate')('EDIT');
            $scope.addonSubtitle = this.item.name;

            // empty singleAddon
            $scope.singleAddon = {};

            // keep the selected item id in scope
            $scope.currentAddonId = this.item.id;

            var callback = function(data) {
                $scope.$emit('hideLoader');

                $scope.singleAddon = data;
                $scope.initialImage = data.addon_image;
                // CICO-23575 - Disable all posting types apart from First Night for Hourly.
                if ($rootScope.isHourlyRatesEnabled) {
                    $scope.singleAddon.post_type_id = 2;
                }
                manipulateChargeCodeForChargeGroups();

                // Display currency with two decimals
                $scope.singleAddon.amount = $filter('number')($scope.singleAddon.amount, 2);

                // now remove commas created by number
                // when the number is greater than 3 digits (without fractions)
                if ($scope.singleAddon.amount) {
                    $scope.singleAddon.amount = $scope.singleAddon.amount.split(',').join('');
                }


                // if the user is editing an old addon
                // where the dates are not set
                // set the date to current business date
                if (!$scope.singleAddon.begin_date) {
                    $scope.singleAddon.begin_date = null; // CICO-17736 Addons can have blank begin-end dates
                    $scope.singleAddon.begin_date_for_display = "";
                } else {
                    $scope.singleAddon.begin_date_for_display = $filter('date')(tzIndependentDate($scope.singleAddon.begin_date), $rootScope.dateFormat);
                }
                if (!$scope.singleAddon.end_date) {
                    $scope.singleAddon.end_date = null; // CICO-17736 Addons can have blank begin-end dates
                    $scope.singleAddon.end_date_for_display = "";
                } else {
                    $scope.singleAddon.end_date_for_display = $filter('date')(tzIndependentDate($scope.singleAddon.end_date), $rootScope.dateFormat);
                }

                // convert system date to MM-dd-yyyy format


                $scope.singleAddon.begin_date = $scope.singleAddon.begin_date;
                $scope.singleAddon.end_date = $scope.singleAddon.end_date;

                $scope.filterRates($scope.singleAddon);
            };

            $scope.invokeApi(ADRatesAddonsSrv.fetchSingle, $scope.currentAddonId, callback);
        };

        // on close all add/edit modes
        $scope.cancelCliked = function() {
            $scope.isAddMode = false;
            $scope.isEditMode = false;

            // remove the item being edited
            $scope.currentClickedAddon = -1;
        };

        // on save add/edit addon
        $scope.addUpdateAddon = function() {
            var singleAddonData = {
                activated: $scope.singleAddon.activated,
                amount: $scope.singleAddon.amount,
                amount_type_id: $scope.singleAddon.amount_type_id,
                bestseller: $scope.singleAddon.bestseller,
                charge_code_id: $scope.singleAddon.charge_code_id,
                charge_group_id: $scope.singleAddon.charge_group_id,
                description: $scope.singleAddon.description,
                is_alternate_description_active: $scope.singleAddon.is_alternate_description_active,
                alternate_description: $scope.singleAddon.alternate_description,
                is_reservation_only: $scope.singleAddon.is_reservation_only,
                inventory_count: parseInt($scope.singleAddon.inventory_count),
                name: $scope.singleAddon.name,
                post_type_id: $scope.singleAddon.post_type_id,
                rate_code_only: $scope.singleAddon.rate_code_only,
                manual_posting: $scope.singleAddon.manual_posting,
                is_common_area: $scope.singleAddon.is_common_area,
                pass_level_no: $scope.singleAddon.pass_level_no,
                forecast_for_next_day: $scope.singleAddon.forecast_for_next_day,
                charge_full_weeks_only: (($scope.singleAddon.post_type_id === 3) && $scope.singleAddon.is_reservation_only && $scope.singleAddon.charge_full_weeks_only) ? true : false,
                allow_rate_exclusions: $scope.singleAddon.allow_rate_exclusions,
                excluded_rate_ids: _.pluck($scope.singleAddon.excludedRates, 'id'),
                addon_image: $scope.singleAddon.addon_image,
                is_sell_separate: $scope.singleAddon.is_sell_separate,
                is_display_suffix: $scope.singleAddon.is_display_suffix,
                suffix_label: $scope.singleAddon.suffix_label,
                notify_staff_on_purchase: $scope.singleAddon.notify_staff_on_purchase
            };

            if ($scope.isDefaulLanguageSelected()) {
                var selectedLanguage = _.find($scope.languages.locales, function(language) {
                    return language.value === $scope.languageFilter.locale;
                });
                var selectedLanguageTranslations = _.find($scope.singleAddon.translations, function(translation) {
                    return parseInt(selectedLanguage.id) === parseInt(translation.language_id);
                });
                var translations = {};

                // translations.translated_description = $scope.singleAddon.description;
                translations.translated_alternate_description = $scope.singleAddon.alternate_description;
                translations.translated_suffix = $scope.singleAddon.suffix_label;
                translations.translated_name = $scope.singleAddon.name;
                translations.language_id = selectedLanguage.id;
                if (!_.isUndefined(selectedLanguageTranslations) && !_.isUndefined(selectedLanguageTranslations.id)) {
                    translations.id = selectedLanguageTranslations.id;
                }
                singleAddonData.translations = translations;
            } else {
                singleAddonData.translations = JSON.parse(JSON.stringify($scope.translations));
            }


            // convert dates to system format yyyy-MM-dd
            // if not date null should be passed - read story CICO-7287
            singleAddonData.begin_date = $scope.singleAddon.begin_date ? $filter('date')(tzIndependentDate($scope.singleAddon.begin_date), 'yyyy-MM-dd') : null;
            singleAddonData.end_date = $scope.singleAddon.end_date ? $filter('date')(tzIndependentDate($scope.singleAddon.end_date), 'yyyy-MM-dd') : null;

            var unwantedKeys = [];

            if ($scope.initialImage === singleAddonData.addon_image) {
                unwantedKeys.push('addon_image');
            }
            /* global dclone:true */
            var addon_data = dclone(singleAddonData, unwantedKeys);

            // if we are adding new addon
            if ($scope.isAddMode) {
                var callback = function() {
                    $scope.$emit('hideLoader');
                    $scope.isAddMode = false;
                    $scope.tableParams.reload();
                };

                $scope.invokeApi(ADRatesAddonsSrv.addNewAddon, addon_data, callback);
            }

            // if we are editing an addon
            if ($scope.isEditMode) {
                var callback = function() {
                    $scope.$emit('hideLoader');

                    $scope.isEditMode = false;
                    $scope.currentClickedAddon = -1;

                    $scope.tableParams.reload();
                };

                // include current addon id also
                addon_data.id = $scope.currentAddonId;

                $scope.invokeApi(ADRatesAddonsSrv.updateSingle, addon_data, callback);
            }
        };

        // on change activation
        $scope.switchActivation = function() {
            var item = this.item;

            var callback = function() {
                item.activated = item.activated ? false : true;

                $scope.$emit('hideLoader');
            };

            var data = {
                id: item.id,
                status: item.activated ? false : true
            };

            $scope.invokeApi(ADRatesAddonsSrv.switchActivation, data, callback);
        };

        // on delete addon
        $scope.deleteAddon = function() {
            var item = this.item;

            $scope.currentClickedAddon = -1;

            var callback = function() {
                var withoutThis = _.without($scope.data, item);

                $scope.data = withoutThis;

                $scope.$emit('hideLoader');


            };

            var data = {
                id: item.id
            };

            $scope.invokeApi(ADRatesAddonsSrv.deleteAddon, data, callback);
        };

        $scope.popupCalendar = function(dateNeeded) {
            $scope.dateNeeded = dateNeeded;

            ngDialog.open({
                template: '/assets/partials/rates/addonsDateRangeCalenderPopup.html',
                controller: 'addonsDatesRangeCtrl',
                className: 'ngdialog-theme-default single-date-picker',
                closeByDocument: true,
                scope: $scope
            });
        };

        $scope.chargeGroupChage = function() {
            $scope.singleAddon.charge_code_id = "";
            manipulateChargeCodeForChargeGroups();
        };

        var updateBestSellerOption = function() {
            if (!!$scope.singleAddon.rate_code_only) {
                $scope.singleAddon.bestseller = false;
            }
        };

        $scope.bestsellerChanged = function() {
            // CICO-21783 'BestSeller' and 'Rate Only' are mutually exclusive
            if ($scope.singleAddon.bestseller) {
                $scope.singleAddon.rate_code_only = false;
            }
        };

        $scope.reservationOnlyChanged = function() {
            $scope.singleAddon.rate_code_only = $scope.singleAddon.is_reservation_only ? false : $scope.singleAddon.is_reservation_only;
            updateBestSellerOption();
        };

        $scope.rateOnlyChanged = function() {
            $scope.singleAddon.is_reservation_only = $scope.singleAddon.rate_code_only ? false : $scope.singleAddon.is_reservation_only;
            updateBestSellerOption();
        };
        $scope.sortByName = function() {
            if ($scope.currentClickedAddon === -1) {
                $scope.tableParams.sorting({
                    'name': $scope.tableParams.isSortBy('name', 'asc') ? 'desc' : 'asc'
                });
            }
        };
        $scope.sortByDescription = function() {
            if ($scope.currentClickedAddon === -1) {
                $scope.tableParams.sorting({
                    'description': $scope.tableParams.isSortBy('description', 'asc') ? 'desc' : 'asc'
                });
            }
        };

        /**
         * To import the package details from MICROS PMS.
         */
        $scope.importFromPms = function(event) {

            event.stopPropagation();

            $scope.successMessage = "Collecting package details from PMS and adding to Rover...";

            var fetchSuccessOfPackageList = function(data) {
                $scope.$emit('hideLoader');
                $scope.successMessage = "Completed!";
                $timeout(function() {
                    $scope.successMessage = "";
                }, 1000);
            };

            $scope.invokeApi(ADRatesAddonsSrv.importPackages, {}, fetchSuccessOfPackageList);
        };

        $scope.filterRates = function(addon) {
            addon.excludedRates = [];
            addon.availableRates = [];
            _.each($scope.state.rates, function(rate) {
                if (_.indexOf(addon.excluded_rate_ids, rate.id) > -1) {
                    addon.excludedRates.push(rate);
                } else {
                    addon.availableRates.push(rate);
                }
            });
        };

        $scope.toggleAvailableRate = function(index) {
            if (index !== $scope.state.selectedAvailableRate) {
                $scope.state.selectedAvailableRate = index;
            } else {
                $scope.state.selectedAvailableRate = -1;
            }
        };

        $scope.toggleExcludedRate = function(index) {
            if (index !== $scope.state.selectedAssignedRate) {
                $scope.state.selectedAssignedRate = index;
            } else {
                $scope.state.selectedAssignedRate = -1;
            }
        };

        $scope.includeAllRates = function(addon) {
            Array.prototype.push.apply(addon.excludedRates, addon.availableRates);
            addon.availableRates = [];
            $scope.state.selectedAssignedRate = -1;
            $scope.state.selectedAvailableRate = -1;
        };

        $scope.excludeAllRates = function(addon) {
            Array.prototype.push.apply(addon.availableRates, addon.excludedRates);
            addon.excludedRates = [];
            $scope.state.selectedAssignedRate = -1;
            $scope.state.selectedAvailableRate = -1;
        };


        $scope.excludeSelectedRate = function(addon) {
            if ($scope.state.selectedAvailableRate > -1) {
                addon.excludedRates.push(addon.availableRates.splice($scope.state.selectedAvailableRate, 1)[0]);
                $scope.state.selectedAvailableRate = -1;
            }
        };

        $scope.includeSelectedRate = function(addon) {
            if ($scope.state.selectedAssignedRate > -1) {
                addon.availableRates.push(addon.excludedRates.splice($scope.state.selectedAssignedRate, 1)[0]);
                $scope.state.selectedAssignedRate = -1;
            }
        };

        $scope.deleteIcon = function() {
            $scope.fileName = "Choose file...";
            $scope.singleAddon.addon_image = "";
        };

        /** Addon translation **/
        $scope.translations = {};
        // set the data for the language deropdown
        availableLanguages.locales = availableLanguages.languages;
        delete availableLanguages.languages;
        // variable is different
        _.each(availableLanguages.locales, function(locale) {
            locale.value = locale.code;
            delete locale.code;
        });
        // filter out disabled languages
        availableLanguages.locales = _.reject(availableLanguages.locales, function(locale) {
            return !locale.is_show_on_guest_card;
        });

        $scope.languages = availableLanguages;
        $scope.languageFilter = {
            'locale': availableLanguages.selected_language_code,
            'currentLocaleId': 0
        };
        $scope.onLocaleChange = function() {
            var selectedLanguage = _.find($scope.languages.locales, function(language) {
                return language.value === $scope.languageFilter.locale
            });
            var selectedLanguageTranslations = _.find($scope.singleAddon.translations, function(translation) {
                return parseInt(selectedLanguage.id) === parseInt(translation.language_id);
            });

            $scope.translations = {};
            $scope.translations.translated_description = _.isUndefined(selectedLanguageTranslations) ? '' : selectedLanguageTranslations.translated_description;
            $scope.translations.translated_alternate_description = _.isUndefined(selectedLanguageTranslations) ? '' : selectedLanguageTranslations.translated_alternate_description;
            $scope.translations.translated_suffix = _.isUndefined(selectedLanguageTranslations) ? '' : selectedLanguageTranslations.translated_suffix;
            $scope.translations.translated_name = _.isUndefined(selectedLanguageTranslations) ? '' : selectedLanguageTranslations.translated_name;
            $scope.translations.language_id = selectedLanguage.id;
            if (!_.isUndefined(selectedLanguageTranslations) && !_.isUndefined(selectedLanguageTranslations.id)) {
                $scope.translations.id = selectedLanguageTranslations.id
            }
        };
        $scope.onLocaleChange();

        $scope.isDefaulLanguageSelected = function() {
            return $scope.languages.selected_language_code === $scope.languageFilter.locale;
        };
        $scope.setDefaultLanguageForTranslation = function() {
            $scope.languageFilter = {
                'locale': availableLanguages.selected_language_code
            };
        };

        $scope.returnAddonUpseellClass = function(addon) {
            var styleClass;

            if (addon.zest_station_upsell && !addon.zest_web_upsell) {
                styleClass = 'kiosk-upsell';
            } else if (!addon.zest_station_upsell && addon.zest_web_upsell) {
                styleClass = 'web-upsell';
            } else if (addon.zest_station_upsell && addon.zest_web_upsell) {
                styleClass = 'zs-n-web-upsell';
            } else {
                styleClass = 'no-upsell';
            }
            return styleClass;

        };
    }
]);
