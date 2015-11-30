module.exports = {	
	getList : function() {
		var sharedRoot 	= 'shared/',
		jsLibRoot 		= sharedRoot + 'lib/js/',
		roverRoot 		= 'rover/',
		diaryViewRoot 	= roverRoot + 'react/diary/',
		diaryJsAssets 	= [

			jsLibRoot + "react/react.min.js",
			jsLibRoot + "react/JSXTransformer.js",
			jsLibRoot + "react/react-with-addons.min.js",
			roverRoot + "directives/ngReact/ngReact.js",
			roverRoot + "services/diary/**/*.js",
			roverRoot + "services/reservation/rvReservationBaseSearchSrv.js",
			roverRoot + "services/reservation/rvReservationSummarySrv.js",
			roverRoot + "services/rateManager/rmFilterOptionsSrv.js",
			roverRoot + "services/payment/rvGuestPaymentSrv.js",
			roverRoot + "controllers/diary/**/*.js",
			diaryViewRoot + '**/*.js',
		];		
		
		return diaryJsAssets;
	}
};