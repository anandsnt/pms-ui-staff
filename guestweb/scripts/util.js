
// Function to remove unwanted key elements from hash.
var dclone = function(object, unwanted_keys) {

  	if (typeof unwanted_keys === "undefined") {
  		unwanted_keys = [];
  	}
  	if (object === "undefined") {
  		return object;
  	} else {
  			var newObject = JSON.parse(JSON.stringify(object));

		  	for (var i = 0; i < unwanted_keys.length; i++) {
		  		delete newObject[unwanted_keys[i]];
		  	}
  	}

  	return newObject;
};
/**
 * [convertTime12to24 to convert a single string of 12 hours format to 24 hours]
 * @param  {[type]} time12h [string - 12 hour format time]
 * @return {[type]}         [description]
 */
function convertTime12to24(time12h) {
  var time = time12h.split(' ')[0];
  var modifier = time12h.split(' ')[1];
  var hours = time.split(':')[0];
  var minutes = time.split(':')[1];

  if (hours === '12') {
    hours = '00';
  }
  if (modifier === 'pm') {
    hours = parseInt(hours, 10) + 12;
  }
  return hours + ':' + minutes;
}
/**
 * [get24HoursTime to convert time in hours + minutes + primetime of 12 hours format to 24 hours]
 * @param  {[type]} hour [string]
 * @param  {[type]} minute [string]
 * @param  {[type]} primetime [string]
 * @return {[type]} [description]
 */

function get24HoursTime(hour, minute, primetime) {
  // change format to 24 hours
  var hour = parseInt(hour);

  if (primetime === 'PM' && hour < 12) {
    hour = hour + 12;
  } else if (primetime === 'AM' && hour === 12) {
    hour = hour - 12;
  }
  hour = (hour < 10) ? ("0" + hour) : hour;
  return hour + ':' + minute;
}

var returnTimeArray = function() {
  return ['12:00 am', '12:15 am', '12:30 am', '12:45 am', '1:00 am', '1:15 am',
    '1:30 am', '1:45 am', '2:00 am', '2:15 am', '2:30 am', '2:45 am',
    '3:00 am', '3:15 am', '3:30 am', '3:45 am', '4:00 am', '4:15 am',
    '4:30 am', '4:45 am', '5:00 am', '5:15 am', '5:30 am', '5:45 am',
    '6:00 am', '6:15 am', '6:30 am', '6:45 am', '7:00 am', '7:15 am',
    '7:30 am', '7:45 am', '8:00 am', '8:15 am', '8:30 am', '8:45 am',
    '9:00 am', '9:15 am', '9:30 am', '9:45 am', '10:00 am', '10:15 am',
    '10:30 am', '10:45 am', '11:00 am', '11:15 am', '11:30 am', '11:45 am',
    '12:00 pm', '12:15 pm', '12:30 pm', '12:45 pm', '01:00 pm', '01:15 pm',
    '1:30 pm', '1:45 pm', '2:00 pm', '2:15 pm', '2:30 pm', '2:45 pm',
    '3:00 pm', '3:15 pm', '3:30 pm', '3:45 pm', '4:00 pm', '4:15 pm',
    '4:30 pm', '4:45 pm', '5:00 pm', '5:15 pm', '5:30 pm', '5:45 pm',
    '6:00 pm', '6:15 pm', '6:30 pm', '6:45 pm', '7:00 pm', '7:15 pm',
    '7:30 pm', '7:45 pm', '8:00 pm', '8:15 pm', '8:30 pm', '8:45 pm',
    '9:00 pm', '9:15 pm', '9:30 pm', '9:45 pm', '10:00 pm', '10:15 pm',
    '10:30 pm', '10:45 pm', '11:00 pm', '11:15 pm', '11:30 pm', '11:45 pm'
  ];
};

var getFormattedTime = function(timeToFormat) {
  // change format to 24 hours
  var timeHour = parseInt(timeToFormat.slice(0, 2));
  var timeMinute = timeToFormat.slice(3, 5);
  var primeTime = timeToFormat.slice(-2).toLowerCase();

  if (primeTime === 'pm' && timeHour < 12) {
    timeHour = timeHour + 12;
  } else if (primeTime === 'am' && timeHour === 12) {
    timeHour = timeHour - 12;
  }
  // timeHour = (timeHour < 10) ? ("0" + timeHour) : timeHour;
  return timeHour + ":" + timeMinute;
};


