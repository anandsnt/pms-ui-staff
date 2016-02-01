
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
    'MM-DD-YYYY': ['MM-dd-yyyy','mm-dd-yy'],
    'MM/DD/YYYY': ['MM/dd/yyyy','mm/dd/yy'],
    'DD-MM-YYYY': ['dd-MM-yyyy','dd-mm-yy'],
    'DD/MM/YYYY': ['dd/MM/yyyy','dd/mm/yy']
};

var getDateFormat = function(dateFormat) {
    if(typeof dateFormat === 'undefined'){
        return DateFormatInfoMappings['MM-DD-YYYY'][0];
    }
    else{
        return DateFormatInfoMappings[dateFormat][0];
    }
};

var getJqDateFormat = function(dateFormat) {
    if(typeof dateFormat === 'undefined'){
        return DateFormatInfoMappings['MM-DD-YYYY'][1];
    }
    else{
        return DateFormatInfoMappings[dateFormat][1];
    }
};
var loseFocus = function() {
    var inputs = document.getElementsByTagName('input');
    for (var i = 0; i < inputs.length; ++i) {
      inputs[i].blur();
    }
};


var extractScreenDetails =  function(identifier,screen_mappings,cms_data){
  var screen_id = "";
  var screen_details = {};
  for(i=0; i< screen_mappings.length; i++){
    if(identifier === screen_mappings[i].value){
      screen_id = screen_mappings[i].id
    }
  };
  for(i=0; i< cms_data.length; i++){
    if(screen_id === cms_data[i].screen_id){
      screen_details = cms_data[i];
    }
  };

  return screen_details;

};