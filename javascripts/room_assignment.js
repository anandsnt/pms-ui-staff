roomCompleteList = {};
roomCompleteList.room_detils_list = [];

$(function($){ 
    GetRoomAssignmentList();
    $('#room-attributes .radio_filters').change(function(){
        getFilterList();
    });
    $('#room-attributes .checkbox_filters').change(function(){
        getFilterList();
    });
    $('.rooms-listing #room_type_selectbox').change(function(){
        getFilterList()
    })

    


});

function GetRoomAssignmentList(){
    $.ajax({
        type:       'GET',
        url:        "/sample_json/room_assignment/room_assignment_list.json",
        dataType:   'json',
        timeout:    5000,
        success: function(data){
            roomCompleteList = data;
            getFilterList();
        },
        error: function(){
            roomCompleteList = {};
            roomCompleteList.room_detils_list = [];
            alert("failed to fetch json");
        }
    });
    
    
}

function getFilterList(){
    var featureList = [];

    var selctboxOption = $("#room_type_selectbox option:selected").val();
    if(!(selctboxOption === "all")){
        featureList.push(selctboxOption);
    }

    var radioFeatureCount = $('#pref_radio_count').val();
    for (var i = 0; i<radioFeatureCount ; i++){
        if($('#room-attributes #radio_' + i).is(':checked')) {
            featureList.push($('#room-attributes #radio_' + i).val());
        }
    }

    var checkboxFeatureCount = $('#pref_checkbox_count').val();
    for (var i = 0; i<checkboxFeatureCount ; i++){
        if($('#room-attributes #option_checkbox_' + i).is(':checked')) {
            featureList.push($('#room-attributes #option_checkbox_' + i).val());
        }
    }
    applyFilters(featureList);
}
function applyFilters(featureList){
    var matchCountRequired = featureList.length;
    var roomList = roomCompleteList.room_detils_list;
    
    var filteredRoomList = [];

    for(var k = 0; k<roomList.length ; k++){
        var roomFeatureMatch = 0;
        var roomFeatures = roomList[k].room_features;
        for(var j=0; j<featureList.length; j++){
            if(roomFeatures.indexOf(featureList[j])>= 0){
                roomFeatureMatch++;
            }
        }

        if(roomFeatureMatch == matchCountRequired){

            filteredRoomList.push(roomList[k]);
        }
        
    }
    displeFilteredRoomList(filteredRoomList);
    
    
}
function displeFilteredRoomList(filteredRoomList){
    $('#rooms-available ul').html("");

    for (var i=0; i<filteredRoomList.length; i++){
        var room_status_html ="" ;
        
        if(filteredRoomList[i].room_status == "ready"){
            room_status_html = "<span class='room-number ready'>"+filteredRoomList[i].room_number+"</span>";
        }
        else{
            room_status_html = "<span class='room-number not-ready'>"+filteredRoomList[i].room_number +"</span>"+
            "<span class='room-status not-ready'>"+filteredRoomList[i].room_status_explained +"</span>";    
        }
        var output = "<li><a id = 'room-list-item' href='#'"+
            "class='back-button button white submit-value' data-value='' data-transition='nested-view'"+
            "data-page='search'>"+room_status_html+"</a></li>";
            $('#rooms-available ul').append(output);      

       
    }

    $('#rooms-available #room-list-item').click(function(){
        
        var roomSelected = $(this).find(">:first-child").html();
        var currentReservation = $('#roomassignment-ref-id').val();
        $('#reservation-'+currentReservation+'-room-number').html(roomSelected);
    });  

 
}