var createStyleNodeWithString = function(str) {
	var node = document.createElement('style');

	node.innerHTML = str;
	document.head.appendChild(node);
};

// startac specific print styles
var applyStarTacStyles = function() {
	var starTacStyles = '@page { margin: 1cm 0.05cm; }#registration-card .logo{width:150px !important} .invoice-logo .logo{width:50% !important}.page-print{margin-left:20px;width:330px;>div.logo>div{ position:fixed;top:-80px}>div.content{position:fixed;top:30px;text-align:left !important;padding-left:2%;padding-right:2%;>strong.footer{ text-align:center !important}>strong.large_txt,span.large_txt{font-size:2em}span>strong.large_txt{font-size:2em}span{font-size:1.2em}span.reg_text{margin-top:-60px;white-space:pre-wrap}';

	createStyleNodeWithString(starTacStyles);
	console.info("applied startac styles");
};

var applyStylesForYotelStarTac = function() {
	var starTacStyles = '.ows-footer{position:fixed; margin-top:50; left:0;font-size:1px;}.invoice-logo h1{visibility:hidden;}.invoice-logo .logo{width:100px !important;}#registration-card .ows-content{top:3cm !important}.page-print{width:340px;}#registration-card{padding-top:1cm !important;padding-bottom:1cm !important;}.page-print{margin-left:4px;}#registration-card .logo{width:120px !important} #registration-card .content{text-align:left;position:fixed;top:1cm;bottom:2cm;width:340px;padding-left:0;padding-right:0;}.page-print > div.content{position:fixed;top:30px;text-align:left !important;padding-left:2%;padding-right:2%}.page-print > div.content > strong.footer{text-align:center !important}.page-print > div.content > strong.large_txt,.page-print > div.content span.large_txt{font-size:2em}.page-print > div.content span > strong.large_txt{font-size:2em}.page-print > div.content span{font-size:1.2em}.page-print > div.content span.reg_text{margin-top:-60px;white-space:pre-wrap}#guest-bill .invoice-body .invoice-details .row .desc-cell{min-width:120px;}#guest-bill .invoice-body .invoice-details .row .date-cell{min-width:75px;}';

	createStyleNodeWithString(starTacStyles);

};
// for non startTac
var applyPrintMargin = function() {
	var starTacStyles = '@page { margin: 1cm 9cm;}#registration-card,#guest-bill{padding-left: 1cm;padding-right: 1cm;}';

	createStyleNodeWithString(starTacStyles);
};

var applyStylesForYotelReceipt = function() {
	var receiptStyles = '.ows-footer{position:fixed; margin-top:50; left:0;font-size:1px;}.ows-footer {page-break-after: always;}.invoice-logo h1{visibility:hidden;}.invoice-logo .logo{width:100px !important;}@page { margin-bottom: 2cm }#registration-card .ows-content{top:2.9cm !important;padding-left:5px;padding-bottom:100px;}.page-print{width:240px;}#registration-card{padding-top:1cm !important;padding-bottom:1cm !important;}.page-print{margin-left:6px;}#registration-card .logo{width:100px !important;top: 0.25cm;} #registration-card .content{text-align:left;position:fixed;top:1cm;bottom:2cm;width:240px;padding-left:1px;padding-right:1px;}.page-print > div.content{position:fixed;top:30px;text-align:left !important;padding-left:2%;padding-right:2%}.page-print > div.content > strong.footer{text-align:center !important}.page-print > div.content > strong.large_txt,.page-print > div.content span.large_txt{font-size:1.6em}.page-print > div.content span > strong.large_txt{font-size:1.5em}.page-print > div.content span{font-size:1.2em}.page-print > div.content span.reg_text{margin-top:-60px;white-space:pre-wrap}#guest-bill .bill-room-details{width:80% !important;}#guest-bill .invoice-body .invoice-details .row .cell{min-width:50px;}#guest-bill .bill-room-details{width:80% !important;}#guest-bill .invoice-body .invoice-details .row .desc-cell{min-width:80px;}';

	createStyleNodeWithString(receiptStyles);

};

