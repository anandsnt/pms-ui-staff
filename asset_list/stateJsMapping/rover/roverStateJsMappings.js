module.exports = {
	getStateMappingList : function () {
		var roverJsListRoot = '../../asset_list/js/rover/';
		return {
			'rover.diary': {
				filename: roverJsListRoot + 'diaryJsAssetList.js',
				babelify: false
			},
			'rover.todo': {
				filename: roverJsListRoot + 'todoJsAssetList.js',
				babelify: true
			},
			'rover.dashboard': {
				filename: roverJsListRoot + 'dashboardJsAssetList.js',
				babelify: false
			},
			'rover.reservation': {
				filename: roverJsListRoot + 'stayCardJsAssetList.js',
				babelify: false
			},
			'rover.availability': {
				filename: roverJsListRoot + 'availabilityJsAssetList.js',
				babelify: false
			},
			'rover.reports': {
				filename: roverJsListRoot + 'reportsJsAssetList.js',
				babelify: false
			},
			'rover.rateManager': {
				filename: roverJsListRoot + 'newRateManagerJsAssetList.js',
				babelify: true
			},
			'rover.housekeeping': {
				filename: roverJsListRoot + 'houseKeepingJsAssetList.js',
				babelify: false
			},
			'rover.groups': {
				filename: roverJsListRoot + 'groupJsAssetList.js',
				babelify: false
			},
			'rover.allotments': {
				filename: roverJsListRoot + 'allotmentJsAssetList.js',
				babelify: false
			},
			'rover.financials': {
				filename: roverJsListRoot + 'financialsJsAssetList.js',
				babelify: false
			},
			'postcharge': {
				filename: roverJsListRoot + 'postChargeJsAssetList.js',
				babelify: false
			},
			'endofday': {
				filename: roverJsListRoot + 'endOfDayJsAssetList.js',
				babelify: false
			},
			'directives': {
				filename: roverJsListRoot + 'directivesJsAssetList.js',
				babelify: true
			},
			'react.files': {
				filename: roverJsListRoot + 'reactJsAssetList.js',
				babelify: false
			},
			'redux.files': {
				filename: roverJsListRoot + 'reduxJsAssetList.js',
				babelify: false
			},
			'highcharts': {
				filename: roverJsListRoot + 'highchartsJsAssetList.js',
				babelify: false
			},
			'addBillingInfo': {
				filename: roverJsListRoot + 'addBillingInfoPopupJsAssetList.js',
				babelify: false
			},
			'changestaydates': {
				filename: roverJsListRoot + 'changeDatesJsAssetList.js',
				babelify: false
			},
			'rover.accounts': {
				filename: roverJsListRoot + 'accountsJsAssetList.js',
				babelify: false
			},
			'rover.workManagement': {
				filename: roverJsListRoot + 'workManagementJsAssetList.js',
				babelify: false
			},
			'staffpasswordchange': {
				filename: roverJsListRoot + 'staffPasswordChangeJsAssetList.js',
				babelify: false
			},
			'rover.actionsManager': {
				filename: roverJsListRoot + 'actionJsAssetList.js',
				babelify: false
			},
			'rover.companycardsearch': {
				filename: roverJsListRoot + 'companyCardSearchJsAssetList.js',
				babelify: false
			},
			'rover.companycarddetails': {
				filename: roverJsListRoot + 'companyCardDetailsJsAssetList.js',
				babelify: false
			},
			'rover.reservation.staycard.activitylog': {
				filename: roverJsListRoot + 'activityLogJsAssetList.js',
				babelify: false
			},
			'rover.reservation.staycard.billcard': {
				filename: roverJsListRoot + 'billScreenJsAssetList.js',
				babelify: false
			},
			'rover.reservation.staycard.roomassignment': {
				filename: roverJsListRoot + 'roomAssignmentJsAssetList.js',
				babelify: false
			}
		};
	}
};