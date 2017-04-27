sntZestStation.controller('zsThemeActionsCtrl', [
    '$scope',
    '$state',
    'zsGeneralSrv',
    '$timeout',
    'zsHotelDetailsSrv',
    'zsGeneralSrv',
    '$log',
    function($scope, $state, zsGeneralSrv, $timeout, zsHotelDetailsSrv, zsGeneralSrv, $log) {

        BaseCtrl.call(this, $scope);
		

		/** ******************************************************************************
		 *  Theme based actions starts here
		 ********************************************************************************/

        /*
            :: themesWithLicensedFonts ::
            key = hotel theme, 
            value = specific URL to the licensed font (should only request in production)
            --***-- for testing, please use placeholder URLs
         */
        var themesWithLicensedFonts = {
            'public': 'https://cloud.typography.com/7902756/7320972/css/fonts.css',
            'public_v2': 'https://cloud.typography.com/7902756/7320972/css/fonts.css',
            // PLACEHOLDER (for duke) UNTIL STAYNTOUCH IS READY TO RELEASE Typekit Update
            'duke': 'duke.font.placeholder.css',
            // 'duke': 'https://use.typekit.net/wyk4xkn.js' // SNT typekit account
            // 'duke': 'https://use.typekit.net/hay8wrs.js' // Mike's typekit account (for dev/testing)
            // 
            // TODO: PASS the typekit URL from Hotel/SNT Admin and use here as currentHotelTypekitURL
            /* typekit example implement via html/script

                <script src="https://use.typekit.net/wyk4xkn.js"></script>
                <script>try{Typekit.load({ async: true });}catch(e){}</script>
             */
        };

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

                // Set the Theme css reference to file
                var fileref = document.createElement('link');
                fileref.setAttribute('rel', 'stylesheet');
                fileref.setAttribute('type', 'text/css');
                fileref.setAttribute('href', url);
                $('body').attr('id', theme);
                $('body').append(fileref);


                // debugging - inProd() needs to be TRUE for loading licensed font
                if (hotelHasLicensedFont(theme) && $scope.inProd()) {
                    // we load fonts using two different services
                    // one provides the css as a .css and the other as a .js 

                    $log.log('[ ' + theme + ' ] theme using licensed font**');
                    url = getHotelLicensedFont(theme);
                    if (themesWithLicensedFonts[theme].indexOf('.js') !== -1){
                        fileref = document.createElement('script');

                        fileref.setAttribute('type', 'text/javascript');
                        fileref.setAttribute('src', url);
                        $('head').attr('id', theme);
                        $('head').append(fileref);
                        // Typekit needs to send a sync request to fetch and update the request count
                        setTimeout(function(){
                            try{Typekit.load({ async: true });}catch(e){console.log(arguments);};
                            // TODO:
                            // document.getElementById("body").style.fontFamily = fontFamilyFromHotelDetails;

                        },3000)
                    } else {
                        fileref = document.createElement('link');

                        fileref.setAttribute('rel', 'stylesheet');
                        fileref.setAttribute('type', 'text/css');
                        fileref.setAttribute('href', url);
                        $('head').attr('id', theme);
                        $('head').append(fileref);
                    }
                }

                setThemeByName(theme);
            } else {
                return;
            }
        };

        var hotelHasLicensedFont = function(theme) {
            return !_.isUndefined(themesWithLicensedFonts[theme]);
        };

        var getHotelLicensedFont = function(theme) {
            // public | duke
            return themesWithLicensedFonts[theme];
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

        $scope.$on('TOGGLE_LANGUAGE_TAGS', function(evtObj, onOff) {
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
                old = el.attr('old-text'),
                elInnerHtml = '';

                if (el[0].old_innerHTML){ // this property is generated from the editibleText directive if breaks are detected

                    if (el && el[0]){
                        elInnerHtml = el[0].innerHTML;
                        if (elInnerHtml){
                            if (elInnerHtml.indexOf('&lt;') !== -1 || elInnerHtml.indexOf('<br>') !== -1){
                                currentText = elInnerHtml;
                            }   
                        }
                    }
                }

                if (currentText === tag || onOff === 'off') {
                    // if showing the tag, switch back to text, 
                    // just swap the old-text with current value in json file
                    if (old || currentText === tag){
                        el[0].innerHTML = old
                        $scope.saveLanguageEditorChanges(tag, old, true);    
                    }

                } else {
                    el[0].innerHTML = tag;
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