// add the print orientation before printing
var addPrintOrientation = function() {
	$('head').append("<style id='print-orientation'>@page { size: portrait; }</style>");
	$('body').append("<style>@page { margin: 0px; }</style>");
};

// remove the print orientation after printing
var removePrintOrientation = function() {
	$('#print-orientation').remove();
};

var setBeforePrintSetup = function() {
	$("header .logo").addClass('logo-hide');
	$("header .h2").addClass('text-hide');
	$('.popup').hide(); // hide timeout elements
	$('.invis').hide(); // hide timeout elements
	$('#popup-overlay').hide(); // hide timeout elements
};


var formatDateIntoStandard = function(dateString, separator) {
	// date has to be formatted
	var dayIndex = dateString.indexOf(separator);
	var day = dateString.substring(0, dayIndex);
	var dateStringWithoutDay = dateString.substring(dayIndex + 1, dateString.length);
	var monthIndex = dateStringWithoutDay.indexOf(separator);
	var month = dateStringWithoutDay.substring(0, monthIndex);
	var year = dateStringWithoutDay.substring(monthIndex + 1, dateStringWithoutDay.length);

	return new Date(month + separator + day + separator + year);
};

var returnUnformatedDateObj = function(dateString, dateformat) {
	if (dateformat === 'MM-DD-YYYY' || dateformat === 'MM/DD/YYYY') {
		return new Date(dateString);
	} else if (dateformat === 'DD-MM-YYYY') {
		return formatDateIntoStandard(dateString, '-');
	} else if (dateformat === 'DD/MM/YYYY') {
		return formatDateIntoStandard(dateString, '/');
	}
};

var setDisplayContentHeight = function() {
	if ($('#textual').length) {
		var $contentHeight = ($('#content').outerHeight()),
			$h1Height = $('#content h1').length ? $('#content h1').outerHeight(true) : 0,
			$h2Height = $('#content h2').length ? $('#content h2').outerHeight(true) : 0,
			$h3Height = $('#content h3').length ? $('#content h3').outerHeight(true) : 0,
			$headingsHeight = parseFloat($h1Height + $h2Height + $h3Height),
			$textualHeight = parseFloat($contentHeight - $headingsHeight);
		// $('#textual').css('height', $textualHeight + 'px');

		$('#textual').css('height', '45%');
		$('#textual').css('max-height', '100%');
	} else {
		return;
	}
};

var scrollContentsUpIfNeeded = function(scrollUp) {
	if (scrollUp && !$( "body" ).hasClass( "showing-keyboard" )) {
		$("body").addClass("showing-keyboard");
	}
	if (scrollUp && document.getElementById("popup") && !$("#popup").hasClass("lift-popup")) {
		$("#popup").addClass("lift-popup");
	}
	return;
};

var scrollContentsDown = function() {
	$("body").removeClass("showing-keyboard");
	if (document.getElementById("popup")) {
		$("#popup").removeClass("lift-popup");
	}
};

var retrieveFeatureDetails = function(feature_list, feature_name) {
	var requestedFeature = _.find(feature_list, function(feature) {
		return feature.feature_name === feature_name;
	});

	return requestedFeature;
};

var processCameraConfigs = function(iOSCameraEnabled,connectedCameras, featuresSupportedInIosApp) {
	var idCaptureConfig = {
		useiOSAppCamera: iOSCameraEnabled,
		useExtCamera:connectedCameras.length > 0,
		useExtCamForFR: connectedCameras.length > 0,
		useAutoDetection: false
	};

	if (localStorage.getItem('dontUseAutoDetection') === "NO" && !_.isUndefined(cordova)) {
		var idCaptureFeature = retrieveFeatureDetails(featuresSupportedInIosApp, 'CAPTURE_ID');

		if (idCaptureFeature) {
			idCaptureConfig.useAutoDetection = true;
			idCaptureConfig.idCapturePluginName = idCaptureFeature.plugin_details ? idCaptureFeature.plugin_details.plugin_name : '';
			idCaptureConfig.idCaptureActionName = idCaptureFeature.plugin_details ? idCaptureFeature.plugin_details.action : '';
		}
	}
	return idCaptureConfig;
};
