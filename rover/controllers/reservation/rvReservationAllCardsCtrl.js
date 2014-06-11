sntRover.controller('RVReservationAllCardsCtrl', ['$scope', 'RVReservationAllCardsSrv', function($scope, RVReservationAllCardsSrv){
    
    BaseCtrl.call(this, $scope);
    var resizableMinHeight = 90;
    var resizableMaxHeight = $(window).height() - resizableMinHeight;
    
    var that = this;

    // initialize / set guest search fields value based on search data from base search screen
    $scope.guestFirstName = $scope.reservationData.guest.firstName;
    $scope.guestLastName = $scope.reservationData.guest.lastName;
    $scope.guestCity = '';
    $scope.guestLoyaltyNumber = '';

    // initialize company search fields
    $scope.companyName = '';
    $scope.companyCity = '';
    $scope.companyCorpId = '';

    // initialize travel-agent search fields
    $scope.travelAgentName = '';
    $scope.travelAgentCity = '';
    $scope.travelAgentIATA = '';

    /**
    * scroller options
    */
    $scope.cardVisible = false;
    $scope.resizableOptions = 
    {   
        minHeight: resizableMinHeight,
        maxHeight: resizableMaxHeight,
        handles: 's',
        resize: function( event, ui ) {
            if ($(this).height() > 120 && !$scope.cardVisible) { //against angular js principle, sorry :(              
                $scope.cardVisible = true;
                $scope.$apply();
            }
            else if($(this).height() <= 120 && $scope.cardVisible){
                $scope.cardVisible = false;
                $scope.$apply();
            }            
        },
        stop: function(event, ui){
            preventClicking = true;
            $scope.eventTimestamp = event.timeStamp;
        }
    }

    /**
    * function to open guest card
    */    
    $scope.openGuestCard = function(){
        $scope.cardVisible = true;
        $scope.guestCardHeight = resizableMaxHeight;
    };
    /**
    * function to close guest card
    */    
    $scope.closeGuestCard = function(){
        $scope.guestCardHeight = resizableMinHeight;
        $scope.cardVisible = false;
    };


    $scope.guestCardHeight = resizableMinHeight;
    if($scope.otherData.fromSearch && ($scope.guestFirstName != '')){
        $scope.openGuestCard();
        $scope.otherData.fromSearch = false;
    }


    
    // UICards first index will be active card
    $scope.UICards = ['guest-card', 'company-card', 'travel-agent-card'];

    // className based on UICards index
    var subCls = ['first', 'second', 'third'];

    $scope.UICardClass = function(from){
        // based on from (guest-card, company-card || travel-agent-card)
        // evaluate UICards return className(s) as string
        var cls = '';
        if (from !== $scope.UICards[0]) {
            cls = "change-card " + subCls[$scope.UICards.indexOf(from)];
        } else{
            cls = subCls[0];
        };
        return cls;
    }

    $scope.UICardContentCls = function(from){
        // evaluate UICards return card conten className(s) as string
        var cls = '';
        if (from !== $scope.UICards[0]) {
            cls = "hidden";
        } else{
            cls = 'visible';
        };
        return cls;
    }

    $scope.cardCls = function(){
        // evaluate 
        var cls = $scope.UICards[0];   //  current active card
        if ( $scope.cardVisible ) { cls += " open"; }
        return cls;
    }

    $scope.switchCard = function(from){
        //  based on from
        //  swap UICards array for guest-card, company-card & travel-agent-card
        var newCardIndex = $scope.UICards.indexOf(from);
        var currentCard = $scope.UICards[0];
        $scope.UICards[0] = from;
        $scope.UICards[newCardIndex] = currentCard;

    }

    $scope.searchGuest = function(){

        var successCallBackFetchGuest = function(data){
            $scope.$emit("hideLoader");
            $scope.guests = [];
            if(data.results.length>0){
                angular.forEach(data.results, function(item){
                    var guestData = {};
                    guestData.id = item.id;
                    guestData.firstName = item.first_name;
                    guestData.lastName = item.last_name;
                    guestData.address = {};
                    guestData.address.phone = item.home_phone;
                    guestData.address.city = item.address.city;
                    guestData.address.state = item.address.state;
                    guestData.address.postalCode = item.address.postal_code;
                    guestData.stayCount = item.stay_count;
                    guestData.lastStay = {};
                    guestData.lastStay.date = item.last_stay.date;
                    guestData.lastStay.room = item.last_stay.room;
                    guestData.lastStay.roomType = item.last_stay.room_type;
                    $scope.guests.push(guestData);
                });
            }
        }
        var paramDict = {
                            'first_name': $scope.guestFirstName,
                            'last_name': $scope.guestLastName,
                            'city': $scope.guestCity,
                            'membership_no': $scope.guestLoyaltyNumber
                        };
        $scope.invokeApi(RVReservationAllCardsSrv.fetchGuests, paramDict, successCallBackFetchGuest);
    }

    $scope.setGuest = function(guest, $event){
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
        $scope.closeGuestCard();
    }

    $scope.createNewGuest = function(){
        $scope.reservationData.guest.id = '';
        $scope.reservationData.guest.firstName = guest.firstName;
        $scope.reservationData.guest.lastName = guest.lastName;
        $scope.reservationData.guest.city = guest.address.city;
        $scope.reservationData.guest.loyaltyNumber = $scope.guestLoyaltyNumber;
        $scope.closeGuestCard();
    }


    /**
    * function to execute click on Guest card
    */
    $scope.clickedOnGuestCard = function($event){        
        if(getParentWithSelector($event, document.getElementsByClassName("ui-resizable-s")[0])){ 
            if($scope.cardVisible){
                $scope.closeGuestCard();
            }
            else{ 
                $scope.openGuestCard();
            } 

        }
    };


    $scope.searchCompany = function(){
        var successCallBackFetchCompanies = function(data){
            console.log('reached successCallBackFetchCompanies');
            console.log(data);
        }
        var paramDict = {
                            'name': $scope.companyName,
                            'city': $scope.companyCity,
                            'corporate_id': $scope.companyCorpId
                        };
        $scope.invokeApi(RVReservationAllCardsSrv.fetchCompaniesOrTravelAgents, paramDict, successCallBackFetchCompanies);
    }

    $scope.searchTravelAgent = function(){
        var successCallBackFetchTravelAgents = function(data){
            console.log('reached successCallBackFetchTravelAgents');
            console.log(data);
        }
        var paramDict = {
                            'name': $scope.travelAgentName,
                            'city': $scope.travelAgentCity,
                            'corporate_id': $scope.travelAgentIATA
                        };
        $scope.invokeApi(RVReservationAllCardsSrv.fetchCompaniesOrTravelAgents, paramDict, successCallBackFetchTravelAgents);
    }

}]);
