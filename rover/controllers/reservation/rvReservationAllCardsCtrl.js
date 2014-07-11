sntRover.controller('RVReservationAllCardsCtrl', ['$scope', 'RVReservationAllCardsSrv', 'RVReservationCardSrv', '$timeout', 'RVCompanyCardSrv', 'RVGuestCardSrv', 'ngDialog',
    function($scope, RVReservationAllCardsSrv, RVReservationCardSrv, $timeout, RVCompanyCardSrv, RVGuestCardSrv, ngDialog) {

        BaseCtrl.call(this, $scope);
        var resizableMinHeight = 90;
        var resizableMaxHeight = $(window).height() - resizableMinHeight;

        $scope.addNewCards = true;

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
                    saveCards();
                    $scope.handleDrawClosing();
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
            saveCards();
            $scope.handleDrawClosing();
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
                    // based on search values from base screen
                    // init respective search
                    if ($scope.searchData.guestCard.guestFirstName != '' || $scope.searchData.guestCard.guestLastName != '') {
                        $scope.openGuestCard();
                        $scope.searchGuest();
                    }
                    if (searchData.company.id != null) {
                        if ($scope.searchData.guestCard.guestFirstName == '' && $scope.searchData.guestCard.guestLastName == '') {
                            $scope.switchCard('company-card');
                        }
                        $scope.reservationDetails.companyCard.id = searchData.company.id;
                        $scope.initCompanyCard({
                            id: searchData.company.id
                        });
                    }
                    if (searchData.travelAgent.id != null) {
                        if ($scope.searchData.guestCard.guestFirstName == '' && $scope.searchData.guestCard.guestLastName == '') {
                            $scope.switchCard('travel-agent-card');
                        }
                        $scope.reservationDetails.travelAgent.id = searchData.travelAgent.id;
                        $scope.initTravelAgentCard({
                            id: searchData.travelAgent.id
                        });
                    }
                }
            } else {
                // populate cards
                $scope.closeGuestCard();
                if ($scope.reservationDetails.guestCard.id != "" && $scope.reservationDetails.guestCard.id != null) {
                    $scope.initGuestCard({
                        id: $scope.reservationDetails.guestCard.id
                    });
                }
                if ($scope.reservationDetails.companyCard.id != "" && $scope.reservationDetails.companyCard.id != null) {
                    $scope.initCompanyCard({
                        id: $scope.reservationDetails.companyCard.id
                    });
                }
                if ($scope.reservationDetails.travelAgent.id != "" && $scope.reservationDetails.travelAgent.id != null) {
                    $scope.initTravelAgentCard({
                        id: $scope.reservationDetails.travelAgent.id
                    });
                }
                $scope.reservationData.isSameCard = false;
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
                    'avatar': (guestData && guestData.image) || $scope.cardHeaderImage,
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
                                companyData.rate = item.current_contract;
                                companyData.rate.difference = (function() {
                                    if (parseInt(companyData.rate.based_on.value) < 0) {
                                        if (companyData.rate.based_on.type == "amount") {
                                            return "$" + (parseFloat(companyData.rate.based_on.value)) * -1 + " off ";
                                        } else {
                                            return (parseFloat(companyData.rate.based_on.value) * -1) + "%" + " off ";
                                        }

                                    }
                                    return "";
                                })();
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
                                travelAgentData.rate = item.current_contract;
                                travelAgentData.rate.difference = (function() {
                                    if (parseInt(travelAgentData.rate.based_on.value) < 0) {
                                        if (travelAgentData.rate.based_on.type == "amount") {
                                            return "$" + (parseFloat(travelAgentData.rate.based_on.value) * -1) + " off ";
                                        } else {
                                            return (parseFloat(travelAgentData.rate.based_on.value) * -1) + "%" + " off ";
                                        }

                                    }
                                    return "";
                                })();
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

        var resetReservationData = (function() {
            this.resetGuest = function() {
                $scope.reservationData.guest.id = "";
                $scope.reservationData.guest.firstName = "";
                $scope.reservationData.guest.lastName = "";
                $scope.reservationData.guest.city = "";
                $scope.reservationData.guest.loyaltyNumber = "";
                // update current controller scope
                $scope.guestFirstName = "";
                $scope.guestLastName = "";
                $scope.guestCity = "";
            }
            this.resetCompanyCard = function() {
                $scope.reservationData.company.id = "";
                $scope.reservationData.company.name = "";
                $scope.reservationData.company.corporateid = "";
                $scope.companyName = "";
                $scope.companyCity = "";
                $scope.reservationDetails.companyCard.id = "";
            }
            this.resetTravelAgent = function() {
                $scope.reservationData.travelAgent.id = "";
                $scope.reservationData.travelAgent.name = "";
                $scope.reservationData.travelAgent.iataNumber = "";
                $scope.travelAgentName = "";
                $scope.travelAgentCity = "";
                $scope.reservationDetails.travelAgent.id = "";
            }

            return {
                resetGuest: this.resetGuest,
                resetCompanyCard: this.resetCompanyCard,
                resetTravelAgent: this.resetTravelAgent
            }
        })();

        // DETACH CARD
        $scope.detachCard = function(cardType) {

            if ($scope.viewState.reservationStatus.confirm) {
                // Handle changes in the staycard
                if (cardType == 'travel_agent') {
                    $scope.$broadcast('travelAgentDetached');
                    $scope.viewState.pendingRemoval.status = true;
                    $scope.viewState.pendingRemoval.cardType = "travel_agent";
                } else if (cardType == 'company') {
                    $scope.$broadcast('companyCardDetached');
                    $scope.viewState.pendingRemoval.status = true;
                    $scope.viewState.pendingRemoval.cardType = "company";
                } else if (cardType == 'guest') {
                    $scope.$broadcast('guestCardDetached');
                    $scope.viewState.pendingRemoval.status = true;
                    $scope.viewState.pendingRemoval.cardType = "guest";
                }
            } else {
                if (cardType == "guest") {
                    resetReservationData.resetGuest();
                    $scope.$broadcast("guestCardDetached");
                } else if (cardType == "company") {
                    resetReservationData.resetCompanyCard();
                    $scope.reservationDetails.companyCard.id = "";
                    $scope.$broadcast("companyCardDetached");
                } else if (cardType == "travel_agent") {
                    resetReservationData.resetTravelAgent();
                    $scope.$broadcast("travelAgentDetached");
                }
            }
            console.log($scope.reservationDetails);
        }

        $scope.cardRemoved = function(card) {
            //reset Pending Flag
            $scope.viewState.pendingRemoval.status = false;
            $scope.viewState.pendingRemoval.cardType = "";
            // reset the id and the future reservation counts that were cached
            if (card == 'guest') {
                $scope.reservationDetails.guestCard.id = "";
                $scope.reservationDetails.guestCard.futureReservations = 0;
                var contactInfoData = {
                    'contactInfo': {},
                    'countries': $scope.countries,
                    'userId': "",
                    'avatar': "",
                    'guestId': "",
                    'vip': "" //TODO: check with API or the product team
                };
                $scope.guestCardData.contactInfo = contactInfoData.contactInfo;
                $scope.guestCardData.contactInfo.avatar = contactInfoData.avatar;
                $scope.guestCardData.contactInfo.vip = contactInfoData.vip;
                $scope.countriesList = contactInfoData.countries;
                $scope.guestCardData.userId = contactInfoData.userId;
                $scope.guestCardData.guestId = contactInfoData.guestId;
                $scope.guestCardData.contactInfo.birthday = null;
                resetReservationData.resetGuest();
            }
            if (card == 'company') {
                $scope.reservationDetails.companyCard.id = "";
                $scope.reservationDetails.companyCard.futureReservations = 0;
                resetReservationData.resetCompanyCard();
            } else if (card == 'travel_agent') {
                $scope.reservationDetails.travelAgent.id = "";
                $scope.reservationDetails.travelAgent.futureReservations = 0;
                resetReservationData.resetTravelAgent();
            }
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

            // Fetch the guest Card
            $scope.initGuestCard(guest);
            $scope.viewState.isAddNewCard = false;
            $scope.reservationDetails.guestCard.id = guest.id;

            if ($scope.viewState.reservationStatus.confirm) {
                // Handle changes in the staycard
                // Replace card
                if ($scope.reservationDetails.guestCard.futureReservations <= 0) {
                    $scope.replaceCardCaller('guest', guest, false);
                } else {
                    $scope.checkFuture('guest', guest);
                }
            }
        }

        $scope.handleDrawClosing = function() {
            if ($scope.viewState.isAddNewCard) {
                var cards = {
                    'guest-card': 'guest',
                    'company-card': 'company',
                    'travel-agent-card': 'travel_agent'
                }
                discardCard(cards[$scope.UICards[0]]);
            }
            if ($scope.viewState.reservationStatus.confirm && $scope.viewState.pendingRemoval.status) {
                $scope.removeCard($scope.viewState.pendingRemoval.cardType);
            }
        }

        $scope.selectCompany = function(company, $event) {
            $event.stopPropagation();
            // Update main reservation scope
            $scope.reservationData.company.id = company.id;
            $scope.reservationData.company.name = company.account_name;
            $scope.reservationData.company.corporateid = $scope.companyCorpId;

            // update current controller scopehandleDrawClosing
            $scope.companyName = company.account_name;
            $scope.companyCity = company.city;
            // $scope.closeGuestCard();
            $scope.reservationDetails.companyCard.id = company.id;
            $scope.initCompanyCard(company);
            $scope.viewState.isAddNewCard = false;
            console.log($scope.reservationData);
            if ($scope.viewState.reservationStatus.confirm) {
                // Handle changes in the staycard
                // Replace card
                if ($scope.reservationDetails.companyCard.futureReservations <= 0) {
                    $scope.replaceCardCaller('company', company, false);
                } else {
                    $scope.checkFuture('company', company);
                }
            }
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
            $scope.reservationDetails.travelAgent.id = travelAgent.id;
            $scope.initTravelAgentCard(travelAgent);
            $scope.viewState.isAddNewCard = false;

            if ($scope.viewState.reservationStatus.confirm) {
                // Handle changes in the staycard
                // Replace card
                if ($scope.reservationDetails.travelAgent.futureReservations <= 0) {
                    $scope.replaceCardCaller('travel_agent', travelAgent, false);
                } else {
                    $scope.checkFuture('travel_agent', travelAgent);
                }
            }
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
            //If this happens in the middle of a possible update
            //check if the draw is open and check if it is in search Mode
            if ($scope.cardVisible) {
                // call a update routine of the respective card here
                // possible values in $scope.UICards[0] : ['guest-card', 'company-card', 'travel-agent-card']
                // check in the update routine if the search mode is off
                saveCards();
            }
            // TODO: To check if the quest card needs to be closed
            // $scope.closeGuestCard();
        }

        var saveCards = function() {
            // CICO-7933
            if ($scope.UICards[0] == 'travel-agent-card') {
                $scope.$broadcast("saveTravelAgentContactInformation");
            } else if ($scope.UICards[0] == 'company-card') {
                $scope.$broadcast("saveCompanyContactInformation");
            } else {
                $scope.$broadcast('saveContactInfo');
                $scope.$broadcast('SAVELIKES');
            }
        }

        $scope.removeCard = function(card) {
            // This method returns the numnber of cards attached to the staycard
            var checkNumber = function() {
                var x = 0;
                _.each($scope.reservationDetails, function(d, i) {
                    if (typeof d.id != 'undefined' && d.id != '' && d.id != null) x++;
                })
                return x;
            }

            //Cannot Remove the last card... Tell user not to select another card
            if (checkNumber() > 1) {
                $scope.invokeApi(RVCompanyCardSrv.removeCard, {
                    'reservation': $scope.viewState.reservationStatus.number,
                    'cardType': card
                }, function() {
                    console.log('removeCard - success');
                    $scope.cardRemoved(card);
                    $scope.$emit('hideLoader');
                }, function() {
                    console.log('removeCard - failure');
                    $scope.$emit('hideLoader');
                });
            } else {
                //Bring up alert here
                if ($scope.viewState.pendingRemoval.status) {
                    $scope.viewState.pendingRemoval.status = false;
                    $scope.viewState.pendingRemoval.cardType = "";
                    // If user has not replaced a new card, keep this one. Else remove this card
                    // The below flag tracks the card and has to be reset once a new card has been linked, 
                    // along with a call to remove the flagged card
                    $scope.viewState.lastCardSlot = card;
                    var templateUrl = '/assets/partials/cards/alerts/cardRemoval.html';
                    ngDialog.open({
                        template: templateUrl,
                        className: 'ngdialog-theme-default stay-card-alerts',
                        scope: $scope,
                        closeByDocument: false,
                        closeByEscape: false
                    });
                }
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
            // Retain Search Keys
            $scope.guestCardData.contactInfo.first_name = $scope.searchData.guestCard.guestFirstName;
            $scope.guestCardData.contactInfo.last_name = $scope.searchData.guestCard.guestLastName;
            $scope.guestCardData.contactInfo.address = {};
            $scope.guestCardData.contactInfo.address.city = $scope.searchData.guestCard.guestCity;
            $scope.guestCardData.membership_no = $scope.searchData.guestCard.guestLoyaltyNumber;

            $scope.$broadcast('guestSearchStopped');
            $scope.$broadcast('guestCardAvailable');
            $scope.current = 'guest-contact';
            $scope.viewState.isAddNewCard = true;
        }

        $scope.createNewCompany = function() {
            $scope.companyContactInformation = $scope.getEmptyAccountData();
            $scope.reservationDetails.companyCard.id = "";
            $scope.reservationDetails.companyCard.futureReservations = 0;
            $scope.viewState.isAddNewCard = true;
            $scope.$broadcast('companyCardAvailable', true);

        }

        $scope.createNewTravelAgent = function() {
            $scope.travelAgentInformation = $scope.getEmptyAccountData();
            $scope.reservationDetails.travelAgent.id = "";
            $scope.reservationDetails.travelAgent.futureReservations = 0;
            $scope.viewState.isAddNewCard = true;
            $scope.$broadcast('travelAgentFetchComplete', true);
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
                    $scope.handleDrawClosing();
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
            $scope.viewState.pendingRemoval.status = false;
            $scope.viewState.pendingRemoval.cardType = "";
            $scope.initGuestCard({
                id: id
            });
        };

        $scope.checkFuture = function(cardType, card) {
            // Changing this reservation only will unlink the stay card from the previous company / travel agent card and assign it to the newly selected card. 
            // Changing all reservations will move all stay cards to the new card. 
            // This will only apply when a new company / TA card had been selected. 
            // If no new card has been selected, the change will only ever just apply to the current reservation and the above message should not display.
            // If multiple future reservations exist for the same Travel Agent / Company Card details, display message upon navigating away from the Stay Card 'Future reservations exist for the same Travel Agent / Company card.' 
            // With choice of 'Change this reservation only' and 'Change all Reservations'.
            var templateUrl = '/assets/partials/cards/alerts/futureReservationsAccounts.html';
            if (cardType == 'guest') {
                var templateUrl = '/assets/partials/cards/alerts/futureReservationsGuest.html';
            }

            ngDialog.open({
                template: templateUrl,
                className: 'ngdialog-theme-default stay-card-alerts',
                scope: $scope,
                closeByDocument: false,
                closeByEscape: false,
                data: JSON.stringify({
                    cardType: cardType,
                    card: card
                })
            });
        }

        $scope.replaceCardCaller = function(cardType, card, future) {
            $scope.replaceCard(cardType, card, future);
        }


        $scope.cardReplaced = function(card, cardData) {
            if (card == 'company') {
                $scope.reservationDetails.companyCard.id = cardData.id;
                $scope.initCompanyCard({
                    id: cardData.id
                });
                //clean search data
                $scope.searchData.companyCard.companyName = "";
                $scope.searchData.companyCard.companyCity = "";
                $scope.searchData.companyCard.companyCorpId = "";
                $scope.$broadcast('companySearchStopped');
            } else if (card == 'travel_agent') {
                $scope.reservationDetails.travelAgent.id = cardData.id;
                $scope.initTravelAgentCard({
                    id: cardData.id
                });
                // clean search data
                $scope.searchData.travelAgentCard.travelAgentName = "";
                $scope.searchData.travelAgentCard.travelAgentCity = "";
                $scope.searchData.travelAgentCard.travelAgentIATA = "";
                $scope.$broadcast('travelAgentSearchStopped');
            } else if (card == 'guest') {
                $scope.reservationDetails.guestCard.id = cardData.id;
                $scope.initGuestCard(cardData);
                $scope.searchData.guestCard.guestFirstName = "";
                $scope.searchData.guestCard.guestLastName = "";
                $scope.searchData.guestCard.guestCity = "";
                $scope.searchData.guestCard.guestLoyaltyNumber = "";
                $scope.$broadcast('guestSearchStopped');
            }
        }

        var discardCard = function(cardType, discard) {
            $scope.viewState.isAddNewCard = false;
            if (cardType == 'travel_agent') {
                $scope.$broadcast('travelAgentDetached');
            } else if (cardType == 'company') {
                $scope.$broadcast('companyCardDetached');
            } else if (cardType == 'guest') {
                $scope.$broadcast('guestCardDetached');
            }
        }

        $scope.replaceCard = function(card, cardData, future) {
            //Replace card with the selected one
            if ($scope.viewState.reservationStatus.number != null) {
                $scope.invokeApi(RVCompanyCardSrv.replaceCard, {
                    'reservation': $scope.viewState.reservationStatus.number,
                    'cardType': card,
                    'id': cardData.id,
                    'future': typeof future == 'undefined' ? false : future
                }, function() {
                    console.log('replaceCard - success');
                    $scope.cardRemoved(card);
                    $scope.cardReplaced(card, cardData);
                    if ($scope.viewState.lastCardSlot != "") {
                        $scope.removeCard($scope.viewState.lastCardSlot);
                        $scope.viewState.lastCardSlot = "";
                    }
                    $scope.$emit('hideLoader');
                }, function() {
                    console.log('replaceCard -failure');
                    $scope.cardRemoved();
                    $scope.$emit('hideLoader');
                });
            }
        }

        init();

    }
]);