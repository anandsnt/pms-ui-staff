admin.service("adMenuSrv", [
    "adPermissionSrv",
    "ADAppSrv",
    "ADHotelDetailsSrv",
    "$rootScope",
    function(adPermissionSrv, ADAppSrv, ADHotelDetailsSrv, $rootScope) {
        // we have to keep reference
        var self = this;
        /*
         * utility function to decide whether the hourly rate is on or not
         * will use the hotel details API response
         * @return {Boolean}
         */
        var isHourlyRateOn = function() {
            return ADHotelDetailsSrv.currentHotelDetails.is_hourly_rate_on;
        };

        /*
         * utility function to decide whether the it is connected
         * will use the hotel details API response
         * @return {Boolean}
         */
        var isConnected = function() {
            return ADHotelDetailsSrv.currentHotelDetails.pms_type !== null;
        };

        /*
         * Decide whether the neighbours submenu is to be shown in Front desk menu
         * will use the hotel details API response
         * @return {Boolean}
         */
        var isNeighboursEnabled = function() {
            return ADHotelDetailsSrv.currentHotelDetails.social_lobby_settings
                .is_neighbours_enabled;
        };

        /*
         * utility function to process menu list
         * will check permission, check role permission, visibility permission
         * @param {array of Objects}
         * @return {array of Objects}
         */
        this.processMenuList = function(menuList) {
            // deep copying the object before proceeding
            // eslint-disable-next-line angular/json-functions
            menuList = JSON.parse(JSON.stringify(menuList));

            var menuToReturn = [],
                subMenuCount,
                subMenuVisibleCount,
                hasSubMenu = false;

            // we are processing on the menu list we have
            _.each(menuList, function(menuItem) {
                // if the menu is hi
                var isMenuItemVisible = self.shouldShowMenuItem(
                    menuItem.menuIndex
                );

                if (isMenuItemVisible) {
                    subMenuCount = menuItem.submenu
                        ? menuItem.submenu.length
                        : 0;
                    hasSubMenu = subMenuCount > 0;
                    subMenuVisibleCount = 0;

                    // looping through submenus
                    menuItem.submenu = _.filter(menuItem.submenu, function(
                        subMenuItem
                    ) {
                        isMenuItemVisible = self.shouldShowMenuItem(
                            subMenuItem.menuIndex
                        );

                        if (isMenuItemVisible) {
                            subMenuVisibleCount++;
                        }
                        return isMenuItemVisible;
                    });

                    // if it has submenu & none of them are visible we will not show that menu
                    if (hasSubMenu && subMenuVisibleCount !== 0) {
                        menuToReturn.push(menuItem);
                    }

                    // if it has no submenu, we will just push them
                    if (!hasSubMenu) {
                        menuToReturn.push(menuItem);
                    }
                }
            });

            return menuToReturn;
        };

        /*
         * function to check permissions against a menu
         * @param {string}, menu index
         * @return {boolean}
         */
        this.hasMenuPermission = function(menuIndex) {
            // NOTE:- {key: menuIndex, value: [PERMISSIONS]}
            var menuPermissions = {
                search: ["SEARCH_RESERVATIONS"],
                createReservation: ["CREATE_EDIT_RESERVATIONS"],
                postcharges: ["ACCESS_POST_CHARGES"],

                cashier: ["ACCESS_CASHIERING"],
                endOfDay: ["ACCESS_RUN_END_OF_DAY"],
                rateManager: ["ACCESS_RATE_MANAGER"],

                cards: ["ACCESS_COMPANY_TA_CARDS"],
                distribution_manager: ["ACCESS_DISTRIBUTION_MENU"],
                roomStatus: ["HOUSEKEEPING_ROOM_STATUS_ACCESS"],

                workManagement: ["ACCESS_TASK_MANAGEMENT"],
                maintanance: ["ACCESS_TASK_MAINTENANCE"],
                journals: ["ACCESS_JOURNAL"],
                ccTransactions: ["VIEW_CC_TRANSACTIONS"],

                accountsReceivables: ["ACCESS_ACCOUNTING_INTERFACE"],
                accounting: ["ACCESS_ACCOUNTING_INTERFACE"],
                commisions: ["ACCESS_COMMISSIONS"],
                diaryReservation: ["CREATE_EDIT_RESERVATIONS"],
                nightlyDiaryReservation: ["ACCESS_ROOM_DIARY"],

                menuGroups: [],
                menuCreateGroup: ["GROUP_CREATE"],
                menuManageGroup: ["GROUP_MANAGE"],

                menuCreateAllotment: ["ALLOTMENTS_CREATE"],
                menuManageAllotment: ["ALLOTMENTS_MANAGE"],

                accounts: ["ACCESS_ACCOUNTS"],

                changePassword: ["SETTINGS_CHANGE_PASSWORD_MENU"],
                adminSettings: ["SETTINGS_ACCESS_TO_HOTEL_ADMIN"],
                overbooking: ["OVERBOOKING_MENU"]
            };

            var permissions = null,
                collectivePermissionValue = true;

            if (menuIndex in menuPermissions) {
                permissions = menuPermissions[menuIndex];

                _.each(permissions, function(item) {
                    collectivePermissionValue =
                        collectivePermissionValue *
                        adPermissionSrv.getPermissionValue(item);
                });
                return collectivePermissionValue;
            }
            return true;
        };

        /*
         * function to check whether a menu has some role based association
         * @param {string}, menu index
         * @return {boolean}
         */
        this.hasRolePermission = function() {
            var user = ADAppSrv.getUserDetails(),
                role = user.user_role,
                isHotelAdmin = role === "Hotel Admin" || role === "Chain Admin",
                isHotelStaff = user.is_staff,
                returnValue = false;

            // currently every menu is available for Hotel Admin & Hotel Staff
            returnValue = isHotelAdmin || isHotelStaff;

            return returnValue;
        };

        /*
         * function to check whether a menu has some role based association
         * @param {string}, menu index
         * @return {boolean}
         */
        this.hasSettingsPermission = function(menuIndex) {
            var returnValue = true;

            switch (menuIndex) {
                case "diaryReservation":
                    returnValue = isHourlyRateOn();
                    break;

                case "nightlyDiaryReservation":
                    var isRoomDiaryEnabled = $rootScope.isPmsProductionEnv
                        ? $rootScope.isRoomDiaryEnabled
                        : true;

                    returnValue = !isHourlyRateOn() && isRoomDiaryEnabled;
                    break;

                // dont wanted to show on hourly enabled hotels
                case "menuGroups":
                    returnValue = !isHourlyRateOn();
                    break;

                // if auto change business is not enabled, we have to show EOD menu
                // hote admin -> Hotel & Staff -> Settings & Parameter -> AUTO CHANGE BUSINESS DATE
                case "endOfDay":
                    returnValue = true;
                    break;

                // we are hiding conversations for now
                case "conversations":
                    returnValue = false;
                    break;

                case "reports":
                    // we are hiding the reports menu if it is a floor & maintanance staff	in connected/standalon

                    break;
                case "workManagement":
                    returnValue = !isHourlyRateOn();
                    break;

                case "sociallobby":
                    returnValue = isNeighboursEnabled();
                    break;
                // we display social lobby to only

                // dont wanted to show on hourly enabled hotels
                case "overbooking":
                    var isSellLimitEnabled = $rootScope.isPmsProductionEnv
                        ? $rootScope.isSellLimitEnabled
                        : true;

                    returnValue =
                        !isHourlyRateOn() &&
                        !isConnected() &&
                        isSellLimitEnabled;
                    break;

                default:
                    break;
            }

            return returnValue;
        };

        /*
         * function to check permissions against a menu
         * @param {string}, menu index
         * @return {boolean}
         */
        this.shouldShowMenuItem = function(menuIndex) {
            if (!self.hasMenuPermission(menuIndex)) {
                return false;
            }
            if (!self.hasRolePermission(menuIndex)) {
                return false;
            }
            if (!self.hasSettingsPermission(menuIndex)) {
                return false;
            }
            return true;
        };
    }
]);