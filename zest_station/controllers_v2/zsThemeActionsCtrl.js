sntZestStation.controller('zsThemeActionsCtrl', [
	'$scope',
	'$state',
	'zsGeneralSrv',
	'$timeout',
	'zsHotelDetailsSrv',
	'zsGeneralSrv',
	function($scope, $state, zsGeneralSrv, $timeout, zsHotelDetailsSrv, zsGeneralSrv) {

		BaseCtrl.call(this, $scope);
		

		/********************************************************************************
		 *  Theme based actions starts here
		 ********************************************************************************/

		var iconsPath = '/assets/zest_station/css/icons/default';
		/**
		 * get paths for theme based CSS files
		 **/
		var setThemeByName = function(theme) {
			$('body').css('display', 'none');
			var link, logo;
			$scope.$emit('updateIconPath', theme);
			zsHotelDetailsSrv.data.theme = theme.toLowerCase();
			setTimeout(function() {
				$('body').css('display', 'block');
			}, 50);
			//based upon admin settings set printer css styles
			// setPrinterOptions(); - to do
		};


		$scope.setSvgsToBeLoaded(iconsPath, iconsPath, true); //(icons path, default path, use default icons)

		var setPrinterOptions = function(theme) {
			//zsUtils function
			if ($scope.zestStationData.zest_printer_option === "STAR_TAC") {
				(theme === 'yotel') ? applyStylesForYotelStarTac(): applyStarTacStyles();
			} else if ($scope.zestStationData.zest_printer_option === "RECEIPT") {
				(theme === 'yotel') ? applyStylesForYotelReceipt(): "";
			} else {
				applyPrintMargin(); //zsUtils function
			};
		};
		var setHotelBasedTheme = function(theme) {
			/*
			 * This will identify the theme attached to the hotel
			 * then set by name (will do this for now, since there are only 2 customers)
			 * but will need to move out to more automated method
			 */
			$scope.zestStationData.theme = theme;
			setPrinterOptions(theme);
			if (theme !== null) {
				var url = $scope.cssMappings[theme.toLowerCase()];
				var fileref = document.createElement("link");
				fileref.setAttribute("rel", "stylesheet");
				fileref.setAttribute("type", "text/css");
				fileref.setAttribute("href", url);
				$('body').attr('id', theme);
				$('body').append(fileref);
				setThemeByName(theme);
			} else {
				return;
			};
		};


		/********************************************************************************
		 *  Theme based actions ends here
		 ********************************************************************************/


		var getHotelStationTheme = function() {
			setHotelBasedTheme(zsGeneralSrv.hotelTheme);
		}();
	}
]);