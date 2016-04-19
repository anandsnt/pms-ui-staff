module.exports = {
	getList : function() {
		var sharedRoot 	= 'shared/',
			jsLibRoot 		= sharedRoot + 'lib/js/',
			controllerRoot 	= 'rover/controllers/',
			servicesRoot 	= 'rover/services/',
			assetsForScreen = {
				minifiedFiles: [
                         jsLibRoot + 'angular-multi-select.js'
				],
				nonMinifiedFiles: [

                    'rover/directives/delayTextbox/rvDelayTextBox.js',
                    'rover/directives/Autogrowing text field/autoGrowFieldDirective.js',
                    'rover/directives/checkBox/**/*.js',
                    'rover/directives/clearTextbox/**/*.js',

                    'rover/directives/fileRead/**/*.js',
                    'rover/directives/includeTemplate/*.js',
                    'rover/directives/autocomplete/**/*.js',
                    'rover/directives/rateAutoComplete/*.js',
                    'rover/directives/selectBox/*.js',
                    'rover/directives/setTextboxValue/*.js',
                    'rover/directives/textArea/*.js',
                    'rover/directives/textBox/*.js',
                    'rover/directives/toggle/*.js',
                    'rover/directives/companyCardTravelAgentCardAutoComplete/*.js',
                    'rover/directives/overbookingAlert/rvOverbookingCalendar.js',
                    'rover/directives/onetimemousemove/*.js',
                    'rover/directives/fullCalendar/twoMonthCalendar.js', // FOR ROOM & RATES CALENDAR
                    'rover/directives/ngrepeatend/ngrepeatend.js',
                    'shared/directives/tooltip/qtipfc.js',// FOR ROOM & RATES CALENDAR
                    'shared/directives/emitWhen/emitWhen.js',
                    'shared/directives/limitInputRange/limitInputRange.js',
                    'rover/directives/multiOptionSelection/multiOptionSelection.js',

                    jsLibRoot + 'fullcalender/**/*.js'
				]
			};
		return assetsForScreen;
	}
};