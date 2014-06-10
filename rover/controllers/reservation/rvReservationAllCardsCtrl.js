sntRover.controller('RVReservationAllCardsCtrl', ['$scope', 'RVReservationAllCardsSrv', function($scope, RVReservationAllCardsSrv){
    
    BaseCtrl.call(this, $scope);

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
            console.log(data);
        }
        var paramDict = {
                            'first_name': $scope.reservationData.guest.firstName,
                            'last_name': $scope.reservationData.guest.lastName,
                            'city': $scope.reservationData.guest.city,
                            'membership_no': $scope.reservationData.guest.loyaltyNumber
                        };
        $scope.invokeApi(RVReservationAllCardsSrv.fetchGuests, paramDict, successCallBackFetchGuest);
    }


}]);
