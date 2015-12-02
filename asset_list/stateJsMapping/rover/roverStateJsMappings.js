module.exports = {
	getStateMappingList : function () {
		var jsListRoot = '../asset_list/js/';
		return {
			'rover.diary': jsListRoot + 'diaryJsAssetList.js',
			'rover.reports': jsListRoot + 'reportsJsAssetList.js',
			'rover.availability': jsListRoot + 'availabilityJsAssetList.js',
			'rover.ratemanager': jsListRoot + 'rateManagerJsAssetList.js'
		}
	}
}