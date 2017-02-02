sntZestStation.controller('zsThemeActionsCtrl', [
    '$scope',
    '$state',
    'zsGeneralSrv',
    '$timeout',
    'zsHotelDetailsSrv',
    'zsGeneralSrv',
    function($scope, $state, zsGeneralSrv, $timeout, zsHotelDetailsSrv, zsGeneralSrv) {

        BaseCtrl.call(this, $scope);
		

		/** ******************************************************************************
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
			// based upon admin settings set printer css styles
			// setPrinterOptions(); - to do
        };


        $scope.setSvgsToBeLoaded(iconsPath, iconsPath, true); // (icons path, default path, use default icons)

        var setPrinterOptions = function(theme) {
			// zsUtils function
            if ($scope.zestStationData.zest_printer_option === 'STAR_TAC') {
                if (theme === 'yotel') {
                    applyStylesForYotelStarTac();
                } else {
                    applyStarTacStyles();   
                }
            } else if ($scope.zestStationData.zest_printer_option === 'RECEIPT') {
                if (theme === 'yotel') {
                    applyStylesForYotelReceipt();
                }
            } else {
                applyPrintMargin(); // zsUtils function
            }
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
                var fileref = document.createElement('link');

                fileref.setAttribute('rel', 'stylesheet');
                fileref.setAttribute('type', 'text/css');
                fileref.setAttribute('href', url);
                $('body').attr('id', theme);
                $('body').append(fileref);
                setThemeByName(theme);
            } else {
                return;
            }
        };

		/** ******************************************************************************
		 *  Theme based actions ends here
		 ********************************************************************************/

        $scope.$on('QUICK_SET_HOTEL_THEME', function(evt, theme) {
            var oldLink = $('link');

            for (var i in oldLink) {
                if (oldLink[i].href) {
                    if (oldLink[i].href.indexOf('.css') !== -1) {
                        oldLink[i].href = '';
                    }
                }
            }
            setHotelBasedTheme(theme);
            $scope.$emit('updateIconPath', theme);
            $scope.$emit('RUN_APPLY');
        });

        /** ******************************************************************************
         *  
         ********************************************************************************/

        $scope.$on('TOGGLE_LANGUAGE_TAGS', function() {

             // enables user (via conosle or developer tools) to show tags on-screen instead of the 
             // translated text
            var tags = $('text'), // grab all <text> selectors, which should only be used for locales
                el, tag, currentText, old;

            // for each field with tag, on current screen, replace
            // the current text with the tag text, keep ref to the current text
            // 
            for (var i = 0; i < tags.length; i++) {

                el = $(tags[i]);
                tag = $.trim(el.attr('editable-text'));
                currentText = $.trim(el.text());
                old = el.attr('old-text');

                if ( currentText === tag ) {
                    // if showing the tag, switch back to text, 
                    // just swap the old-text with current value in json file
                    $scope.saveLanguageEditorChanges(tag, old, true);

                } else {
                    // to show the TAG instead of translated text, swap out with the
                    // tag, which is also in the attribute 'editable-text'
                    el.attr('old-text', currentText);
                    // to show the tag instead of the text, make the tag value, same as the tag itself

                    $scope.saveLanguageEditorChanges(tag, tag, true);
                }
            }
            $scope.runDigestCycle();
        });
        
        (function() {// initializeMe
            setHotelBasedTheme(zsGeneralSrv.hotelTheme);
        }());
    }
]);