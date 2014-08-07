
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


/*
* Currency mappings
*/

var CurrencyInfoMappings = {

    'AED': [2, 'dh', '\u062f.\u0625.', 'DH'],
    'AUD': [2, '$', 'AU$'],
    'BDT': [2, '\u09F3', 'Tk'],
    'BRL': [2, 'R$', 'R$'],
    'CAD': [2, '$', 'C$'],
    'CHF': [2, 'CHF', 'CHF'],
    'CLP': [0, '$', 'CL$'],
    'CNY': [2, '¥', 'RMB¥'],
    'COP': [0, '$', 'COL$'],
    'CRC': [0, '\u20a1', 'CR\u20a1'],
    'CZK': [2, 'K\u010d', 'K\u010d'],
    'DKK': [18, 'kr', 'kr'],
    'DOP': [2, '$', 'RD$'],
    'EGP': [2, '£', 'LE'],
    'EUR': [18, '€', '€'],
    'GBP': [2, '£', 'GB£'],
    'HKD': [2, '$', 'HK$'],
    'ILS': [2, '\u20AA', 'IL\u20AA'],
    'INR': [2, '\u20B9', 'Rs'],
    'ISK': [0, 'kr', 'kr'],
    'JMD': [2, '$', 'JA$'],
    'JPY': [0, '¥', 'JP¥'],
    'KRW': [0, '\u20A9', 'KR₩'],
    'LKR': [2, 'Rs', 'SLRs'],
    'MNT': [0, '\u20AE', 'MN₮'],
    'MXN': [2, '$', 'Mex$'],
    'MYR': [2, 'RM', 'RM'],
    'NOK': [18, 'kr', 'NOkr'],
    'PAB': [2, 'B/.', 'B/.'],
    'PEN': [2, 'S/.', 'S/.'],
    'PHP': [2, '\u20B1', 'Php'],
    'PKR': [0, 'Rs', 'PKRs.'],
    'RUB': [42, 'руб.', 'руб.'],
    'SAR': [2, 'Rial', 'Rial'],
    'SEK': [2, 'kr', 'kr'],
    'SGD': [2, '$', 'S$'],
    'THB': [2, '\u0e3f', 'THB'],
    'TRY': [2, 'TL', 'YTL'],
    'TWD': [2, 'NT$', 'NT$'],
    'USD': [2, '$', 'US$'],
    'UYU': [2, '$', 'UY$'],
    'VND': [0, '\u20AB', 'VN\u20AB'],
    'YER': [0, 'Rial', 'Rial'],
    'ZAR': [2, 'R', 'ZAR']
};

/**
* A public method to check if a value falls in a set of values.
* @param {string/integer} is the value to be checked
* @param {array} is the set of values to be evaluated
*/
var isAnyMatch = function(val, arr){
    var ret = false;
    for(var i=0, j= arr.length ; i<j ; i++){
        if(arr[i] === val){
            ret = true;
            break;
        }
    }
    return ret;
};  

var getCurrencySign = function(currencyCode) {
    return CurrencyInfoMappings[currencyCode][1];
};

/**
* A public method to check if the given object is empty.
* @param {object} is the object to be checked
*/
function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

/**
* A public method to check if the given object is empty (it is recommended over the above one).
* @param {object} is the object to be checked
*/
function isEmptyObject(obj) {
    for(var key in obj) {
        return false;
    }
    return true;
}


/**
*   In case of a click or an event occured on child elements
*   of actual targeted element, we need to change it as the event on parent element
*   @param {event} is the actual event
*   @param {selector} is the selector which we want to check against that event
*   @return {Boolean} trueif the event occured on selector or it's child elements
*   @return {Boolean} false if not
*/
function getParentWithSelector($event, selector) {
    var obj = $event.target, matched = selector.contains(obj);
    if(matched){
        $event.target = selector;
    }
    return matched;
    
};


/**
* utils function to remove null & empty value keys from a dictionary, 
* please use deepcopy of that object as parameter to function
*/

