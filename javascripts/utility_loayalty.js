var $selectedLoyaltyProgram ="";
var $selectedLoyaltyType ="";

$(function() {
	ffProgramsList = [];
	hlProgramsList = [];
  	var $url_ffp = '/user_memberships/get_available_ffps.json';
		$url_hlp = '/user_memberships/get_available_hlps.json';
				
	fetchLoyaltyProgramData($url_ffp,'ffp');
	fetchLoyaltyProgramData($url_hlp,'hlp');
});

//To fetch the ffp or hlp list
function fetchLoyaltyProgramData(url,type){
	$.ajax({
		url : url,
		type : 'GET',
		success : function(data) {
			if(type == 'ffp'){
				ffProgramsList = data;
			}
			else if(type == 'hlp'){
				hlProgramsList = data;
			}
			console.log(data);
		},
		error : function() {
			console.log("error");
		}
	});
}

function updateServerForNewLoyalty(postData, successCallback, type){
	console.log(JSON.stringify(postData));
	$.ajax({
		type: "POST",
		url: '/user_memberships',
		data: postData,
		dataType: 'json',
		success: function(response) {
			if((response.errors)!== null && (response.errors.length > 0)){
				alert(response.errors[0]);
				//Remove the element from DOM
				if(type == "FFP"){
					$("#loyalty-type-flyer .add-new-button").prev("a").remove();
					$("#stay-card-loyalty #loyalty optgroup").last().prev("option").remove();
					
				}else if(type == "HLP"){
					$("#loyalty-type-hotel .add-new-button").prev("a").remove();
					$("#stay-card-loyalty #loyalty option").last().remove();
				}
				clearSelectionUI();
			}else{
				//Insert the response id to the new DOM element
				successCallback(response.data);
			}
		},
		error: function(response){
			if(type == "FFP"){
				$("#loyalty-type-flyer .add-new-button").prev("a").remove();
			}else if(type == "HLP"){
				$("#loyalty-type-hotel .add-new-button").prev("a").remove();
			}
		}
	 });
}

//populate the airline list for frequent flier program add new popup
function addFFPSelectOptions(selector){
	$.each(ffProgramsList, function(key, airline) {
		var airlineOptions ='<option value="'+ airline.ff_value +'">' + airline.ff_description+ '</option>'
		$(selector).append(airlineOptions);
	});
};

//populate the loyalty type list for hotel loyalty program add new popup
function addHLPSelectOptions(selector){
	$.each(hlProgramsList, function(key, loyaltyType) {
		var programTypes ='<option value="'+ loyaltyType.hl_value +'">' + loyaltyType.hl_description+ '</option>'
		$(selector).append(programTypes);
	});
}

function updateHLPLoyaltyUI($type,$code,$level,$name){
	
	var $number = $code.slice(-4); // Get last 4 digits of code.
	var $value  = ($type).toLowerCase()+"-"+$number;
	
	var $html = "<a loyaltytype='hotel' loyaltyid='' id='' href='user_memberships/delete_membership' class='active-item item-loyalty float program_new'>"+
      "<span class='value code'>"+$type+"</span>"+
      "<span class='value number'>"+$code+"</span>"+
      "<span class='value name'>"+$level+"</span></a>";
      
    $("#loyalty-type-hotel .add-new-button").before($html);
    
    var html_for_staycard = '<option class="program_new" selected="selected" value="'+$value+'" data-type="ffp" data-primary="true" data-number="'+$number+'" data-name="'+$name+'" data-code="'+$type+'">'+$type+' '+$code+'</option>';
	$("#stay-card-loyalty #loyalty").append(html_for_staycard);
}

function updateFFPLoyaltyUI($type,$code,$program,$name){
	
	var $number = $code.slice(-4); // Get last 4 digits of code.
	var $value  = ($type).toLowerCase()+"-"+$number;
	
	var $html = "<a loyaltytype='flyer' loyaltyid='' id=''+ href='user_memberships/delete_membership' class='active-item item-loyalty float program_new'>"+
      "<span class='value code'>"+$type+"</span>"+
      "<span class='value number'>"+$code+"</span>"+
      "<span class='value name'>"+$program+"</span></a>";
      
    $("#loyalty-type-flyer .add-new-button").before($html);
    
    var html_for_staycard = '<option class="program_new" selected="selected" value="'+$value+'" data-type="ffp" data-primary="true" data-number="'+$number+'" data-name="'+$name+'" data-code="'+$type+'">'+$type+' '+$code+'</option>';
	$("#stay-card-loyalty #loyalty optgroup").last().before(html_for_staycard);
}

function updateSelectionUI($code,$type){
	var $number = $code.slice(-4);
	$("div#reservationLoyalty.selected").html("");
	var html = 	'<span class="value code">'+$type+'</span>'+
				'<span class="number">Ending with<span class="value number">'+$number+'</span></span>';
				
	$("div#reservationLoyalty.selected").html(html);
}

function clearSelectionUI(){
	$("div#reservationLoyalty.selected").html("");
	var html = 	'<span class="value code"></span>'+
				'<span class="number">Ending with<span class="value number"></span></span>';
	$("div#reservationLoyalty.selected").html(html);
}
