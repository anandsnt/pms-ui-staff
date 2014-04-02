/** Method for getting the guest status icon class
  @return the guest status icon class  
*/
getGuestStatusMapped = function(reservationStatus, isLateCheckout){
    var viewStatus = "";
    //If the guest is opted for late checkout
    if(isLateCheckout == "true"){
        return "late-check-out";
    }

    //Determine the guest status class based on the reservation status
    if("RESERVED" == reservationStatus){
        viewStatus = "arrival";
    }else if("CHECKING_IN" == reservationStatus){
        viewStatus = "check-in";
    }else if("CHECKEDIN" == reservationStatus){
        viewStatus = "inhouse";
    }else if("CHECKEDOUT" == reservationStatus){
        viewStatus = "departed";
    }else if("CHECKING_OUT" == reservationStatus){
        viewStatus = "check-out";
    }else if("CANCELED" == reservationStatus){
        viewStatus = "cancel";
    }else if(("NOSHOW" == reservationStatus)||("NOSHOW_CURRENT" == reservationStatus)){
        viewStatus = "no-show";
    }

    return viewStatus;

}

doLogout = function(){
    $window.location.href = '/logout' ;

}