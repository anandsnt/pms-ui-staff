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


var DateFormatInfoMappings = {
  'MM-DD-YYYY': ['MM-dd-yyyy', 'mm-dd-yy'],
  'MM/DD/YYYY': ['MM/dd/yyyy', 'mm/dd/yy'],
  'DD-MM-YYYY': ['dd-MM-yyyy', 'dd-mm-yy'],
  'DD/MM/YYYY': ['dd/MM/yyyy', 'dd/mm/yy']
};

var getDateFormat = function(dateFormat) {
  if (typeof dateFormat === 'undefined') {
    return DateFormatInfoMappings['MM-DD-YYYY'][0];
  } else {
    return DateFormatInfoMappings[dateFormat][0];
  }
};

var getJqDateFormat = function(dateFormat) {
  if (typeof dateFormat === 'undefined') {
    return DateFormatInfoMappings['MM-DD-YYYY'][1];
  } else {
    return DateFormatInfoMappings[dateFormat][1];
  }
};
var loseFocus = function() {
  var inputs = document.getElementsByTagName('input');
  for (var i = 0; i < inputs.length; ++i) {
    inputs[i].blur();
  }
};

var returnEmptyScreenDetails = function() {
  return {
    "title": "",
    "description": ""
  };
}

var replaceStringWithScopeVariable = function(string, substring_to_be_replaced, new_string) {
  return string = string.length > 0 ? string.replace(substring_to_be_replaced, new_string) : '';
};


var extractScreenDetails = function(identifier, screen_mappings, cms_data) {
  var screen_id = "";
  var screen_details = {
    "title": "",
    "description": ""
  };
  // refer GwScreenMappingSrv for screen_mappings
  selected_screen_details = _.find(screen_mappings, function(mapping) {
    return mapping.value === identifier;
  });
  screen_id = !!selected_screen_details ? selected_screen_details.id : "";
  // cms_data is set from hotel admin
  screen_details = _.find(cms_data, function(cms_item) {
    return cms_item.screen_id === screen_id;
  });
  //rename the varaiables for easy usage
  if (typeof screen_details !== "undefined") {
    screen_details.title = screen_details.screen_title;
    screen_details.description = screen_details.item_description;
    delete screen_details.screen_title;
    delete screen_details.item_description;
  } else {
    screen_details = returnEmptyScreenDetails();
  }
  return screen_details;
};

var returnYears = function() {
  var years = [];
  var startYear = new Date().getFullYear();
  var endYear = parseInt(startYear) + 100;
  for (year = parseInt(startYear); year <= parseInt(endYear); year++) {
    years.push(year);
  };
  return years;
};

var returnYearsInReverseOrder = function(){
  var years = [];
  var startYear = new Date().getFullYear();
  var endYear = parseInt(startYear) - 150;
  for (year = startYear; year >= parseInt(endYear); year--) {
     years.push(year);
  };
  return years;
};

var returnSelectedMonth = function(month_to_check){
  var months = returnMonthsArray();
  var selectedMonth = {};
  selectedMonth = _.find(months, function(month) {
    return month.value === month_to_check;
  });
  return selectedMonth;
};

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

var returnTimeArray = function() {
  return ['12:00 am', '12:15 am', '12:30 am', '12:45 am', '01:00 am', '01:15 am',
    '01:30 am', '01:45 am', '02:00 am', '02:15 am', '02:30 am', '02:45 am',
    '03:00 am', '03:15 am', '03:30 am', '03:45 am', '04:00 am', '04:15 am',
    '04:30 am', '04:45 am', '05:00 am', '05:15 am', '05:30 am', '05:45 am',
    '06:00 am', '06:15 am', '06:30 am', '06:45 am', '07:00 am', '07:15 am',
    '07:30 am', '07:45 am', '08:00 am', '08:15 am', '08:30 am', '08:45 am',
    '09:00 am', '09:15 am', '09:30 am', '09:45 am', '10:00 am', '10:15 am',
    '10:30 am', '10:45 am', '11:00 am', '11:15 am', '11:30 am', '11:45 am',
    '12:00 pm', '12:15 pm', '12:30 pm', '12:45 pm', '01:00 pm', '01:15 pm',
    '01:30 pm', '01:45 pm', '02:00 pm', '02:15 pm', '02:30 pm', '02:45 pm',
    '03:00 pm', '03:15 pm', '03:30 pm', '03:45 pm', '04:00 pm', '04:15 pm',
    '04:30 pm', '04:45 pm', '05:00 pm', '05:15 pm', '05:30 pm', '05:45 pm',
    '06:00 pm', '06:15 pm', '06:30 pm', '06:45 pm', '07:00 pm', '07:15 pm',
    '07:30 pm', '07:45 pm', '08:00 pm', '08:15 pm', '08:30 pm', '08:45 pm',
    '09:00 pm', '09:15 pm', '09:30 pm', '09:45 pm', '10:00 pm', '10:15 pm',
    '10:30 pm', '10:45 pm', '11:00 pm', '11:15 pm', '11:30 pm', '11:45 pm'
  ];
};

var getFormattedTime = function(timeToFormat) {
  //change format to 24 hours
  var timeHour = parseInt(timeToFormat.slice(0, 2));
  var timeMinute = timeToFormat.slice(3, 5);
  var primeTime = timeToFormat.slice(-2).toLowerCase();
  if (primeTime === 'pm' && timeHour < 12) {
    timeHour = timeHour + 12;
  } else if (primeTime === 'am' && timeHour === 12) {
    timeHour = timeHour - 12;
  }
  timeHour = (timeHour < 10) ? ("0" + timeHour) : timeHour;
  return timeHour + ":" + timeMinute;
};


var getIndexOfSelectedTime = function(time) {
  //extract time components
  var timeHour = time.slice(0, 2);
  var timeMinute = time.slice(3, 5);
  var primeTime = time.slice(-2).toLowerCase();
  //set the minute to next available level, ie 00,15,30,45
  var timeLimit = "00";
  if (timeMinute === "00" || timeMinute < 15) {
    timeMinute = "15";
  } else if (timeMinute >= 15 && timeMinute < 30) {
    timeMinute = "30";
  } else if (timeMinute >= 30 && timeMinute < 45) {
    timeMinute = "45";
  } else {
    timeHour = parseInt(timeHour) + 1;
    timeHour = (timeHour < 10) ? ("0" + timeHour) : timeHour;
    timeMinute = "00";
  };

  var switchAMPM = function() {
    primeTime = (primeTime === "pm") ? "am" : "pm";
  };
  //if hour is 12, need to switch primetimes
  (timeHour === 12 && timeMinute === "00") ? switchAMPM(): "";
  timeLimit = timeHour + ":" + timeMinute + " " + primeTime;
  //find the index of the hoteltime inside the list we have
  var timeList = returnTimeArray();
  var index = _.findIndex(timeList, function(time) {
    return time === timeLimit;
  });
  return index;
};



var checkIfDateIsValid = function(month,day,year){
  var birthday = month+"/"+day+"/"+year;  
  var comp = birthday.split('/');
  var m = parseInt(comp[0], 10);
  var d = parseInt(comp[1], 10);
  var y = parseInt(comp[2], 10);
  var date = new Date(y,m-1,d);
  if (date.getFullYear() == y && date.getMonth() + 1 == m && date.getDate() == d) {
     return true
  } else {
     return false;
  }
};