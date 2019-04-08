/**
 * Service used for tablet-kiosk UI (Zest Station)
 */

sntZestStation.service('zsGeneralSrv', ['$http', '$q', 'zsBaseWebSrv', 'zsBaseWebSrv2', '$translate',
    function($http, $q, zsBaseWebSrv, zsBaseWebSrv2, $translate) {
        var that = this;

        // this.refToLatestPulledTranslations; // used by generalRouter to fetch and store Language Locale files
        /*
        * The configuredHotels list are the hotels which zest station has added stylesheets / images / icons, and we 'officially' support
        * all other hotels should default to the SNT theme until which time we add the styling into our product or until a CMS is integrated
        *
        * themeMappings:: when mapping, on Left (key) is used for the PATH zest_station/css/themes/{theme},
        *                  --on the right, (value) is what is coming from the hotel config in SNT Admin > Templates Config, ie. in dropdown (Public ny),
        *                  but we want to map to a path of just css/theme/public
        *
        *WHEN ADDING or Changing a Theme Name and path - will also need to update the Gulp Asset-list
        * at >> asset_list > theming > zeststation > css > css_theme_mapping.js
        *
        */

        var themeMappings = {
            'zoku': 'zoku',
            'yotel': 'yotel',
            'avenue': 'avenue',
            'public': 'public ny',
            'public_v2': 'public ny v2',
            'duke': 'Little duke',
            'sohotel': 'sohotel',
            'epik': 'Hotel epik',
            'conscious': 'Conscious vondelpark',
            'fontainebleau': 'fontainebleau',
            'freehand': 'freehand',
            'de-jonker': 'Hotel de jonker',
            'chalet-view': 'Chalet view',
            'row-nyc': 'row',
            'circle-inn-fairfield': 'Circle fairfield',
            'cachet-boutique': 'Cachet Boutique',
            'hi-ho': 'Hotel hiho',
            'first': 'First Hotel Breiseth',
            'viceroy-chicago': 'Viceroy Chicago',
            'amrath': 'Amrath apart hotel',
            'jupiter': 'Jupiter hotel',
            'huntley': 'Huntley',
            'queen': 'Queen Anne',
            'belle': 'Van belle',
            'freehand-ny': 'Freehand nyc',
            'freehand-miami': 'Freehand miami',
            'georgetown': 'Georgetown inn',
            'nomo': 'Nomo soho',
            'merrill': 'The Merrill Hotel And Conference Center',
            'martins': 'Martins Hotel',
            'arc': 'Arc The Hotel',
            'alessandra': 'Hotel Alessandra',
            'story': 'Story Hotels',
            'pod': 'Pod DC',
            'ihg': 'IHG',
            'surf-sand': 'Surf And Sand Hotel',
            'bunk': 'Bunk Hotels',
            'rydges': 'Rydges Sydney Airport',
            'freehand-la': 'Freehand Los Angels',
            'east-london': 'The East London Hotel',
            'farmers-daughter': 'Farmers Daughter',
            'park-james': 'Park James Hotel',
            'annapolis': 'Hotel Annapolis',
            'origin': 'Origins Red Rocks',
            'kinney': 'The Kinney Slo',
            'hubert': 'Hotel Hubert',
            'de-blend': '2L De Blend',
            'anthony': 'The Anthony',
            'stewart': 'Stewart Aparthotel',
            'university-inn': 'University Inn',
            'cedar-court': 'Cedar Court Hotels',
            'sister-city': 'Sister City Hotel NY',
            'twa': 'TWA Hotel',
            'carrollton-inn': 'Carrollton Inn',
            'match': 'Hotel the Match',
            'liason': 'Liason DC',
            'clarion-collection': 'Clarion Collection',
            'la-copa': 'La Copa Inn',
            'ruby': 'Ruby Hospitality',
            'qbic': 'Qbic Hotels',
            'merrion-row': 'Merrion Row Hotel And Public House',
            'freehand-chicago': 'Freehand Chicago',
            'why': 'Why Hotel'
        };

        this.isThemeConfigured = function(theme) {
            // if theme is configured with stylesheets, use it, otherwise default to SNT Theme
            return typeof themeMappings[theme] !== 'undefined';
        };
        this.hotelTheme = '';
        this.fetchSettings = function() {
            var deferred = $q.defer(),
                url = '/api/hotel_settings/kiosk';

            zsBaseWebSrv.getJSON(url).then(function(data) {
                // fetch hotel theme and set variable to this controller,
                // then resolve the fetch settings
                that.fetchHotelTheme(data, deferred);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.fetchHotelTheme = function(resolveData, deferred) {
            var url = '/api/email_templates/list.json?hotel_id=' + resolveData.hotel_id,
                theme = '';

            zsBaseWebSrv.getJSON(url).then(function(response) {
                if (response && response.existing_email_templates && response.themes) {
                    var hotelTheme = _.findWhere(response.themes, {
                        id: response.existing_email_template_theme
                    });

                    if (hotelTheme && hotelTheme.name) {
                        theme = hotelTheme.name.toLowerCase();
                    } else {
                        deferred.reject();
                    }
                }
                // currently hotel is using fontainebleau, hotel will switch that to fontainebleau v2
                // ( this cant be added to themeMappings,as it will add duplicate key, we can remove old
                // fontainebleau, once we have upgraded)
                if (theme === 'fontainebleau v2') {
                    theme = 'fontainebleau';
                } else {
                    // the hotel theme name has to be mapped to the zeststation resource files
                    // corresponding to those themes.
                    theme = _.findKey(themeMappings, function(themeMapping) {
                        return themeMapping.toLowerCase() === theme;
                    });
                }


                if (!that.isThemeConfigured(theme)) {
                    theme = 'snt';
                }

                that.hotelTheme = theme;
                // resolves this.fetchSetting()
                deferred.resolve(resolveData);
            }, function(data) {
                deferred.reject(data);
            });

            return deferred.promise;
        };

        this.fetchLanguages = function() { // to get terms & conditions
            var url = '/api/kiosk/languages';

            return zsBaseWebSrv.getJSON(url);
        };

        /**
         * to fetch the translation file against languages
         * @param  {Object} language
         * langName is a mapping for code to name values
         */
        this.langName = [];
        this.fetchTranslations = function(languages) {
            var deferred = $q.defer();

            var languageConfig, langShortCode, url, promises = [], results = {};

            languages.map(function(language) {
                languageConfig = that.languageValueMappingsForUI[language.name];
                langShortCode = languageConfig.code;

                that.langName[langShortCode] = language.name;

                url = '/api/locales/' + langShortCode + '.json';
                promises.push(
                    zsBaseWebSrv.getJSON(url)
                        .then(function(langShortCode, data) {
                            results[langShortCode] = data.data;
                        }.bind(null, langShortCode)
                        )
                    );
            });

            $q.all(promises).then(function(data) {
                // that.languageJSONs = results; // for reference if needed in octopus work
                deferred.resolve(results);
            });

            return deferred.promise;
        };
        this.syncTranslationText = function(langCode, newValueForText, tag) {

            var translationFiles = that.refToLatestPulledTranslations, langShortCode;
                // sync local translated file for current shortcode, which just updated

            for (langShortCode in translationFiles) {
                if (langShortCode === langCode) {
                        // console.log(':: ',tag,' :: --> ',newValueForText);
                        // updates locale translation so we dont have to call another fetch languages api which takes time
                    translationFiles[langShortCode][tag] = newValueForText;

                        // syncing language change for local translation files
                        // sets that tag value for the locale language (re-translates pages)
                    that.$translateProvider.translations(langShortCode, translationFiles[langShortCode]);

                }
            }
        };

        this.updateLanguageTranslationText = function(params) {
            var deferred = $q.defer(),
                url = '/api/hotel_settings/change_settings';
            var langCode = params.langCode,
                newValueForText = params.newValueForText,
                tag = params.tag,
                keepShowingTag = params.keepShowingTag;

            zsBaseWebSrv.postJSON(url, params).then(function(data) {
                deferred.resolve(data);
                if (keepShowingTag) {
                    that.syncTranslationText(langCode, tag, tag);
                } else {
                    that.syncTranslationText(langCode, newValueForText, tag);
                }


            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.fetchHotelSettings = function() { // to get terms & conditions
            var url = '/api/hotel_settings.json';

            return zsBaseWebSrv.getJSON(url);
        };

        this.getDoorLockSettings = function() {
            var deferred = $q.defer(),
                url = '/api/door_lock_interfaces.json';

            zsBaseWebSrv.getJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.encodeKey = function(params) {
            var deferred = $q.defer(),
                url = '/staff/reservation/print_key';

            // sample response for testing
            // var response = {"key_info":[{"base64":"F85022BCD036D503D1151C246EC1CE9473"}]};
            // deferred.resolve(response);

            zsBaseWebSrv2.postJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.saveUIDtoRes = function(params) {
            var deferred = $q.defer(),
                url = '/api/reservations/update_key_uid';

            zsBaseWebSrv.postJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.fetchGuestDetails = function(params) {
            var deferred = $q.defer();
            var url = '/api/reservations/' + params.id + '/reservations_guest_details';

            zsBaseWebSrv.getJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });

            return deferred.promise;
        };

        this.ValidateEmail = function(email) {
            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
                return false;
            }
            return true;
        };


        this.isValidEmail = function(email) {
            if (email === '') {
                return false;
            }
            email = email.replace(/\s+/g, '');
            if (that.ValidateEmail(email)) {
                return false;
            }
            return true;

        };


        this.tokenize = function(data) {
            var deferred = $q.defer();
            var url = '/staff/payments/tokenize';

            zsBaseWebSrv2.postJSON(url, data).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };


        this.fetchCountryList = function() {
            var deferred = $q.defer();
            var url = '/ui/country_list.json';

            zsBaseWebSrv.getJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.fetchSortedCountryList = function() {
            var deferred = $q.defer();
            var url = '/api/countries/sorted_list.json';

            zsBaseWebSrv2.getJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };


        this.fetchHotelBusinessDate = function() {
            var deferred = $q.defer(),
                url = '/api/business_dates/active';

            zsBaseWebSrv.getJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };


        this.emailIsBlackListed = function(data) {
            // send email address as string, returns true/false depending on if the domain was found to be blacklisted
            // in settings/zest//email blacklist
            var deferred = $q.defer();
            var url = '/api/black_listed_emails';

            zsBaseWebSrv.getJSON(url, data).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.fetchHotelTime = function() {
            var deferred = $q.defer(),
                url = '/api/hotel_current_time.json';

            zsBaseWebSrv.getJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.updateGuestEmail = function(params) {
            var deferred = $q.defer(),
                url = '/staff/guest_cards/' + params.guest_id;

            zsBaseWebSrv.putJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.isDefaultLanguageSet = false;


        this.languageValueMappingsForUI = {
            // LangugaeName: Corresponsing values
            english: {
                'prefix': 'EN',
                'code': 'en',
                'flag': 'flag-gb',
                'language_name_in_local': 'English'
            },
            french: {
                'prefix': 'FR',
                'code': 'fr',
                'flag': 'flag-fr',
                'language_name_in_local': 'Français'
            },
            spanish: {
                'prefix': 'ES',
                'code': 'es',
                'flag': 'flag-es',
                'language_name_in_local': 'Español'
            },
            german: {
                'prefix': '',
                'code': 'de',
                'flag': 'flag-de',
                'language_name_in_local': 'Deutsche'
            },
            castellano: {
                'prefix': '',
                'code': 'cl',
                'flag': 'flag-ca',
                'language_name_in_local': 'Castellano'
                    // using name as an english reference (which is in the api call)
            },
            italian: {
                'prefix': '',
                'code': 'it',
                'flag': 'flag-it',
                'language_name_in_local': 'Italiano'
            },
            netherland: {
                'prefix': 'NL',
                'code': 'nl',
                'flag': 'flag-nl',
                'language_name_in_local': 'Nederlands'
            }
        };

        // This data supposed to be handled in back end.
        // TODO : Move to api
        this.returnLanguageList = function() {
            return [ // in our admin/API, these are saved in english, we will keep reference here if needed
            ];
        };


        this.refreshWorkStationInitialized = function(params) {
            console.log('::refreshWorkStationInitialized:: ', params);
            var deferred = $q.defer(),
                url = '/api/workstations/' + params.id;

            zsBaseWebSrv.putJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };


        this.fetchWorkStations = function(params) {
            var deferred = $q.defer();
            var url = '/api/workstations.json';

            zsBaseWebSrv.getJSON(url, params).then(function(data) {
                that.last_workstation_set = data;
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
        this.fetchWorkStationStatus = function(params) {
            var deferred = $q.defer();
            var url = '/api/workstations/' + params.id + '/status';

            zsBaseWebSrv.getJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.updateWorkStations = function(params) {
            var deferred = $q.defer(),
                url = '/api/workstations/' + params.id;

            zsBaseWebSrv.putJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.updateWorkStationOos = function(params) {
            var deferred = $q.defer(),
                url = '/api/workstations/' + params.id + '/set_out_or_order.json';

            zsBaseWebSrv.postJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };


        this.saveSettings = function(params) {
            var deferred = $q.defer(),
                url = '/api/hotel_settings/change_settings';

            zsBaseWebSrv.postJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };


        this.validate = function(params) {
            var deferred = $q.defer(),
                url = '/api/users/check_if_admin';

            zsBaseWebSrv.postJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };


        this.validate_staff = function(params) {
            var deferred = $q.defer(),
                url = '/zest_station/validate_staff';

            zsBaseWebSrv.postJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.fetchCheckinReservationDetails = function(params) {
            var deferred = $q.defer();
            var url = '/api/reservations?reservation_id=' + params.reservation_id;

            zsBaseWebSrv.getJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.logKeyStatus = function(params) {
            var deferred = $q.defer(),
                url = '/zest_station/log_key_activities';

            zsBaseWebSrv.postJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.sendThirdPartyEmail = function(params) {
            var deferred = $q.defer(),
                url = '/api/reservations/' + params.reservation_id + '/send_station_offer_mobilekey_mail';

            zsBaseWebSrv.postJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.fetchHotelLanguageList = function() {
            var deferred = $q.defer();
            var url = '/api/guest_languages';

            zsBaseWebSrv.getJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.getKeyEncoderInfo = function() {
            var deferred = $q.defer();
            var url = '/api/key_encoders';

            zsBaseWebSrv.getJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.fetchHotelTranslations = function() {
            var deferred = $q.defer(),
                url = 'zest_station/translations.json';

            zsBaseWebSrv2.getJSON(url).then(function(data) {
                deferred.resolve(data.hotel_translations);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.fetchDefaultTranslations = function() {
            var deferred = $q.defer(),
                url = 'zest_station/fetch_default_translations';

            zsBaseWebSrv.getJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.verifyStaffByPin = function(params) {
            var deferred = $q.defer(),
                url = '/api/users/authenticate_user_by_pin_code';

            zsBaseWebSrv.postJSON(url, params).then(function(response) {
                deferred.resolve(response);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
        this.recordReservationActions = function(params) {

            var deferred = $q.defer(),
                url = '/api/reservation_actions';

            zsBaseWebSrv.postJSON(url, params).then(function(response) {
                deferred.resolve(response);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.proceesPaginationDetails = function(array, itemsPerPage, pageNumber) {
            var pageStartingIndex,
                pageEndingIndex,
                viewableItems = [];

            if (array.length <= itemsPerPage) {
                // if 4 or less upgrades are available
                pageStartingIndex = 1;
                pageEndingIndex = array.length;
                viewableItems = angular.copy(array);
            } else {
                // if multiple pages (each containing itemsPerPage items) are present and user navigates
                // using next and previous buttons
                pageStartingIndex = 1 + itemsPerPage * (pageNumber - 1);
                // ending index can depend upon the no of items
                if (pageNumber * itemsPerPage < array.length) {
                    pageEndingIndex = pageNumber * itemsPerPage;
                } else {
                    pageEndingIndex = array.length;
                }
                // set viewable pgm list - itemsPerPage items at a time
                viewableItems = [];

                for (var index = -1; index < itemsPerPage - 1; index++) {
                    if (!_.isUndefined(array[pageStartingIndex + index])) {
                        viewableItems.push(array[pageStartingIndex + index]);
                    }
                }
            }

            var pageData = {
                disableNextButton: pageEndingIndex === array.length,
                disablePreviousButton: pageStartingIndex === 1,
                pageStartingIndex: pageStartingIndex,
                pageEndingIndex: pageEndingIndex,
                viewableItems: viewableItems,
                pageNumber: pageNumber
            };

            return pageData;
        };

        this.retrievePaginationStartingData = function() {
            return {
                disableNextButton: false,
                disablePreviousButton: false,
                pageStartingIndex: 1,
                pageEndingIndex: '',
                viewableItems: [],
                pageNumber: 1
            };
        };

        this.getImages = function() {
            var url = '/api/hotel_settings/configurable_images';

            return zsBaseWebSrv.getJSON(url);
        };


        this.getDeviceDetails = function(params) {

            var url = '/api/notifications/device_details';

            return zsBaseWebSrv.getJSON(url, params);
        };

        this.signOut = function() {
            return zsBaseWebSrv.getJSON('/logout');
        };

        this.detachGuest = function(params) {
            var url = '/zest_station/reservations/' + params.id + '/detach_accompanying_guest';

            return zsBaseWebSrv.postJSON(url, params);
        };
    }
]);
