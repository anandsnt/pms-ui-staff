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