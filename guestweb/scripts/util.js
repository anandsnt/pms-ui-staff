
// Function to remove unwanted key elements from hash.
var dclone = function(object, unwanted_keys){

  	if(typeof unwanted_keys === "undefined"){
  		unwanted_keys = [];
  	}
  	if(object === "undefined"){
  		return object;
  	} else {
  			var newObject = JSON.parse(JSON.stringify(object));
		  	for(var i=0; i < unwanted_keys.length; i++){
		  		delete newObject[unwanted_keys[i]];
		  	}
  	}
  
  	return newObject;
};


var DateFormatInfoMappings = {
    
    'MM-DD-YYYY': 'MM-dd-yyyy',
    'MM/DD/YYYY': 'MM/dd/yyyy',
    'DD-MM-YYYY': 'dd-MM-yyyy',
    'DD/MM/YYYY': 'dd/MM/yyyy'
    
};

var getDateFormat = function(dateFormat) {
    return DateFormatInfoMappings[dateFormat];
};