function removeNullKeys(dict){
    for(key in dict){
        if(typeof dict[key] == 'undefined' || dict[key] == "" || dict[key] == null){
            console.log('innnnnn');
            delete dict[key];
        }
    }
    return dict;
}


function getDateString(dateObj){
    var yr = dateObj.getFullYear();
    var month = dateObj.getMonth() + 1;
    var monthFormatted = (month < 10) ? ("0"+ month) : month; 
    var date = dateObj.getDate();
    var dateFormatted = (date < 10) ? ("0"+ date) : date; 

    var dateString = yr + '-' + monthFormatted + '-' + dateFormatted;

    return dateString;
}

function getTimeFormated(hours, minutes, ampm) {
    var time = "";
    hours = parseInt(hours);
    minutes = parseInt(minutes);
    
    if(ampm == "PM" && hours < 12) hours = hours + 12;
    if(ampm == "AM" && hours == 12) hours = hours - 12;
    var sHours = hours.toString();
    var sMinutes = minutes.toString();
    if(hours < 10) sHours = "0" + sHours;
    if(minutes < 10) sMinutes = "0" + sMinutes;

    var time = sHours + ":" + sMinutes;
    return time;
}

function getDateObj(dateString){
    //TODO: Handle different conditions

    return convertDateToUTC(new Date(dateString));
}

function convertDateToUTC(date) {
  return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
}

function getCurrencySymbol(currenyCode){
      var symbol = "";
      if(currenyCode == "USD"){
        symbol = "$";
      }
      return symbol;
};

var getMappedRoomReadyStatusColor = function(roomReadyStatus, checkinIsInspectedOnly) {
	
        mappedColor = "";
        switch(roomReadyStatus) {

            case "INSPECTED":
                mappedColor = 'room-green';
                break;
            case "CLEAN":
                if (checkinIsInspectedOnly == "true") {
                    mappedColor = 'room-orange';
                    break;
                } else {
                    mappedColor = 'room-green';
                    break;
                }
                break;
            case "PICKUP":
                mappedColor = "room-orange";
                break;

            case "DIRTY":
                mappedColor = "room-red";
                break;

        }
        return mappedColor;
};


var avatharImgs = {
	'mr' : 'avatar-male.png',
	'mrs': 'avatar-female.png',
	'ms': 'avatar-female.png',
	'miss': 'avatar-female.png',
	'': 'avatar-trans.png',
};

function getAvatharUrl(title){
	//function to get avathar image url by giving title
	title = $.trim(title).toLowerCase().split('.')[0];
	try{
		if((title == "mr") || (title == "mrs") || (title == "miss")|| (title == "ms"))
			return (/assets/ + avatharImgs[title]);
	    else
	    	return (/assets/ + avatharImgs['']);
	}
	catch (e) {
		console.log(e.message);
		// TODO: handle exception
	}
}

/**
* utils function convert any number to number with two decimal points.
*/
function precisionTwo(value){
    var parsed = value == '' || value == null || typeof value == 'undefined' ? '': parseFloat(value).toFixed(2);
    return parsed;
}


/*
 * Please use this to get create date for a dayString.
 */
tzIndependentDate = function(st) {
    var d = new Date(st);
    var r = d.getTime();

    if ( (d.getHours() != 0) || (d.getMinutes() != 0) ) {
        r += d.getTimezoneOffset() * 60 * 1000;
    }

    if ( d.getTimezoneOffset() < 0 ) {
        r -= d.getTimezoneOffset() * 60 * 1000;
    }
    
    return new Date(r);
}



Date.prototype.addDays = function(days) {
   var dat = new Date(this.valueOf())
   dat.setDate(dat.getDate() + days);
   return dat;
}

/**
* A public method to check if the given object is empty (it is recommended over the above one).
* @param {object} is the object to be checked
*/
function isEmptyObject(obj) {
    for(var key in obj) {
        return false;
    }
    return true;
}


