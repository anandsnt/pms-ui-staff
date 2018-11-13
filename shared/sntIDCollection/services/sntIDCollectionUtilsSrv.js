angular.module('sntIDCollection').service('sntIDCollectionUtilsSrv', function($filter) {

	var that = this;

	this.base64ArrayBuffer = function(buffer) {
		var arr = new Uint8Array(buffer);
		var raw = '';
		var subArray, chunk = 5000;

		for (let i = 0, j = arr.length; i < j; i += chunk) {
			subArray = arr.subarray(i, i + chunk);
			raw += String.fromCharCode.apply(null, subArray);
		}
		return 'data:image/jpeg;base64,' + btoa(raw);
	};

	this.processDate = function(date) {
		date = date.replace('Date', '');
		date = date.replace(')', '');
		date = date.replace('(', '');
		date = date.split('/').join('');
		date = date.split('+')[0];
		return parseInt(date);
	};

	this.dataURLtoBlob = function(dataURL) {
		// Decode the dataURL    
		var binary = atob(dataURL.split(',')[1]);
		// Create 8-bit unsigned array
		var array = [];

		for (var i = 0; i < binary.length; i++) {
			array.push(binary.charCodeAt(i));
		}
		// Return our Blob object
		return new Blob([new Uint8Array(array)], {
			type: 'image/jpg'
		});
	};

	this.formatData = function(fields) {
		var formatedData = {};
		var dateFormmater = function(val) {
			return val ? moment(that.processDate(val)).utc().format('DD-MM-YYYY') : '';
		};
		var customFormatters = {
			'Birth Date': dateFormmater,
			'Expiration Date': dateFormmater
		};

		angular.forEach(fields, function({
			Key,
			Value
		}) {
			formatedData[Key.toLowerCase().split(' ').join('_')] = customFormatters[Key] ? customFormatters[Key](Value) : Value;
		});

		return formatedData;
	};

	this.resizeImage = function(img, file) {
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');

		ctx.drawImage(img, 0, 0);

		var MAX_WIDTH = 3032;
		var MAX_HEIGHT = 2008;
		var width = img.width;
		var height = img.height;

		if (width > height) {
			if (width > MAX_WIDTH) {
				height *= MAX_WIDTH / width;
				width = MAX_WIDTH;
			}
		} else {
			if (height > MAX_HEIGHT) {
				width *= MAX_HEIGHT / height;
				height = MAX_HEIGHT;
			}
		}

		canvas.width = width;
		canvas.height = height;
		ctx = canvas.getContext('2d');
		// To retain the pixels sharpness.
		ctx.mozImageSmoothingEnabled = false;
		ctx.webkitImageSmoothingEnabled = false;
		ctx.msImageSmoothingEnabled = false;
		ctx.imageSmoothingEnabled = false;
		ctx.drawImage(img, 0, 0, width, height);

		var dataurl = canvas.toDataURL(file.files[0].type, 90 * .01);
		var imageData = dataurl ? that.dataURLtoBlob(dataurl) : '';
		
		return imageData;
	};

	this.retrieveAuthenticationStatus = function(idAuthentication) {

		var idAuthentication = null;

		switch (idAuthentication) {
			case 0:
				idAuthentication = 'Unknown';
				break;
			case 1:
				idAuthentication = 'Passed';
				break;
			case 2:
				idAuthentication = 'Failed';
				break;
			case 3:
				idAuthentication = 'Skipped';
				break;
			case 4:
				idAuthentication = 'Caution';
				break;
			case 5:
				idAuthentication = 'Attention';
				break;
			default:
				idAuthentication = 'Unknown';
				break;
		}

		return idAuthentication;
	};

	this.isIDExpired = function(alerts) {
		var expirationAlert = $filter('filter')(alerts, {
			Key: 'Document Expired'
		}, true)[0];
		var isDocumentExpired = expirationAlert ? (expirationAlert.Result === 4 || expirationAlert.Result === 5) : false;
		
		return isDocumentExpired;
	};

	this.formatResults = function(idDetails) {
		var formatedResults = {};

		formatedResults.document_type = idDetails.document_class_name ? idDetails.document_class_name : '';
		formatedResults.document_number = idDetails.document_number ? idDetails.document_number : '';
		formatedResults.first_name = idDetails.first_name ? idDetails.first_name : '';
		formatedResults.last_name = idDetails.surname ? idDetails.surname : '';
		formatedResults.full_name = idDetails.full_name ? idDetails.full_name : '';
		formatedResults.nationality = idDetails.nationality_code ? idDetails.nationality_code : '';
		formatedResults.expiration_date = idDetails.expiration_date && idDetails.expiration_date !== 'Invalid date' ? idDetails.expiration_date : '';
		formatedResults.date_of_birth = idDetails.birth_date && idDetails.birth_date !== 'Invalid date' ? idDetails.birth_date : '';

		return formatedResults;
	};
});