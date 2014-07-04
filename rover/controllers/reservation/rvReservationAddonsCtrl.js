sntRover.controller('RVReservationAddonsCtrl', ['$scope', 'addonData', '$state', 'ngDialog', 'RVReservationAddonsSrv',
    function($scope, addonData, $state, ngDialog, RVReservationAddonsSrv) {

        // by default load Best Sellers addon
        // Best Sellers in not a real charge code [just hard coding -1 as charge group id to fetch best sell addons] 
        // same will be overrided if with valid charge code id
        $scope.activeAddonCategoryId = -1;
        $scope.activeRoom = $scope.reservationData.rooms[0];

        $scope.showEnhancementsPopup = function() {
            var selectedAddons = $scope.activeRoom.addons;
            if (selectedAddons.length > 0) {
                ngDialog.open({
                    template: '/assets/partials/reservation/selectedAddonsListPopup.html',
                    className: 'ngdialog-theme-default',
                    closeByDocument: true,
                    scope: $scope
                });
            }
        }

        $scope.closePopup = function() {
            ngDialog.close();
        }

        $scope.goToSummaryAndConfirm = function() {
            $scope.closePopup();
            $state.go('rover.reservation.mainCard.summaryAndConfirm');
        }

        $scope.selectAddonCategory = function(category, event) {
            event.stopPropagation();
            if (category != '') {
                $scope.activeAddonCategoryId = category.id;
                $scope.fetchAddons(category.id);
            } else {
                $scope.activeAddonCategoryId = -1;
                $scope.fetchAddons();
            }
        }

        $scope.selectAddon = function(addon, addonQty) {
            //Amount_Types
            // 1   ADULT   
            // 2   CHILD   
            // 3   PERSON  
            // 4   FLAT
            // The Amount Type is available in the amountType object of the selected addon
            // ("AT", addon.amountType.value)

            //Post Types
            // 1   STAY   
            // 2   NIGHT  
            // The Post Type is available in the postType object of the selected addon
            // ("PT", addon.postType.value)

            //TODO: IN CASE OF DATA ERRORS MAKE FLAT STAY AS DEFAULT


            var baseRate = parseFloat(addonQty) * parseFloat(addon.price);
            var finalRate = baseRate;
            // Function to compute the amount per day of the selected addon 
            var amountPerday = (function getAmountPerDay() {
                //TODO: calculate rate based on the amount type
                if (addon.amountType.value == "PERSON") {
                    // Calculate the total number of occupants and multiply with base rate
                    // Total number of occupants doesnt count the infants!
                    return baseRate * ($scope.activeRoom.numAdults + $scope.activeRoom.numChildren);
                } else if (addon.amountType.value == "CHILD") {
                    //TODO : Calculate the total number of occupants and multiply with base rate
                    return baseRate * $scope.activeRoom.numChildren;;
                } else if (addon.amountType.value == "ADULT") {
                    //TODO : Calculate the total number of occupants and multiply with base rate
                    return baseRate * $scope.activeRoom.numAdults;
                }
                //fallback should happen if amount type is flat
                return baseRate;
            })();

            if (addon.postType.value == "NIGHT") {
                console.log("//TODO:Got to calculate based on amount type and then mutiply with nights");
                finalRate = amountPerday * $scope.reservationData.nights;
            } else {
                console.log("//TODO:Rate is incl of all days");
                finalRate = amountPerday;
            }

            // return false;

            var elemIndex = -1;
            $($scope.activeRoom.addons).each(function(index, elem) {
                if (elem.id == addon.id) {
                    elemIndex = index;
                }
            });

            if (elemIndex < 0) {
                var item = {};
                item.id = addon.id;
                item.title = addon.title;
                item.quantity = parseInt(addonQty);
                item.price = addon.price;
                $scope.activeRoom.addons.push(item);
            } else {
                $scope.activeRoom.addons[elemIndex].quantity += parseInt(addonQty);
            }
            // add selected addon amount to total stay cost
            $scope.reservationData.totalStayCost += finalRate;
            $scope.showEnhancementsPopup();
        }

        $scope.removeSelectedAddons = function(index) {
            // subtract selected addon amount from total stay cost
            $scope.reservationData.totalStayCost -= parseInt($scope.activeRoom.addons[index].quantity) * parseInt($scope.activeRoom.addons[index].price);
            $scope.activeRoom.addons.splice(index, 1);
            if ($scope.activeRoom.addons.length === 0) {
                $scope.closePopup();
            }
        }
        $scope.addons = [];
        $scope.fetchAddons = function(paramChargeGrpId) {
            var successCallBackFetchAddons = function(data) {
                $scope.addons = [];
                $scope.$emit("hideLoader");
                angular.forEach(data.results, function(item) {
                    if (item != null) {
                        var addonItem = {};
                        addonItem.id = item.id;
                        addonItem.isBestSeller = item.bestseller;
                        addonItem.category = item.charge_group.name;
                        addonItem.title = item.name;
                        addonItem.description = item.description;
                        addonItem.price = item.amount;
                        addonItem.stay = item.post_type.description;
                        addonItem.amountType = item.amount_type;
                        addonItem.postType = item.post_type;
                        $scope.addons.push(addonItem);
                    }
                });

            }
            var chargeGroupId = paramChargeGrpId == undefined ? '' : paramChargeGrpId;
            var is_bestseller = paramChargeGrpId == undefined ? true : false;
            var paramDict = {
                'charge_group_id': chargeGroupId,
                'is_bestseller': is_bestseller,
                'from_date': $scope.reservationData.arrivalDate,
                'to_date': $scope.reservationData.departureDate,
                'is_active': true,
                'is_not_rate_only': true
            };
            $scope.invokeApi(RVReservationAddonsSrv.fetchAddons, paramDict, successCallBackFetchAddons);
        }

        $scope.addonCategories = addonData.addonCategories;
        $scope.bestSellerEnabled = addonData.bestSellerEnabled;

        // first time fetch best seller addons
        // for fetching best sellers - call method without params ie. no charge group id
        // Best Sellers in not a real charge code [just hard coded charge group to fetch best sell addons]
        $scope.fetchAddons();

    }
]);