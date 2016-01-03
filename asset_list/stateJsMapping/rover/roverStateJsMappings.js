module.exports = {
	getStateMappingList : function () {
		var roverJsListRoot = '../../asset_list/js/rover/';
		return {
			'rover.diary': roverJsListRoot + 'diaryJsAssetList.js',
			'rover.dashboard': roverJsListRoot + 'dashboardJsAssetList.js',
			'rover.reservation': roverJsListRoot + 'stayCardJsAssetList.js',
			'rover.availability': roverJsListRoot + 'availabilityJsAssetList.js',
			'rover.reports': roverJsListRoot + 'reportsJsAssetList.js',
			'rover.availability': roverJsListRoot + 'availabilityJsAssetList.js',
			'rover.ratemanager': roverJsListRoot + 'rateManagerJsAssetList.js',
			'rover.housekeeping': roverJsListRoot + 'houseKeepingJsAssetList.js',
			'rover.companycardsearch': roverJsListRoot + 'companyCardSearchJsAssetList.js',
			'rover.companycarddetails': roverJsListRoot + 'companyCardDetailsJsAssetList.js',
			'rover.groups': roverJsListRoot + 'groupJsAssetList.js',
			'rover.allotments': roverJsListRoot + 'allotmentJsAssetList.js'
		}
	}
}