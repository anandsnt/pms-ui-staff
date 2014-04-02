
// Function to remove unwanted key elements from hash.
var dclone = function(object, unwanted_keys){
	if(typeof unwanted_keys === "undefined"){
		unwanted_keys = [];
	}
	var newObject = JSON.parse(JSON.stringify(object));
	for(var i=0; i < unwanted_keys.length; i++){
		delete newObject[unwanted_keys[i]];
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




var getCurrencySign = function(currencyCode) {
  return CurrencyInfoMappings[currencyCode][1];
};


