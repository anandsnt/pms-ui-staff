getGuestStatusMapped = function(reservationStatus){
    var viewStatus = "";
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