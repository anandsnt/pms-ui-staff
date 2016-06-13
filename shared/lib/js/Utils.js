
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

Date.prototype.stdTimezoneOffset = function() {
    var jan = new Date(this.getFullYear(), 0, 1);
    var jul = new Date(this.getFullYear(), 6, 1);
    return Math.max(Math.abs(jan.getTimezoneOffset()), Math.abs(jul.getTimezoneOffset()));
};


Date.prototype.isOnDST = function() {
    return this.getTimezoneOffset() < this.stdTimezoneOffset();
};

Date.prototype.getDSTDifference = function() {
    var firstMonth, lastMonth, firstMonthOffset, lastMonthOffset, dstDiff;
    if(this.getMonth() >= 0 && this.getMonth() <= 6){
        firstMonth = 0;
        lastMonth  = 6;
    }
    else if(this.getMonth() >6 && this.getMonth() <= 11){
        firstMonth = 7;
        lastMonth  = 11;
    }
    firstMonth = new Date(this.getFullYear(), firstMonth, 1);
    firstMonthOffset = firstMonth.getTimezoneOffset();
    lastMonth = new Date(this.getFullYear(), lastMonth, 1);
    lastMonthOffset = lastMonth.getTimezoneOffset();
    dstDiff = (firstMonthOffset - lastMonthOffset);
    return dstDiff;
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

var getMappedRoomStatusColor = function(reservationStatus, roomReadyStatus, foStatus, checkinInspectedOnly) {

    var reservationRoomStatusClass = "";
    if(reservationStatus == 'CHECKING_IN' && roomReadyStatus!=''){
        
        if(foStatus == 'VACANT'){
            switch(roomReadyStatus) {
                case "INSPECTED":
                    reservationRoomStatusClass = ' room-green';
                    break;
                case "CLEAN":
                    if (checkinInspectedOnly == "true") {
                        reservationRoomStatusClass = ' room-orange';
                        break;
                    } else {
                        reservationRoomStatusClass = ' room-green';
                        break;
                    }
                    break;
                case "PICKUP":
                    reservationRoomStatusClass = " room-orange";
                    break;
    
                case "DIRTY":
                    reservationRoomStatusClass = " room-red";
                    break;
                default:
                    reservationRoomStatusClass = " ";
                    break;
            }
        
        } else {
            reservationRoomStatusClass = "room-red";
        }
            
    } 
    return reservationRoomStatusClass;
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
            return ('/assets/images/' + avatharImgs[title]);
        else
            return ('/assets/images/' + avatharImgs['']);
    }
    catch (e) {
        console.log(e.message);
        // TODO: handle exception
    }
}

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


var sixCreditCardTypes = {
      "AX": 'AX',
      "DI": 'DS',
      "DN": 'DC',
      "JC": 'JCB',
      "MC": 'MC',
      "VS": 'VA',
      "VX": 'VA',
      "MX": 'DS',//Six iframe reurns MX for discover. not good,
      "MV": 'MC'
};

function getSixCreditCardType(cardCode){
    var card = cardCode.toUpperCase();
    return sixCreditCardTypes[card];
}



/**
* utils function convert any number to number with two decimal points.
*/
function precisionTwo(value){
    var parsed = value === '' || value === null || typeof value === 'undefined' ? '': parseFloat(value).toFixed(2);
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

    var adjustedDate = new Date(r)

    if(adjustedDate.isOnDST()){
        return new Date(r += Math.abs(d.getDSTDifference()) * 60 * 1000);
    }

    return adjustedDate;
};


//To add n days to the current date
Date.prototype.addDays = function(days) {
   var dat = new Date(this.valueOf());
   dat.setDate(dat.getDate() + days);
   return dat;
};

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

/** Returns a deep copy of the date object**/
Date.prototype.clone = function() { 
    return new Date(this.getTime()); 
};

/**
* function to get List of dates between two dates
* param1 {Date Object}
* param2 {Date Object}
* return Array of Date Objects
*/
var getDatesBetweenTwoDates = function(fromDate, toDate){
    var datesBetween = [];

    while(fromDate <= toDate){
        datesBetween.push(new Date(fromDate));
        fromDate.setDate(fromDate.getDate() + 1);
    }

    return datesBetween;
}


