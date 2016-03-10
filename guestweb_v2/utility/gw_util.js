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
  return string = string.length>0 ? string.replace(substring_to_be_replaced, new_string) :'';
};


var extractScreenDetails = function(identifier, screen_mappings, cms_data) {
  var screen_id = returnEmptyScreenDetails();
  var screen_details = {
    "title": "",
    "description": ""
  };
  screen_id = _.find(screen_mappings, function(mapping) {
    return mapping.value === identifier
  }).id;
  screen_details = _.find(cms_data, function(cms_item) {
    return cms_item.screen_id === screen_id
  });
  screen_details = (typeof screen_details !== "undefined") ? screen_details : returnEmptyScreenDetails();
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
}

var returnMonthsArray = function() {
  return [{
    'name': 'January',
    'value': '01'
  }, {
    'name': 'February',
    'value': '02'
  }, {
    'name': 'March',
    'value': '03'
  }, {
    'name': 'April',
    'value': '04'
  }, {
    'name': 'May',
    'value': '05'
  }, {
    'name': 'June',
    'value': '06'
  }, {
    'name': 'July',
    'value': '07'
  }, {
    'name': 'August',
    'value': '08'
  }, {
    'name': 'September',
    'value': '09'
  }, {
    'name': 'October',
    'value': '10'
  }, {
    'name': 'November',
    'value': '11'
  }, {
    'name': 'December',
    'value': '12'
  }];
}