var getIndexOfSelectedTime = function(time) {
  // extract time components
  var timeHour = time.slice(0, 2);
  var timeMinute = time.slice(3, 5);
  var primeTime = time.slice(-2).toLowerCase();
  // set the minute to next available level, ie 00,15,30,45
  var timeLimit = "00";

  timeHour = (parseInt(timeHour) < 10) ? parseInt(timeHour).toString() : timeHour;
  if (timeMinute === "00" || timeMinute < 15) {
    timeMinute = "15";
  } else if (timeMinute >= 15 && timeMinute < 30) {
    timeMinute = "30";
  } else if (timeMinute >= 30 && timeMinute < 45) {
    timeMinute = "45";
  } else {
    timeHour = parseInt(timeHour) + 1;
    timeMinute = "00";
  }

  var switchAMPM = function() {
    primeTime = (primeTime === "pm") ? "am" : "pm";
  };
  // if hour is 12, need to switch primetimes

  if (timeHour === 12 && timeMinute === "00"){
    switchAMPM();
  }
  timeLimit = timeHour + ":" + timeMinute + " " + primeTime;
  // find the index of the hoteltime inside the list we have
  var timeList = returnTimeArray();
  var index = _.findIndex(timeList, function(time) {
    return time === timeLimit;
  });

  return index;
};
var DateFormatInfoMappings = {

    'MM-DD-YYYY': ['MM-dd-yyyy', 'mm-dd-yy'],
    'MM/DD/YYYY': ['MM/dd/yyyy', 'mm/dd/yy'],
    'DD-MM-YYYY': ['dd-MM-yyyy', 'dd-mm-yy'],
    'DD/MM/YYYY': ['dd/MM/yyyy', 'dd/mm/yy']

};

var getDateFormat = function(dateFormat) {
    if (typeof dateFormat === 'undefined') {
        return DateFormatInfoMappings['MM-DD-YYYY'][0];
    }
    else {
        return DateFormatInfoMappings[dateFormat][0];
    }
};

var getJqDateFormat = function(dateFormat) {
    if (typeof dateFormat === 'undefined') {
        return DateFormatInfoMappings['MM-DD-YYYY'][1];
    }
    else {
        return DateFormatInfoMappings[dateFormat][1];
    }
};

var returnEmptyScreenDetails = function() {
  return {
    "screen_title": "",
    "item_description": ""
  };
};

var extractScreenDetails = function(identifier, cms_screen_details) {
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

function getCreditCardType(cardBrand) {
    var card = (typeof cardBrand  === "undefined") ? "" : cardBrand.toUpperCase();
    var cardArray = ['AX', 'DC', 'DS', 'JCB', 'MC', 'VA'];

    return (cardArray.indexOf(card) != -1 ) ? card : (typeof creditCardTypes[card] != 'undefined') ? creditCardTypes[card] : 'credit-card';
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
};

var applyStyle = function(styleString) {
  // set zestweb footer color based on admin settings
    var css = document.createElement("style");

    css.type = "text/css";
    css.innerHTML = styleString;
    document.body.appendChild(css);
};

var applyFooterStyle = function(footer_color) {
    var styleString = "#zest-footer a{  color :" + footer_color + " !important;}";
    // body and HTML tags were given auto height in some themes(almost 40 themes),
    // so in order to override all these, we needed to add this line of code here

    styleString = styleString + " body,html{ height : 100% !important;} ";
    applyStyle(styleString);
};

var returnFooterStyleClass = function(footerCount) {
  var footerClass = "";
  // based upon number of footer items, set a class for styling

  if (footerCount === 3) {
    footerClass = "triple-footer";
  } else if (footerCount === 2) {
    footerClass = "double-footer";
  } else {
    footerClass = "single-footer";
  }
  return footerClass;
};

var customizeStylesForIhgApp = function() {
  // customize style
  // logo is not in a common HTML
  var node = document.createElement('style');
  node.innerHTML = '.row.header-bar {margin-bottom:35px !important;}';
  if (navigator.userAgent.match(/Android/i) !== -1 && navigator.userAgent.match(/Android/i) !== null) {
    node.innerHTML = node.innerHTML + ".res-details-heading,.back-text,.btn,.btn p,.btn span p,.footer-sub-text,.footer-sub-text:hover,.footer-text,.phone-label,.res-date,.sub-main-text,.sub-text,a,a:hover,.main-text{font-family: Roboto,sans-serif !important}";
    node.innerHTML = node.innerHTML + ".btn,.btn p,.btn span p, .btn-template {font-weight: 400 !important}";
  }
  document.head.appendChild(node);
};

var customizeStylesBasedOnUrlType = function(theme) {
  // customize style
  // logo is not in a common HTML
  var node = document.createElement('style');
  node.innerHTML = ".logo-image {display: none;} .row.header-bar {margin-bottom: 50px !important;} #zest-footer{ display: none !important;}";
  document.head.appendChild(node);
  if (theme === 'guestweb_ihg') {
    // for IHG, font family for android App is to be Roboto
    customizeStylesForIhgApp();
  }
};

