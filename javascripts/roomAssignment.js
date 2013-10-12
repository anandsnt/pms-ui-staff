roomCompleteList = {};
roomCompleteList.room_detils_list = [];

$(function($){ 
	GetRoomAssignmentList();
    $('#room-attributes .radio_filters').change(function(){
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
	var radioFeatureCount = $('#totalpreference_count').val();
    var featureList = [];
    var id = $("#room-attributes input#radio_0").val();
    for (var i = 0; i<radioFeatureCount ; i++){
    	if($('#room-attributes #radio_' + i).is(':checked')) {
            featureList.push($('#room-attributes #radio_' + i).val());
        }
    }
    applyFilters(featureList);
}
function applyFilters(featureList){
    roomList = roomCompleteList.room_detils_list;
	
    var filteredRoomList = [];
	for(var k = 0; k<roomList.length ; k++){
        var roomFeatures = roomList[k].room_features;
        var foundMatch = false;
        for(var j=0; j<featureList.length; j++){
            if(roomFeatures.indexOf(featureList[j])>= 0){
                if(!(foundMatch)){
                    filteredRoomList.push(roomList[k]);
                    foundMatch = true;
                }
            }
        }
        
    }
    console.log(filteredRoomList);
    displeFilteredRoomList(filteredRoomList);
    
    
}
function displeFilteredRoomList(filteredRoomList){
    console.log(JSON.stringify(filteredRoomList));

    $('#rooms-available ul').html("");


    for (var i=0; i<filteredRoomList.length; i++){
        var output = "<li><a href='reservation-card/check-in/'"+
         "class='back-button button white submit-value' data-value='100' data-transition='nested-view'"+
          "data-page='search'><span class='room-number ready'>"+filteredRoomList[i].room_number+"</span></a></li>";
        $('#rooms-available ul').append(output);        
    }

}