function getWeekDayName(dayIndexInWeek, minLetterCount){
    if(typeof minLetterCount === 'undefined'){
        minLetterCount = 0;
    }
    var weekday = new Array(7);
    weekday[0]=  "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    var n = weekday[dayIndexInWeek];
    return n.substr(0, minLetterCount);
}



function getTextWidth(text){
        // create a dummy span, we'll use this to measure text.          
        var tester = $('<span>'),

          // get the computed style of the input
         elemStyle = window.document.defaultView
          .getComputedStyle(tester[0], '');

        // apply any styling that affects the font to the tester span.
        tester.css({
          'font-family': elemStyle.fontFamily,
          'line-height': elemStyle.lineHeight,
          'font-size': elemStyle.fontSize,
          'font-weight': elemStyle.fontWeight,
          'width': 'auto',
          'position': 'absolute',
          'top': '-99999px',
          'left': '-99999px'
        });

        // put the tester next to the input temporarily.
        $('body').append(tester);

        // update the text of the tester span
        tester.text(text);

        // measure!
        var r = tester[0].getBoundingClientRect();

        var w = r.width;

        // remove the tester.
        tester.remove();
        return w;
}

//function that converts a null value to a desired string.
//if no replace value is passed, it returns an empty string
var escapeNull = function(value, replaceWith){
    var newValue = "";
    if((typeof replaceWith != "undefined") && (replaceWith != null)){
        newValue = replaceWith;
    }
    var valueToReturn = ((value == null || typeof value == 'undefined' ) ? newValue : value);
    return valueToReturn;
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
/** Convert 24hr format into 12hr (am/pm) format **/
var tConvert = function(time){
	if(time == '' || time == undefined){
		return {};
	}
    tDict = {};
    var t = time.split(':');
    tDict.hh = (t[0] >= 12) ? (t[0] - 12) : t[0];
    tDict.hh = tDict.hh == 0 ? 12 : tDict.hh;
    tDict.mm = t[1];
    tDict.ampm = (t[0] >= 12) ? 'PM' : 'AM';

    return tDict;
}
/** Convert 12hr format to 24 hr format **/
var tConvertToAPIFormat = function(hh, mm, ampm){
	var time = "";
	if(parseInt(mm) < 10){
		mm = '0' + parseInt(mm); 
	}
	if(ampm == "PM"){
		time = ( parseInt(hh) + 12) + ":" + mm;
	} else {
		time = (parseInt(hh) == 12 ? '00': hh) + ":" + mm;
	}

	return time;

}
//retrieve card expiry based on paymnet gateway
var retrieveCardExpiryDate = function(isSixPayment,tokenDetails,cardDetails){
    var expiryDate = isSixPayment?
                    tokenDetails.expiry.substring(2, 4)+" / "+tokenDetails.expiry.substring(0, 2):
                    cardDetails.expiryMonth+" / "+cardDetails.expiryYear
                    ;
    return expiryDate;
};

//retrieve card number based on paymnet gateway
var retrieveCardNumber = function(isSixPayment,tokenDetails,cardDetails){
    var cardNumber = isSixPayment?
            tokenDetails.token_no.substr(tokenDetails.token_no.length - 4):
            cardDetails.cardNumber.slice(-4);
    return cardNumber;
};

//retrieve card type based on paymnet gateway
var retrieveCardtype = function(isSixPayment,tokenDetails,cardDetails){
    var cardType = isSixPayment?
                getSixCreditCardType(tokenDetails.card_type).toLowerCase():
                getCreditCardType(cardDetails.cardType).toLowerCase()
                ;
    return cardType;
};


var checkIfReferencetextAvailable = function(paymentTypes,selectedPaymentType){
    var displayReferance = false;
    angular.forEach(paymentTypes, function(value, key) {
        if(value.name == selectedPaymentType){
            displayReferance = (value.is_display_reference)? true:false;
        };
    });
    return displayReferance;
};


var checkIfReferencetextAvailableForCC = function(paymentTypes,selectedPaymentTypeCard){
    var displayReferance = false;
    angular.forEach(paymentTypes, function(paymentType, key) {
        if(paymentType.name == 'CC'){
            angular.forEach(paymentType.values, function(value, key) {
                if(selectedPaymentTypeCard.toUpperCase() === value.cardcode){
                    displayReferance = (value.is_display_reference)? true:false;
                };                  
            });             
        }
    });
    return displayReferance;
};