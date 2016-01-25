module.exports = {	
	getList : function() {
		var roverRoot 		= 'rover/',
		comapnycardDetailsJsAssets = {
			minifiedFiles: [],
			nonMinifiedFiles: [			
				roverRoot + "controllers/companycard/details/**/*.js",
				roverRoot + "controllers/cardsOutside/rvCompanyCardArTransactionsCtrl.js",
				roverRoot + "services/rvCompanyCardSrv.js",
				'rover/controllers/contractStartCalendarCtrl.js',
				'rover/controllers/contractEndCalendarCtrl.js',

 				'rover/directives/delayTextbox/rvDelayTextBox.js',
				'rover/directives/Autogrowing text field/autoGrowFieldDirective.js',

				'rover/directives/checkBox/**/*.js',
				'rover/directives/clearTextbox/**/*.js',

				'rover/directives/fileRead/**/*.js',
				'rover/directives/Outside Click handler/**/*.js',
				'rover/directives/autocomplete/*.js',
				'rover/directives/rateAutoComplete/*.js',
				'rover/directives/selectBox/*.js',
				'rover/directives/setTextboxValue/*.js',
				'rover/directives/textArea/*.js',
				'rover/directives/textBox/*.js',
				'rover/directives/toggle/*.js',
			]
		};
		return comapnycardDetailsJsAssets;
	}
};