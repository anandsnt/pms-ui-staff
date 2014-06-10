sntRover.controller('RVReservationAllCardsCtrl', ['$scope', 'RVReservationAllCardsSrv', function($scope, RVReservationAllCardsSrv){
    
    BaseCtrl.call(this, $scope);
    $scope.guestFirstName = $scope.reservationData.guest.firstName;
    $scope.guestLastName = $scope.reservationData.guest.lastName;
    $scope.guestCity = '';
    $scope.guestLoyaltyNumber = '';
    /**
    * scroller options
    */
    $scope.cardVisible = false;
    $scope.resizableOptions = 
    {   
        minHeight: '90',
        maxHeight: screen.height -200,
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
                    // guestData.id = item.id;
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
                            'first_name': $scope.guestfirstName,
                            'last_name': $scope.guestLastName,
                            'city': $scope.guestCity,
                            'membership_no': $scope.guestLoyaltyNumber
                        };
        $scope.invokeApi(RVReservationAllCardsSrv.fetchGuests, paramDict, successCallBackFetchGuest);
    }

    $scope.setGuest = function(guest, $event){
        $event.stopPropagation();
        // $scope.reservationData.guest.id = guest.id;
        $scope.reservationData.guest.firstName = guest.firstName;
        $scope.reservationData.guest.lastName = guest.lastName;
        $scope.reservationData.guest.city = guest.address.city;
        $scope.reservationData.guest.loyaltyNumber = $scope.guestLoyaltyNumber;
    }

    $scope.changedTextbox = function(){
        alert('dddd');
    }

}]);
