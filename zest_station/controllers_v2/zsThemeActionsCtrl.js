sntZestStation.controller('zsThemeActionsCtrl', [
    '$scope',
    '$state',
    '$timeout',
    'zsHotelDetailsSrv',
    'zsGeneralSrv',
    '$log',
    function($scope, $state, $timeout, zsHotelDetailsSrv, zsGeneralSrv, $log) {

        BaseCtrl.call(this, $scope);

        var setSvgsToBeLoaded = function(iconsPath, commonIconsPath, useCommonIcons, diffHomeIconsOnly) {
            var iconBasePath = !useCommonIcons ? iconsPath : commonIconsPath;
            
            $scope.activeScreenIcon = 'bed';
            if ($scope.zestStationData.key_create_file_uploaded.indexOf('/logo.png') !== -1) {
                $scope.zestStationData.key_create_file_uploaded = '';
            }
            if (typeof $scope.zestStationData.scan_passport_file_uploaded === 'undefined') {
                $scope.zestStationData.scan_passport_file_uploaded = '';
            }

            // TODO: delete $scope.zestStationData.key_create_file_uploaded after the migration in in place
            $scope.zestImages.key_create_file_uploaded = $scope.zestImages.key_create_file_uploaded ? $scope.zestImages.key_create_file_uploaded : $scope.zestStationData.key_create_file_uploaded;

            $scope.icons = {
                url: {
                    active_screen_icon: iconsPath + '/screen-' + $scope.activeScreenIcon + '.svg',
                    booknow: iconBasePath + '/calendar.svg', // TODO, need generic icon for default (css update needed)

                    checkin: iconBasePath + '/checkin.svg',
                    checkout: iconBasePath + '/checkout.svg',
                    key: iconBasePath + '/key.svg',

                    checkmark: commonIconsPath + '/checkmark.svg',

                    oos: iconBasePath + '/oos.svg',
                    back: iconBasePath + '/back.svg',
                    close: iconBasePath + '/close.svg',

                    date: iconBasePath + '/date.svg',
                    staff: iconBasePath + '/staff.svg',
                    email: iconBasePath + '/email.svg',
                    pen: iconBasePath + '/pen.svg',
                    creditcard: iconBasePath + '/creditcard.svg',
                    keyboard: iconBasePath + '/keyboard.svg',
                    noprint: iconBasePath + '/no-print.svg',
                    print: iconBasePath + '/print.svg',
                    confirmation: iconBasePath + '/confirmation.svg',
                    moon: iconBasePath + '/moon.svg',
                    qr: iconBasePath + '/qr-scan.svg',
                    qr_noarrow: iconBasePath + '/qr-scan_noarrow.svg',
                    createkey: iconBasePath + $scope.zestImages.key_create_file_uploaded,
                    logo: iconBasePath + '/print_logo.svg',
                    watch: iconBasePath + '/watch.svg',
                    qr_arrow: iconBasePath + '/qr-arrow.svg',
                    clear_icon: iconBasePath + '/x.svg',
                    left_arrow_icon: commonIconsPath + '/arrow-left.svg',
                    right_arrow_icon: commonIconsPath + '/arrow-right.svg',
                    late_checkout_icon: iconBasePath + '/late-checkout.svg',
                    scanpassport: iconBasePath + ($scope.zestStationData.scan_passport_file_uploaded.length > 0) ? $scope.zestStationData.scan_passport_file_uploaded : '',
                    success: iconBasePath + '/success.svg',
                    user_with_id: iconBasePath + '/user-id.svg',
                    user_without_id: iconBasePath + '/user.svg',
                    location: iconBasePath + '/location.svg',
                    loyalty: iconBasePath + '/loyalty.svg',
                    clear_text: commonIconsPath + '/clear-text.svg'
                }
            };

            if ($scope.icons.url.scanpassport.length > 0) {
                $scope.scanpassport_image_uploaded = true;
            } else {
                $scope.scanpassport_image_uploaded = false;
            }

            if (useCommonIcons) {
                $scope.icons.url.qr_noarrow = iconsPath + '/key.svg';
            }
            if ($scope.zestStationData.theme === 'duke') {
                $scope.icons.url.logo = iconsPath + '/logo.svg';
            }
            if (diffHomeIconsOnly) {
                $scope.icons.url.checkin = iconsPath + '/checkin.svg';
                $scope.icons.url.checkout = iconsPath + '/checkout.svg';
                $scope.icons.url.key = iconsPath + '/key.svg';
                if ($scope.zestStationData.theme !== 'epik') {
                    $scope.icons.url.logo = iconsPath + '/logo-print.svg';
                }
                $scope.icons.url.logo = iconsPath + '/logo-print.svg';
            }

            if ($scope.zestStationData.theme === 'yotel') {
                $scope.icons.url.checkmark = iconsPath + '/checkmark.svg';
                $scope.icons.url.location = iconsPath + '/location.svg';
            }
            if ($scope.zestStationData.theme === 'public_v2') {
                $scope.icons.url.pen = $scope.icons.url.keyboard;
                $scope.icons.url.checkmark = iconsPath + '/checkmark.svg';
            }
        };

        $scope.$on('changeIconsBasedOnHotelSetting', function() {
            if ($scope.zestStationData.theme === 'snt' && $scope.zestStationData.ccReader === 'local') { 
                // if we are reading locally, we'll show the ICMP icons for our SNT 
                $scope.icons.url.creditcard_icmp = $scope.iconsPath + '/demo_swiper.svg';
                $scope.icons.url.createkey_icmp = $scope.iconsPath + '/demo_keyencoder.svg';
                $log.warn('using demo icons for create key and credit card reading');
                $scope.icmp = true;
            } else if ($scope.zestStationData.theme === 'public_v2') {
                $scope.icons.url.createkey_icmp = $scope.iconsPath + '/encode_image.svg';
                $scope.icons.url.creditcard_icmp = $scope.iconsPath + '/icmp_swipe.svg';
                $scope.icmp = true;
            }
            else if ($scope.zestStationData.theme === 'huntley' ||
                $scope.zestStationData.theme === 'row-nyc') {
                $scope.icons.url.createkey_icmp = $scope.iconsPath + '/encode_image.svg';
                $scope.icons.url.creditcard_icmp = $scope.iconsPath + '/demo_swiper.svg';
                $scope.icmp = true;
            } 
            else if ($scope.zestStationData.theme === 'ihg' && $scope.zestStationData.ccReader === 'local') {
                // TO DO LATER: clean above code to avoid duplicate code after this HF
                $scope.icons.url.creditcard_icmp = $scope.iconsPath + '/demo_swiper.svg';
                $scope.icmp = true;
            } else {
                $scope.icmp = false;
            }
        });


        /** ******************************************************************************
         *  Yotel has and icon at the top of the page which change depending on the state
         ********************************************************************************/

        $scope.setScreenIcon = function(name) {
            if ($scope.zestStationData.theme !== 'yotel') {
                return;
            } 
            $scope.activeScreenIcon = name;
            if ($scope.icons && $scope.icons.url) {
                $scope.icons.url.active_screen_icon = $scope.iconsPath + '/screen-' + $scope.activeScreenIcon + '.svg';
            }
            
        };
        /**
         * get paths for theme based Icon files
         **/
        $scope.nonCircleNavIcons = false;
        var updateIconPath = function(theme) {
            var commonIconsPath = '/assets/zest_station/css/icons/default';

            // var basicHomeIcons = ['zoku'],
            var niceHomeIcons = ['avenue',
                    'sohotel',
                    'epik',
                    'public',
                    'public_v2',
                    'duke',
                    'de-jonker',
                    'chalet-view',
                    'freehand',
                    'row-nyc',
                    'circle-inn-fairfield',
                    'cachet-boutique',
                    'hi-ho',
                    'first',
                    'viceroy-chicago',
                    'amrath',
                    'jupiter',
                    'huntley',
                    'queen',
                    'belle',
                    'ihg'
                ],
                nonCircleNavIcons = ['public_v2'];// minor adjustment to the back/close icons for some themes (only show the inner x or <)


            if (_.contains(nonCircleNavIcons, theme)) {
                $scope.nonCircleNavIcons = true;
                commonIconsPath = '/assets/zest_station/css/icons/public_v2';
            } else {
                $scope.nonCircleNavIcons = false;
            }

            if (theme === 'yotel') {
                $scope.$emit('DONT_USE_NAV_ICONS');
                $scope.theme = theme;
                $scope.iconsPath = '/assets/zest_station/css/icons/yotel';
                setSvgsToBeLoaded($scope.iconsPath, commonIconsPath, false);
            } else if (theme === 'fontainebleau') {
                $scope.useNavIcons = true;
                // nothing else
            } else if (theme === 'conscious') {
                $scope.useNavIcons = true;
                $scope.theme = theme;
                $scope.iconsPath = '/assets/zest_station/css/icons/conscious';
                setSvgsToBeLoaded($scope.iconsPath, commonIconsPath, true);

            } else if (_.contains(niceHomeIcons, theme)) {
                $scope.useNavIcons = true;
                $scope.theme = theme;
                $scope.iconsPath = '/assets/zest_station/css/icons/' + theme;
                if (theme === 'public_v2') {
                    $scope.iconsPath = commonIconsPath;
                    $scope.zestStationData.themeUsesLighterSubHeader = true;
                }
                setSvgsToBeLoaded($scope.iconsPath, commonIconsPath, true, true); // last arg, is to only show different icons on Home, other icons use default

            } else { // zoku and snt use default path
                $scope.useNavIcons = true;
                $scope.iconsPath = commonIconsPath;
                setSvgsToBeLoaded($scope.iconsPath, commonIconsPath, true);
            }

            if (theme === 'yotel') {
                $scope.jumpGalleryIconPath = '/assets/zest_station/css/themes/' + theme + '/gallery/';
            } else { // default icons for all other hotels (for now)
                $scope.jumpGalleryIconPath = '/assets/zest_station/css/themes/snt/gallery/';
            }
        };

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
            'duke': 'duke.font.placeholder.css'
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

            updateIconPath(theme);
            zsHotelDetailsSrv.data.theme = theme.toLowerCase();
            setTimeout(function() {
                $('body').css('display', 'block');
            }, 50);
			// based upon admin settings set printer css styles
			// setPrinterOptions(); - to do
        };


        setSvgsToBeLoaded(iconsPath, iconsPath, true); // (icons path, default path, use default icons)

        var setPrinterOptions = function(theme) {
			// zsUtils function
            if ($scope.zestStationData.zest_printer_option === 'STAR_TAC') {
                if (theme === 'yotel') {
                    applyStylesForYotelStarTac();
                } else {
                    applyStarTacStyles();   
                }
            } else if ($scope.zestStationData.zest_printer_option === 'RECEIPT'  ) {
                applyStylesForYotelReceipt();
            } else {
                applyPrintMargin(); // zsUtils function
            }
        };

        var isASpecialCase = function(theme) {
            return theme === 'public_v2';
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
                if ((hotelHasLicensedFont(theme) && $scope.inProd()) || isASpecialCase(theme)) {
                    // we load fonts using two different services
                    // one provides the css as a .css and the other as a .js 

                    $log.log('[ ' + theme + ' ] theme using licensed font**');
                    url = getHotelLicensedFont(theme);
                    if (themesWithLicensedFonts[theme].indexOf('.js') !== -1) {
                        fileref = document.createElement('script');

                        fileref.setAttribute('type', 'text/javascript');
                        fileref.setAttribute('src', url);
                        $('head').attr('id', theme);
                        $('head').append(fileref);
                        // Typekit needs to send a sync request to fetch and update the request count
                        setTimeout(function() {
                            try {
                                Typekit.load({ async: true });
                            } catch (e) {
                                console.log(arguments);
                            }
                            // TODO:
                            // document.getElementById("body").style.fontFamily = fontFamilyFromHotelDetails;

                        }, 3000);
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
            updateIconPath(theme);
            $scope.$emit('RUN_APPLY');
        });


        /** ******************************************************************************
         *  
         ********************************************************************************/

        $scope.$on('TOGGLE_LANGUAGE_TAGS', function(evtObj, onOff) {
             // enables user (via conosle or developer tools) to show tags on-screen instead of the 
             // translated text
            var tags = $('text'), // grab all <text> selectors, which should only be used for locales
                el, tag, currentText, old, elInnerHtml;

            // for each field with tag, on current screen, replace
            // the current text with the tag text, keep ref to the current text
            // 
            for (var i = 0; i < tags.length; i++) {

                el = $(tags[i]);
                tag = $.trim(el.attr('editable-text'));
                currentText = $.trim(el.text());
                old = el.attr('old-text'),
                elInnerHtml = '';

                if (el[0].old_innerHTML) { // this property is generated from the editibleText directive if breaks are detected

                    if (el && el[0]) {
                        elInnerHtml = el[0].innerHTML;
                        if (elInnerHtml) {
                            if (elInnerHtml.indexOf('&lt;') !== -1 || elInnerHtml.indexOf('<br>') !== -1) {
                                currentText = elInnerHtml;
                            }   
                        }
                    }
                }

                if (currentText === tag || onOff === 'off') {
                    // if showing the tag, switch back to text, 
                    // just swap the old-text with current value in json file
                    if (old || currentText === tag) {
                        el[0].innerHTML = old;
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