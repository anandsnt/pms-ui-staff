var StayCard = function(){
  this.pageinit = function(){
    setUpStaycard();
  }

}

//Add the reservation details to the DOM.
function displayReservationDetails($href) {
  //get the current highlighted timeline
  //Not more than 5 resevation should be kept in DOM in a timeline.
  var currentTimeline = $('#reservation-timeline').find('.ui-state-active').attr('aria-controls');
  if ($('#' + currentTimeline + ' > div').length > 6 && !($($href).length > 0)) {
    $("#" + currentTimeline).find('div:nth-child(2)').remove();
  }
  //get the reservation id.
  var reservation = $href.split("-")[1];
  //if div not present in DOM, make ajax request
  if (!($($href).length > 0)) {
    $.ajax({
      type : 'GET',
      url : "/dashboard/reservation_details?reservation=" + reservation,
      dataType : 'html',
      timeout : 5000,
      success : function(data) {
        $("#" + currentTimeline).append(data);
      },
      error : function() {
      }
    }).done(function() {
    });
  }
}

function getParentBookingDetailes(clickedElement) {
  alert(clickedElement);
  var reservationDetails = {};
  var parentReservationElement = $('#' + clickedElement).closest('div[id^="reservation-content"]').attr('id');
  alert(parentReservationElement);
}

function updateGuestDetails(update_val, type) {
  var userId = $("#user_id").val();
  $guestCardJsonObj = {};
  $guestCardJsonObj['guest_id'] = $("#guest_id").val();
  $guestCardJsonObj['user'] = {};
  $guestFirstName = $guestCardJsonObj['user']['first_name'] = $("#gc-firstname").val();
  $guestLastName = $guestCardJsonObj['user']['last_name'] = $("#gc-lastname").val();
  $guestCardJsonObj['user']['addresses_attributes'] = [];
  $addresses_attributes = {};
  $guestCity = $addresses_attributes['city'] = $("#gc-location").val();
  $addresses_attributes['is_primary'] = true;
  $addresses_attributes['label'] = "HOME";
  $guestCardJsonObj['user']['addresses_attributes'].push($addresses_attributes);
  $guestCardJsonObj['user']['contacts_attributes'] = [];
  $contact_attributes = {};
  $contact_attributes['contact_type'] = "PHONE";
  $contact_attributes['label'] = "HOME";
  $guestPhone = $contact_attributes['value'] = $("#gc-phone").val();
  $contact_attributes['is_primary'] = true;
  $guestCardJsonObj['user']['contacts_attributes'].push($contact_attributes);
  $contact_attributes = {};
  $contact_attributes['contact_type'] = "EMAIL";
  $contact_attributes['label'] = "BUSINESS";
  $guestEmail = $contact_attributes['value'] = $("#gc-email").val();
  $contact_attributes['is_primary'] = true;
  $contact_attributes['id'] = "";
  $guestCardJsonObj['user']['contacts_attributes'].push($contact_attributes);

  console.log(JSON.stringify($guestCardJsonObj));

  $.ajax({
    type : 'PUT',
    url : '/guest_cards/' + userId,
    data : JSON.stringify($guestCardJsonObj),

    dataType : 'json',
    contentType : 'application/json',
    success : function(data) {
      //TODO: handle success state
      if (!$guestCardClickTime) {
        $("#guest_firstname").val($guestFirstName);
        $("#guest_lastname").val($guestLastName);
        $("#city").val($guestCity);
        $("#phone").val($guestPhone);
        $("#email").val($guestEmail);
      }
    },
    error : function(e) {
      //TODO: hande error cases
      console.log(e);
    }
  });

}
