sntRover.controller('RVReservationAllCardsCtrl', ['$scope', 'RVReservationAllCardsSrv', 'RVReservationCardSrv', '$timeout', 'RVCompanyCardSrv', 'RVGuestCardSrv',
    function($scope, RVReservationAllCardsSrv, RVReservationCardSrv, $timeout, RVCompanyCardSrv, RVGuestCardSrv) {

        BaseCtrl.call(this, $scope);
        var resizableMinHeight = 90;
        var resizableMaxHeight = $(window).height() - resizableMinHeight;

        $scope.addNewCards = true;

        $scope.viewState = {
            isAddNewCard: false
        };

        $scope.cardSaved = function() {
            $scope.viewState.isAddNewCard = false;
        }

        var that = this;

        // initialize / set guest search fields value based on search data from base search screen
        $scope.guestFirstName = $scope.reservationData.guest.firstName;
        $scope.guestLastName = $scope.reservationData.guest.lastName;
        $scope.guestCity = '';
        $scope.guestLoyaltyNumber = '';
        $scope.guestSearchIntiated = false;

        // initialize company search fields
        $scope.companyName = $scope.reservationData.company.name;
        $scope.companyCity = '';
        $scope.companyCorpId = '';
        $scope.companySearchIntiated = false;

        // initialize travel-agent search fields
        $scope.travelAgentName = $scope.reservationData.travelAgent.name;
        $scope.travelAgentCity = '';
        $scope.travelAgentIATA = '';
        $scope.travelAgentSearchIntiated = false;

        $scope.cardHeaderImage = '/assets/avatar-trans.png';

        /**
         * scroller options
         */
        $scope.cardVisible = false;
        $scope.resizableOptions = {
            minHeight: resizableMinHeight,
            maxHeight: resizableMaxHeight,
            handles: 's',
            resize: function(event, ui) {
                if ($(this).height() > 120 && !$scope.cardVisible) { //against angular js principle, sorry :(              
                    $scope.cardVisible = true;
                    $scope.$apply();
                } else if ($(this).height() <= 120 && $scope.cardVisible) {
                    $scope.cardVisible = false;
                    $scope.checkEditMode();
                    $scope.$apply();
                }
            },
            stop: function(event, ui) {
                preventClicking = true;
                $scope.eventTimestamp = event.timeStamp;
            }
        }

        $scope.checkEditMode = function() {
            if ($scope.viewState.isAddNewCard) {
                console.log("Display pop up!" + $scope.UICards[0]);
                // Discard the card Right Here
                // 'guest-card', 'company-card', 'travel-agent-card'
                var cards = {
                    'guest-card': 'guest',
                    'company-card': 'company',
                    'travel-agent-card': 'travel_agent'
                }
                $scope.detachCard(cards[$scope.UICards[0]]);
                $scope.viewState.isAddNewCard = false;
            }
            console.log("Data", $scope.reservationData);
            console.log("Details", $scope.reservationDetails);
        }

        /**
         * function to open guest card
         */
        $scope.openGuestCard = function() {
            $scope.cardVisible = true;
            $scope.guestCardHeight = resizableMaxHeight;
        };
        /**
         * function to close guest card
         */
        $scope.closeGuestCard = function() {
            $scope.guestCardHeight = resizableMinHeight;
            $scope.checkEditMode();
            $scope.cardVisible = false;
        };


        $scope.guestCardHeight = resizableMinHeight;

        // UICards first index will be active card
        $scope.UICards = ['guest-card', 'company-card', 'travel-agent-card'];

        // className based on UICards index
        var subCls = ['first', 'second', 'third'];

        $scope.UICardClass = function(from) {
            // based on from (guest-card, company-card || travel-agent-card)
            // evaluate UICards return className(s) as string
            var cls = '';
            if (from !== $scope.UICards[0]) {
                cls = "change-card " + subCls[$scope.UICards.indexOf(from)];
            } else {
                cls = subCls[0];
            };
            return cls;
        }

        $scope.UICardContentCls = function(from) {
            // evaluate UICards return card conten className(s) as string
            var cls = '';
            if (from !== $scope.UICards[0]) {
                cls = "hidden";
            } else {
                cls = 'visible';
            };
            return cls;
        }

        $scope.cardCls = function() {
            // evaluate 
            var cls = $scope.UICards[0]; //  current active card
            if ($scope.cardVisible) {
                cls += " open";
            }
            return cls;
        }

        $scope.switchCard = function(from) {
            //  based on from
            //  swap UICards array for guest-card, company-card & travel-agent-card
            var newCardIndex = $scope.UICards.indexOf(from);
            var currentCard = $scope.UICards[0];
            $scope.UICards[0] = from;
            $scope.UICards[newCardIndex] = currentCard;
        }

        $scope.UICards = ['guest-card', 'company-card', 'travel-agent-card'];

        //INITS
        var init = function() {
            if (!$scope.reservationData.isSameCard) {
                // open search list card if any of the search fields are entered on main screen
                var searchData = $scope.reservationData;
                if ($scope.searchData.guestCard.guestFirstName != '' || $scope.searchData.guestCard.guestLastName != '' || searchData.company.id != null || searchData.travelAgent.id != null) {
                    $scope.openGuestCard();
                    // based on search values from base screen
                    // init respective search
                    if ($scope.searchData.guestCard.guestFirstName != '' || $scope.searchData.guestCard.guestLastName != '') {
                        $scope.searchGuest();
                    } else if (searchData.company.id != null) {
                        $scope.switchCard('company-card');
                        $scope.reservationDetails.companyCard.id = searchData.company.id;
                        $scope.initCompanyCard({
                            id: searchData.company.id
                        });
                    } else if (searchData.travelAgent.id != null) {
                        $scope.switchCard('travel-agent-card');
                        $scope.reservationDetails.travelAgent.id = searchData.travelAgent.id;
                        $scope.initTravelAgentCard({
                            id: searchData.travelAgent.id
                        });
                    }
                }
            }

            if ($scope.otherData.fromSearch) {
                $scope.otherData.fromSearch = false;
            }


        }

        $scope.initGuestCard = function(guestData) {
            // passReservationParams
            //TODO : Once this works pull it to a separate method 
            var fetchGuestcardDataSuccessCallback = function(data) {
                $scope.$emit('hideLoader');
                var contactInfoData = {
                    'contactInfo': data,
                    'countries': $scope.countries,
                    'userId': guestData.id,
                    'avatar': guestData.image,
                    'guestId': null,
                    'vip': false //TODO: check with API or the product team
                };
                // // $scope.$emit('guestCardUpdateData', contactInfoData);
                $scope.guestCardData.contactInfo = contactInfoData.contactInfo;
                $scope.guestCardData.contactInfo.avatar = contactInfoData.avatar;
                $scope.guestCardData.contactInfo.vip = contactInfoData.vip;
                $scope.countriesList = $scope.countries;
                $scope.guestCardData.userId = contactInfoData.userId;
                $scope.guestCardData.guestId = contactInfoData.guestId;
                $scope.guestCardData.contactInfo.birthday = data.birthday;
                var guestInfo = {
                    "user_id": contactInfoData.userId,
                    "guest_id": null
                };
                $scope.searchData.guestCard.guestFirstName = "";
                $scope.searchData.guestCard.guestLastName = "";
                $scope.searchData.guestCard.guestCity = "";
                $scope.searchData.guestCard.guestLoyaltyNumber = "";
                $scope.guestCardData.contactInfo.user_id = contactInfoData.userId;
                $scope.$broadcast('guestSearchStopped');
                $scope.$broadcast('guestCardAvailable');
                $scope.showGuestPaymentList(guestInfo);
                $scope.decloneUnwantedKeysFromContactInfo = function() {
                    var unwantedKeys = ["address", "birthday", "country",
                        "is_opted_promotion_email", "job_title",
                        "mobile", "passport_expiry",
                        "passport_number", "postal_code",
                        "reservation_id", "title", "user_id",
                        "works_at", "birthday"
                    ];
                    var declonedData = dclone($scope.guestCardData.contactInfo, unwantedKeys);
                    return declonedData;
                };

                /**
                 *  init guestcard header data
                 */
                var declonedData = $scope.decloneUnwantedKeysFromContactInfo();
                var currentGuestCardHeaderData = declonedData;
                $scope.current = 'guest-contact';
                $scope.$broadcast("SHOWGUESTLIKESINFO");
            };
            var fetchGuestcardDataFailureCallback = function(data) {
                $scope.$emit('hideLoader');
            };

            var param = {
                'id': guestData.id
            };
            $scope.invokeApi(RVReservationCardSrv.getGuestDetails, param, fetchGuestcardDataSuccessCallback, fetchGuestcardDataFailureCallback, 'NONE');
        }

        // fetch reservation company card details 
        $scope.initCompanyCard = function(companyData) {
            var companyCardFound = function(data) {
                $scope.$emit("hideLoader");
                data.id = $scope.reservationDetails.companyCard.id;
                $scope.companyContactInformation = data;
                $scope.reservationDetails.companyCard.futureReservations = data.future_reservation_count;
                $scope.$broadcast('companyCardAvailable');
            };
            //  companycard defaults to search mode 
            //  Hence, do API call only if a company card ID is returned
            if ($scope.reservationDetails.companyCard.id != '' && $scope.reservationDetails.companyCard.id != null) {
                var param = {
                    'id': companyData.id
                };
                $scope.invokeApi(RVCompanyCardSrv.fetchContactInformation, param, companyCardFound);
            }
        }

        // fetch reservation travel agent card details
        $scope.initTravelAgentCard = function(travelAgent) {
            var successCallbackOfInitialFetch = function(data) {
                $scope.$emit("hideLoader");
                data.id = $scope.reservationDetails.travelAgent.id;
                $scope.travelAgentInformation = data;
                $scope.reservationDetails.travelAgent.futureReservations = data.future_reservation_count;
                $scope.$broadcast('travelAgentFetchComplete');
                console.log($scope.reservationDetails);

            };
            //  TAcard defaults to search mode 
            //  Hence, do API call only if a company card ID is returned
            if ($scope.reservationDetails.travelAgent.id != '' && $scope.reservationDetails.travelAgent.id != null) {
                var param = {
                    'id': travelAgent.id
                };
                $scope.invokeApi(RVCompanyCardSrv.fetchContactInformation, param, successCallbackOfInitialFetch);
            }
        }

        // SEARCHES
        $scope.searchGuest = function() {
            var successCallBackFetchGuest = function(data) {
                $scope.$emit("hideLoader");
                $scope.guestSearchIntiated = true;
                $scope.searchedGuests = [];
                if (data.results.length > 0) {
                    angular.forEach(data.results, function(item) {
                        var guestData = {};
                        guestData.id = item.id;
                        guestData.firstName = item.first_name;
                        guestData.lastName = item.last_name;
                        guestData.image = item.image_url;
                        if (item.address != null) {
                            guestData.address = {};
                            guestData.address.city = item.address.city;
                            guestData.address.state = item.address.state;
                            guestData.address.postalCode = item.address.postal_code;
                        }
                        guestData.stayCount = item.stay_count;
                        guestData.lastStay = {};
                        guestData.phone = item.home_phone;
                        guestData.lastStay.date = item.last_stay.date;
                        guestData.lastStay.room = item.last_stay.room;
                        guestData.lastStay.roomType = item.last_stay.room_type;
                        $scope.searchedGuests.push(guestData);
                    });
                }
                $scope.$broadcast('guestSearchInitiated');
            }
            if ($scope.searchData.guestCard.guestFirstName != '' || $scope.searchData.guestCard.guestLastName != '' || $scope.searchData.guestCard.guestCity != '' || $scope.searchData.guestCard.guestLoyaltyNumber != '') {
                var paramDict = {
                    'first_name': $scope.searchData.guestCard.guestFirstName,
                    'last_name': $scope.searchData.guestCard.guestLastName,
                    'city': $scope.searchData.guestCard.guestCity,
                    'membership_no': $scope.searchData.guestCard.guestLoyaltyNumber
                };
                $scope.invokeApi(RVReservationAllCardsSrv.fetchGuests, paramDict, successCallBackFetchGuest);
            } else {
                $scope.guestSearchIntiated = false;
                $scope.searchedGuests = [];
                $scope.$apply();
                $scope.$broadcast('guestSearchStopped');
            }
        }

        $scope.searchCompany = function() {
            var successCallBackFetchCompanies = function(data) {
                $scope.$emit("hideLoader");
                $scope.companySearchIntiated = true;
                $scope.searchedCompanies = [];
                if (data.accounts.length > 0) {
                    angular.forEach(data.accounts, function(item) {
                        if (item.account_type === 'COMPANY') {
                            var companyData = {};
                            companyData.id = item.id;
                            companyData.account_name = item.account_name;
                            companyData.logo = item.company_logo;
                            if (item.address != null) {
                                companyData.address = {};
                                companyData.address.postalCode = item.address.postal_code;
                                companyData.address.city = item.address.city;
                                companyData.address.state = item.address.state;
                            }
                            if (item.current_contract != null) {
                                companyData.rate = item.current_contract.name;
                            }
                            companyData.email = item.email;
                            companyData.phone = item.phone;
                            $scope.searchedCompanies.push(companyData);
                        }
                    });
                }
                $scope.$broadcast('companySearchInitiated');
            }
            if ($scope.searchData.companyCard.companyName != '' || $scope.searchData.companyCard.companyCity != '' || $scope.searchData.companyCard.companyCorpId != '') {
                var paramDict = {
                    'name': $scope.searchData.companyCard.companyName,
                    'city': $scope.searchData.companyCard.companyCity,
                    'corporate_id': $scope.searchData.companyCard.companyCorpId
                };
                $scope.invokeApi(RVReservationAllCardsSrv.fetchCompaniesOrTravelAgents, paramDict, successCallBackFetchCompanies);
            } else {
                $scope.companySearchIntiated = false;
                $scope.searchedCompanies = [];
                $scope.$apply();
                $scope.$broadcast('companySearchStopped');
            }
        }

        $scope.searchTravelAgent = function() {
            var successCallBackFetchTravelAgents = function(data) {
                $scope.$emit("hideLoader");
                $scope.travelAgentSearchIntiated = true;
                $scope.searchedtravelAgents = [];
                if (data.accounts.length > 0) {
                    angular.forEach(data.accounts, function(item) {
                        if (item.account_type === 'TRAVELAGENT') {
                            var travelAgentData = {};
                            travelAgentData.id = item.id;
                            travelAgentData.account_name = item.account_name;
                            // travelAgentData.lastName = item.account_last_name;
                            travelAgentData.logo = item.company_logo;
                            if (item.address != null) {
                                travelAgentData.address = {};
                                travelAgentData.address.postalCode = item.address.postal_code;
                                travelAgentData.address.city = item.address.city;
                                travelAgentData.address.state = item.address.state;
                            }
                            if (item.current_contract != null) {
                                travelAgentData.rate = item.current_contract.name;
                            }
                            travelAgentData.email = item.email;
                            travelAgentData.phone = item.phone;
                            $scope.searchedtravelAgents.push(travelAgentData);
                        }
                    });
                }
                $scope.$broadcast('travelAgentSearchInitiated');
            }
            if ($scope.searchData.travelAgentCard.travelAgentName != '' || $scope.searchData.travelAgentCard.travelAgentCity != '' || $scope.searchData.travelAgentCard.travelAgentIATA != '') {
                var paramDict = {
                    'name': $scope.searchData.travelAgentCard.travelAgentName,
                    'city': $scope.searchData.travelAgentCard.travelAgentCity,
                    'corporate_id': $scope.searchData.travelAgentCard.travelAgentIATA
                };
                $scope.invokeApi(RVReservationAllCardsSrv.fetchCompaniesOrTravelAgents, paramDict, successCallBackFetchTravelAgents);
            } else {
                $scope.searchedtravelAgents = [];
                $scope.travelAgentSearchIntiated = false;
                $scope.$broadcast('travelAgentSearchStopped');
            }
        }

        // DETACH CARD
        $scope.detachCard = function(cardType) {
            if (cardType == "guest") {
                // Update main reservation scope
                $scope.reservationData.guest.id = "";
                $scope.reservationData.guest.firstName = "";
                $scope.reservationData.guest.lastName = "";
                $scope.reservationData.guest.city = "";
                $scope.reservationData.guest.loyaltyNumber = "";

                // update current controller scope
                $scope.guestFirstName = "";
                $scope.guestLastName = "";
                $scope.guestCity = "";
                $scope.cardHeaderImage = "";
                $scope.$broadcast("guestCardDetached");
            } else if (cardType == "company") {
                // Update main reservation scope
                $scope.reservationData.company.id = "";
                $scope.reservationData.company.name = "";
                $scope.reservationData.company.corporateid = "";

                // update current controller scope
                $scope.companyName = "";
                $scope.companyCity = "";
                // $scope.closeGuestCard();
                $scope.reservationDetails.companyCard.id = "";
                $scope.$broadcast("companyCardDetached");
            } else if (cardType == "travel_agent") {
                // Update main reservation scope
                $scope.reservationData.travelAgent.id = "";
                $scope.reservationData.travelAgent.name = "";
                $scope.reservationData.travelAgent.iataNumber = "";

                // update current controller scope
                $scope.travelAgentName = "";
                $scope.travelAgentCity = "";
                // $scope.closeGuestCard();
                $scope.reservationDetails.travelAgent.id = "";
                $scope.$broadcast("travelAgentDetached");
            }
            console.log($scope.reservationDetails);
        }

        // GUEST TABS
        //TODO: Find a way to move this into the child controller 
        $scope.guestCardTabSwitch = function(tab) {
            if ($scope.current === 'guest-contact' && tab !== 'guest-contact') {
                if ($scope.viewState.isAddNewCard) {
                    $scope.$broadcast("showSaveMessage");
                } else {
                    $scope.$broadcast('saveContactInfo');
                }
            };
            if ($scope.current === 'guest-like' && tab !== 'guest-like') {
                $scope.$broadcast('SAVELIKES');

            };
            if (tab === 'guest-credit') {
                $scope.$broadcast('PAYMENTSCROLL');
            }
            $scope.$broadcast('REFRESHLIKESSCROLL');
            if (!$scope.viewState.isAddNewCard) {
                $scope.current = tab;
            }
        };

        // SELECTS

        $scope.selectGuest = function(guest, $event) {
            $event.stopPropagation();
            // Update main reservation scope
            $scope.reservationData.guest.id = guest.id;
            $scope.reservationData.guest.firstName = guest.firstName;
            $scope.reservationData.guest.lastName = guest.lastName;
            $scope.reservationData.guest.city = guest.address.city;
            $scope.reservationData.guest.loyaltyNumber = $scope.guestLoyaltyNumber;

            // update current controller scope
            $scope.guestFirstName = guest.firstName;
            $scope.guestLastName = guest.lastName;
            $scope.guestCity = guest.address.city;
            $scope.cardHeaderImage = guest.image;
            //$scope.closeGuestCard();
            // Fetch the guest Card
            $scope.initGuestCard(guest);
            $scope.viewState.isAddNewCard = false;
            $scope.reservationDetails.guestCard.id = guest.id;
            console.log($scope.reservationData);
        }

        $scope.selectCompany = function(company, $event) {
            $event.stopPropagation();
            // Update main reservation scope
            $scope.reservationData.company.id = company.id;
            $scope.reservationData.company.name = company.account_name;
            $scope.reservationData.company.corporateid = $scope.companyCorpId;

            // update current controller scope
            $scope.companyName = company.account_name;
            $scope.companyCity = company.city;
            // $scope.closeGuestCard();
            $scope.reservationDetails.companyCard.id = company.id;
            $scope.initCompanyCard(company);
            $scope.viewState.isAddNewCard = false;
            console.log($scope.reservationData);
        }

        $scope.selectTravelAgent = function(travelAgent, $event) {
            $event.stopPropagation();
            // Update main reservation scope
            $scope.reservationData.travelAgent.id = travelAgent.id;
            $scope.reservationData.travelAgent.name = travelAgent.account_name;
            $scope.reservationData.travelAgent.iataNumber = $scope.travelAgentIATA;

            // update current controller scope
            $scope.travelAgentName = travelAgent.account_name;
            $scope.travelAgentCity = travelAgent.city;
            // $scope.closeGuestCard();
            $scope.reservationDetails.travelAgent.id = travelAgent.id;
            $scope.initTravelAgentCard(travelAgent);
            $scope.viewState.isAddNewCard = false;
            console.log($scope.reservationData);
        }


        /**
         * function to execute click on Guest card
         */
        $scope.clickedOnGuestCard = function($event) {
            if (getParentWithSelector($event, document.getElementsByClassName("ui-resizable-s")[0])) {
                if ($scope.cardVisible) {
                    $scope.closeGuestCard();
                } else {
                    $scope.openGuestCard();
                }

            }
        };

        $scope.checkOutsideClick = function(targetElement) {
            if ($(targetElement).closest(".stay-card-alerts").length < 1 && $(targetElement).closest(".guest-card").length < 1) {
                // $scope.closeGuestCard();
            }
        }

        // CREATES
        $scope.createNewGuest = function() {
            // create an empty dataModel for the guest
            var contactInfoData = {
                'contactInfo': {},
                'countries': $scope.countries,
                'userId': "",
                'avatar': "",
                'guestId': "",
                'vip': "" //TODO: check with API or the product team
            };
            // // $scope.$emit('guestCardUpdateData', contactInfoData);
            $scope.guestCardData.contactInfo = contactInfoData.contactInfo;
            $scope.guestCardData.contactInfo.avatar = contactInfoData.avatar;
            $scope.guestCardData.contactInfo.vip = contactInfoData.vip;
            $scope.countriesList = contactInfoData.countries;
            $scope.guestCardData.userId = contactInfoData.userId;
            $scope.guestCardData.guestId = contactInfoData.guestId;
            $scope.guestCardData.contactInfo.birthday = null;
            var guestInfo = {
                "user_id": "",
                "guest_id": ""
            };
            $scope.$broadcast('guestSearchStopped');
            $scope.$broadcast('guestCardAvailable');
            $scope.current = 'guest-contact';
            $scope.viewState.isAddNewCard = true;
        }

        $scope.createNewCompany = function() {
            $scope.companyContactInformation = $scope.getEmptyAccountData();
            // $scope.companyContactInformation.account_details.account_name = $scope.searchData.companyCard.companyName;
            $scope.reservationDetails.companyCard.id = "";
            $scope.reservationDetails.companyCard.futureReservations = 0;
            $scope.viewState.isAddNewCard = true;
            $scope.$broadcast('companyCardAvailable');

        }

        $scope.createNewTravelAgent = function() {
            $scope.travelAgentInformation = $scope.getEmptyAccountData();
            // $scope.travelAgentInformation.account_details.account_name = $scope.searchData.travelAgentCard.companyName;
            $scope.reservationDetails.travelAgent.id = "";
            $scope.reservationDetails.travelAgent.futureReservations = 0;
            $scope.viewState.isAddNewCard = true;
            $scope.$broadcast('travelAgentFetchComplete');
        }

        $scope.guestCardClick = function($event) {
            var element = $event.target;
            $event.stopPropagation();
            $event.stopImmediatePropagation();
            if (getParentWithSelector($event, document.getElementsByClassName("ui-resizable-handle")[0])) {
                if (parseInt($scope.eventTimestamp)) {
                    if (($event.timeStamp - $scope.eventTimestamp) < 100) {
                        return;
                    }
                }
                if (!$scope.guestCardVisible) {
                    $("#guest-card").css("height", $scope.windowHeight - 90);
                    $scope.guestCardVisible = true;
                    $scope.$broadcast('CONTACTINFOLOADED');
                    $scope.$emit('GUESTCARDVISIBLE', true);
                } else {
                    $("#guest-card").css("height", $scope.resizableOptions.minHeight);
                    $scope.guestCardVisible = false;
                    $scope.$emit('GUESTCARDVISIBLE', false);
                }
            } else {
                if (getParentWithSelector($event, document.getElementById("guest-card-content"))) {
                    /**
                     * handle click on tab navigation bar.
                     */
                    // // To make sure card gets saved on entering the last name itself
                    // $scope.$broadcast('SAVELIKES');
                    // $scope.$broadcast('saveContactInfo');
                    if ($event.target.id === 'guest-card-tabs-nav') {
                        $scope.$broadcast('saveContactInfo');
                        $scope.$broadcast('SAVELIKES');
                    } else
                        return;
                } else {
                    // $scope.$broadcast('SAVELIKES');
                    // $scope.$broadcast('saveContactInfo');
                }
            }
        };

        $scope.showGuestPaymentList = function(guestInfo) {
            var userId = guestInfo.user_id,
                guestId = guestInfo.guest_id;
            var paymentSuccess = function(paymentData) {
                $scope.$emit('hideLoader');

                var paymentData = {
                    "data": paymentData,
                    "user_id": userId,
                    "guest_id": guestId
                };
                $scope.$emit('GUESTPAYMENTDATA', paymentData);
                $scope.$emit('SHOWGUESTLIKES');
            };
            $scope.invokeApi(RVGuestCardSrv.fetchGuestPaymentData, userId, paymentSuccess, '', 'NONE');
        };

        $scope.clickedDiscardCard = function(cardType) {
            $scope.detachCard(cardType);
            $scope.viewState.isAddNewCard = false;
        }

        $scope.clickedSaveCard = function(cardType) {
            if (cardType == "guest") {
                $scope.$broadcast("saveContactInfo");
            }
        }

        $scope.newGuestAdded = function(id) {
            $scope.viewState.isAddNewCard = false;
            $scope.initGuestCard({
                id: id
            });
        };

        init();

    }
]);