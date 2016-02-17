module.exports = {
	getStateMappingList : function () {
		var roverJsListRoot = '../../asset_list/js/rover/';
		return {
			'rover.diary' 		: roverJsListRoot + 'diaryJsAssetList.js',
			'rover.dashboard' 	: roverJsListRoot + 'dashboardJsAssetList.js',
			'rover.reservation'	: roverJsListRoot + 'stayCardJsAssetList.js',
			'rover.availability': roverJsListRoot + 'availabilityJsAssetList.js',
			'rover.reports'		: roverJsListRoot + 'reportsJsAssetList.js',
			'rover.ratemanager'	: roverJsListRoot + 'rateManagerJsAssetList.js',
			'rover.housekeeping': roverJsListRoot + 'houseKeepingJsAssetList.js',
			'rover.groups' 		: roverJsListRoot + 'groupJsAssetList.js',
			'rover.allotments' 	: roverJsListRoot + 'allotmentJsAssetList.js',
			'rover.financials' 	: roverJsListRoot + 'financialsJsAssetList.js',
			'postcharge'		: roverJsListRoot + 'postChargeJsAssetList.js',
			'endofday'			: roverJsListRoot + 'endOfDayJsAssetList.js',
			'directives'		: roverJsListRoot + 'directivesJsAssetList.js',
			'react.files' 		: roverJsListRoot + 'reactJsAssetList.js',
			'highcharts'		: roverJsListRoot + 'highchartsJsAssetList.js',
			'addBillingInfo'	: roverJsListRoot + 'addBillingInfoPopupJsAssetList.js',
			'changestaydates'	: roverJsListRoot + 'changeDatesJsAssetList.js',
			'rover.accounts'	: roverJsListRoot + 'accountsJsAssetList.js',
			'rover.workManagement'	: roverJsListRoot + 'workManagementJsAssetList.js',
			'staffpasswordchange'	: roverJsListRoot + 'staffPasswordChangeJsAssetList.js',
			'rover.actionsManager'	: roverJsListRoot + 'actionJsAssetList.js',
			'rover.companycardsearch'	: roverJsListRoot + 'companyCardSearchJsAssetList.js',
			'rover.companycarddetails'	: roverJsListRoot + 'companyCardDetailsJsAssetList.js',
			'rover.reservation.staycard.activitylog' 	: roverJsListRoot + 'activityLogJsAssetList.js',
			'rover.reservation.staycard.billcard'		: roverJsListRoot + 'billScreenJsAssetList.js',
			'rover.reservation.staycard.roomassignment'	: roverJsListRoot + 'roomAssignmentJsAssetList.js'
		}
	}
}