function bindLoyaltyUtilFunctions(){
	$(function() {
		ffProgramsList = [];
		hlProgramsList = [];
	  	var $url_ffp = 'staff/user_memberships/get_available_ffps.json';
			$url_hlp = 'staff/user_memberships/get_available_hlps.json';
					
		fetchLoyaltyProgramData($url_ffp,'ffp');
		fetchLoyaltyProgramData($url_hlp,'hlp');
	});
} 

var $selectedLoyaltyProgram ="";
var $selectedLoyaltyType ="";

// success function call of fetchLoyaltyProgramData's ajax call
function fetchCompletedOfFetchLoyaltyProgramData(data, requestParameters) {
	if(requestParameters['type'] == 'ffp'){
		ffProgramsList = data;
	}
	else if(requestParameters['type'] == 'hlp'){
		hlProgramsList = data;
	}	
}

//To fetch the ffp or hlp list
function fetchLoyaltyProgramData(url,type){
	
   var webservice = new WebServiceInterface();
   var options = {
		   successCallBack: fetchCompletedOfFetchLoyaltyProgramData,
		   
		   successCallBackParameters: {'type': type},
   };
   webservice.getJSON(url, options);	
}

 // success function call of updateServerForNewLoyalty's ajax call
function fetchCompletedOfUpdateServerForNewLoyalty(data, requestParameters) {
	if(data.status == 'success'){
		//Insert the response id to the new DOM element
		requestParameters['successCallback'](data.data);		
	}
	else{
		// the following was the old code present there.
		/*if (type == 'FFP') {
			$("#new-ffp .error-messages").html(response.errors.join('<br>')).show();					
		} else if (type == 'HLP') {
			$("#new-hlp .error-messages").html(response.errors.join('<br>')).show();
		}	*/
		sntapp.notification.showErrorList(data.errors, that.myDom);
	}
}

function updateServerForNewLoyalty(postData, successCallback, type){
	
   var webservice = new WebServiceInterface();
   var options = {
		   requestParameters: postData,
		   successCallBack: fetchCompletedOfUpdateServerForNewLoyalty,
		   successCallBackParameters: {'type': type, 'successCallback': successCallback},
   };
   var url = 'staff/user_memberships';
   webservice.postJSON(url, options);	
}

//populate the airline list for frequent flier program add new popup
function addFFPSelectOptions(selector){
	$.each(ffProgramsList.data, function(key, airline) {
		var airlineOptions ='<option value="'+ airline.ff_value +'">' + airline.ff_description+ '</option>'
		$(selector).append(airlineOptions);
	});
};

//populate the loyalty type list for hotel loyalty program add new popup
function addHLPSelectOptions(selector){
	$.each(hlProgramsList.data, function(key, loyaltyType) {
		var programTypes ='<option value="'+ loyaltyType.hl_value +'">' + loyaltyType.hl_description+ '</option>'
		$(selector).append(programTypes);
	});
}

function updateHLPLoyaltyUI($type,$code,$level,$name){
	
	var $number = $code.slice(-4); // Get last 4 digits of code.
	var $value  = ($type).toLowerCase()+"-"+$number;
	
	var $html = "<a loyaltytype='hotel' loyaltyid='' id='' class='active-item item-loyalty float program_new'>"+
      "<span class='value code'>"+$type+"</span>"+
      "<span class='value number'>"+$code+"</span>"+
      "<span class='value name'>"+$level+"</span></a>";
      
    $("#loyalty-hlp").append($html);
    
    var html_for_staycard = '<option selected="selected" class="program_new" value="'+$value+'" data-type="ffp" data-primary="true" data-number="'+$number+'" data-name="'+$name+'" data-code="'+$type+'">'+$type+' '+$code+'</option>';
	$("#stay-card-loyalty #loyalty").append(html_for_staycard);
}

function updateFFPLoyaltyUI($type,$code,$program,$name){
	
	var $number = $code.slice(-4); // Get last 4 digits of code.
	var $value  = ($type).toLowerCase()+"-"+$number;
	
	var $html = "<a loyaltytype='flyer' loyaltyid='' id='' class='active-item item-loyalty float program_new'>"+
      "<span class='value code'>"+$type+"</span>"+
      "<span class='value number'>"+$code+"</span>"+
      "<span class='value name'>"+$program+"</span></a>";
      
    $("#loyalty-ffp").append($html);
    
    var html_for_staycard = '<option selected="selected" class="program_new" value="'+$value+'" data-type="ffp" data-primary="true" data-number="'+$number+'" data-name="'+$name+'" data-code="'+$type+'">'+$type+' '+$code+'</option>';
	$("#stay-card-loyalty #loyalty optgroup").last().before(html_for_staycard);
}

function updateSelectionUI($code,$type){
	console.log("updateSelectionUI");
	var $number = $code.slice(-4);
	$("div#reservationLoyalty.selected").html("");
	var html = 	'<span class="value code">'+$type+'</span>'+
				'<span class="number">Ending with<span class="value number">'+$number+'</span></span>';
				
	$("div#reservationLoyalty.selected").html(html);
}

function clearSelectionUI(){
	$("div#reservationLoyalty.selected").html("");
	var html = 	'<span class="value code"></span>'+
				'<span class="number">Select Loyalty Program<span class="value number"></span></span>';
	$("div#reservationLoyalty.selected").html(html);
}

function resetSelectionUI(){
	$("div#reservationLoyalty.selected").html("");
	var html = 	'<span class="value code"></span>'+
				'<span class="number">Ending with<span class="value number"></span></span>';
	$("div#reservationLoyalty.selected").html(html);
}
