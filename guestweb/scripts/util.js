
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

var returnEmptyScreenDetails = function() {
  return {
    "screen_title": "",
    "item_description": ""
  };
}

var extractScreenDetails = function(identifier,cms_screen_details) {
  var screen_id = returnEmptyScreenDetails();
  var screen_details = {
    "title": "",
    "description": ""
  };
  screen_details = _.find(cms_screen_details.screen_messages, function(cms_item) {
    return cms_item.screen_id === identifier;
  });
  
  screen_details = (typeof screen_details !== "undefined") ? screen_details : returnEmptyScreenDetails();
  return screen_details;

};

var creditCardTypes = {
      "AMEX": 'AX',
      "DINERS_CLUB": 'DC',
      "DISCOVER": 'DS',
      "JCB": 'JCB',
      "MASTERCARD": 'MC',
      "VISA": 'VA'
};

function getCreditCardType(cardBrand){
    var card = (typeof cardBrand  ==="undefined") ? "":cardBrand.toUpperCase();
    var cardArray = ['AX','DC','DS','JCB','MC','VA'];
    return (cardArray.indexOf(card) != -1 ) ? card : (typeof creditCardTypes[card]!='undefined') ? creditCardTypes[card] : 'credit-card';
}

var returnMonthsArray = function() {
  return [{
    'name': 'JAN',
    'value': '01'
  }, {
    'name': 'FEB',
    'value': '02'
  }, {
    'name': 'MAR',
    'value': '03'
  }, {
    'name': 'APR',
    'value': '04'
  }, {
    'name': 'MAY',
    'value': '05'
  }, {
    'name': 'JUN',
    'value': '06'
  }, {
    'name': 'JUL',
    'value': '07'
  }, {
    'name': 'AUG',
    'value': '08'
  }, {
    'name': 'SEP',
    'value': '09'
  }, {
    'name': 'OCT',
    'value': '10'
  }, {
    'name': 'NOV',
    'value': '11'
  }, {
    'name': 'DEC',
    'value': '12'
  }];
}