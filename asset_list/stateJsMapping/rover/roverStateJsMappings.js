module.exports = {
	getStateMappingList : function () {
		var jsListRoot = '../../asset_list/js/';
		return {
			'rover.diary': jsListRoot + 'diaryJsAssetList.js',
			'rover.dashboard': jsListRoot + 'dashboardJsAssetList.js',
			'rover.reservation': jsListRoot + 'stayCardJsAssetList.js',
			'rover.availability': jsListRoot + 'availabilityJsAssetList.js',
			'rover.reports': jsListRoot + 'reportsJsAssetList.js',
			'rover.availability': jsListRoot + 'availabilityJsAssetList.js',
			'rover.ratemanager': jsListRoot + 'rateManagerJsAssetList.js',
			'rover.housekeeping': jsListRoot + 'houseKeepingJsAssetList.js',
			'rover.companycardsearch': jsListRoot + 'companyCardSearchJsAssetList.js',
			'rover.companycarddetails': jsListRoot + 'companyCardDetailsJsAssetList.js',
			'rover.groups': jsListRoot + 'groupJsAssetList.js',
			'rover.allotments': jsListRoot + 'allotmentJsAssetList.js'
		}
	}
}