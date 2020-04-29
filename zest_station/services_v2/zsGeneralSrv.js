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
            'guestweb_zoku': 'zoku',
            'guestweb_yotel': 'yotel',
            'yotel_with_confirmation': 'yotel',
            'guestweb_avenue': 'avenue',
            'guestweb_public_ny': 'public',
            'guestweb_public_ny_v2': 'public_v2',
            'guestweb_little_duke': 'duke',
            "guestweb_sohotel": "sohotel",
            "guestweb_hotel_epik": "epik",
            "guestweb_consciousVondelpark": "conscious",
            "guestweb_fontainebleau": "fontainebleau",
            "guestweb_fontainebleau_v2": "fontainebleau",
            "guestweb_freehand": "freehand",
            "guestweb_hotel_de_jonker": "de-jonker",
            "guestweb_chalet_view": "chalet-view",
            "guestweb_row": "row-nyc",
            "guestweb_circle_fairfield": "circle-inn-fairfield",
            "guestweb_cachet_boutique": "cachet-boutique",
            "guestweb_hotel_hiho": "hi-ho",
            "guestweb_first_hotel_breiseth": "first",
            "guestweb_viceroy_chicago": "viceroy-chicago",
            "guestweb_amrath_apart_hotel": "amrath",
            "guestweb_jupiter_hotel": "jupiter",
            "guestweb_huntley": "huntley",
            "guestweb_queen_anne": "queen",
            "guestweb_van_belle": "belle",
            "guestweb_freehand_nyc": "freehand-ny",
            "guestweb_freehand_miami": "freehand-miami",
            "guestweb_georgetown_inn": "georgetown",
            "guestweb_nomo_soho": "nomo",
            "guestweb_the_merrill_hotel_and_conference_center": "merrill",
            "guestweb_martins_hotel": "martins",
            "guestweb_arc_the_hotel": "arc",
            "guestweb_hotel_alessandra": "alessandra",
            "guestweb_story_hotels": "story",
            "guestweb_pod_dc": "pod",
            "guestweb_ihg": "ihg",
            "guestweb_surf_and_sand_hotel": "surf-sand",
            "guestweb_bunk_hotels": "bunk",
            "guestweb_rydges_sydney_airport": "rydges",
            "guestweb_freehand_los_angels": "freehand-la",
            "guestweb_the_east_london_hotel": "east-london",
            "guestweb_farmers_daughter": "farmers-daughter",
            "guestweb_park_james_hotel": "park-james",
            "guestweb_hotel_annapolis": "annapolis",
            "guestweb_origins_red_rocks": "origin",
            "guestweb_the_kinney_slo": "kinney",
            "guestweb_hotel_hubert": "hubert",
            "guestweb_2l_de_blend": "de-blend",
            "guestweb_the_anthony": "anthony",
            "guestweb_stewart_aparthotel": "stewart",
            "guestweb_university_inn": "university-inn",
            "guestweb_cedar_court_hotels": "cedar-court",
            "guestweb_sister_city_hotel_ny": "sister-city",
            "guestweb_twa_hotel": "twa",
            "guestweb_carrollton_inn": "carrollton-inn",
            "guestweb_hotel_the_match": "match",
            "guestweb_liason_dc": "liason",
            "guestweb_clarion_collection": "clarion-collection",
            "guestweb_la_copa_inn": "la-copa",
            "guestweb_ruby_hospitality": "ruby",
            "guestweb_qbic_hotels": "qbic",
            "guestweb_merrion_row_hotel_and_public_house": "merrion-row",
            "guestweb_freehand_chicago": "freehand-chicago",
            "guestweb_why_hotel": "why",
            "guestweb_village_hotels": "village",
            "guestweb_gallivant_ny": "gallivant",
            "guestweb_hotel_e": "hotel-e",
            "guestweb_kelley_house": "kelley",
            "guestweb_aparthotel_stare_miasto": "stare-miastro",
            "guestweb_upstairs_by_mamas": "upstairs-by-mamas",
            "guestweb_hotel_juliani": "juliani",
            "guestweb_mooons": "mooons",
            "guestweb_marmalade_hotel": "marmalade",
            "guestweb_bosville_hotel": "bosville",
            "guestweb_hotel_kinsley": "kinsley",
            "guestweb_hotel_zurzacherhof": "zurzacheroff",
            "guestweb_the_asbury": "asbury",
            "guestweb_manchebo_beach_resort": "manchebo",
            "guestweb_seacrest_hotel_v2": "seacrest",
            "guestweb_the_cole_hotel": "cole",
            "guestweb_heritage_hills_golf_resort": "heritage-hills",
            "guestweb_metropolis_resort": "metropolis-resort",
            "guestweb_why_hotel_seattle": "why-seattle",
            "guestweb_pod_philly": "pod-philly",
            "guestweb_the_concordia": "concordia",
            "guestweb_belvedere_on_hudson": "belvedere",
            "guestweb_the_delavan_hotel_and_spa": "delavan",
            "guestweb_garden_place_hotel": "garden-place",
            "guestweb_crowne_plaza_brussels": "crowne",
            "guestweb_hotel_indigo_brussels": "indigo",
            "guestweb_caro_short_stay": "caro",
            "guestweb_hotel_schani_wien": "schani-wien",
            "guestweb_glencoe_house": "glencoe",
            "guestweb_hotel_schani_salon": "schani-salon",
            "guestweb_hotel_spatz": "spatz",
            "guestweb_apartment_city_lenaustrasse": "lenaustrasse",
            "guestweb_why_hotel_tysons_corner": "why-tysons",
            "guestweb_local_house": "local-house",
            "guestweb_travel_24": "travel-24",
            "guestweb_sage_inn": "sage-inn",
            "guestweb_hammetts_hotel": "hammetts",
            "guestweb_lochardil": "lochardil",
            "guestweb_oban_perle": "perle-oban",
            "guestweb_why_hotel_columbia_pike": "why-columbia",
            "guestweb_why_hotel_houston": "why-houston",
            "guestweb_victory_house": "victory-house",
            "guestweb_dimond_center_hotel": "dimond-center",
            "guestweb_zedwell_trocadero": "zedwell",
            "guestweb_hotel_brooklyn": "brooklyn",
            "guestweb_krowoderska_apartments": "krowoderska",
            "guestweb_bayou_residences": "bayou",
            "guestweb_moment_hotels": "moment",
            "guestweb_sheffield_halifax_hall": "halifax",
            "guestweb_hotel_bellvue": "bellevue",
            "guestweb_sheffield_jonas_hotel": "jonas",
            "guestweb_westminster_hotel": "westminster",
            "guestweb_coyote_south": "coyote",
            "guestweb_seehotel_hermitage": "hermitage",
            "guestweb_sage_inn_v2": "sage-inn-v2",
            "guestweb_the_lake_house_on_canandaigua": "lake-house",
            "guestweb_first_hotels_v2": "first-v2",
            "guestweb_waldhotel_davos": "waldhotel-davos",
            "guestweb_autocamp": "autocamp",
            "guestweb_margaritaville_lake_resort": "margaritaville",
            "guestweb_hotel_171": "hotel-171",
            "guestweb_beachside_resort_and_suites": "beachside"
        };


        this.isThemeConfigured = function(theme) {
            // if theme is configured with stylesheets, use it, otherwise default to SNT Theme
            return typeof themeMappings[theme] !== 'undefined';
        };
        this.hotelTheme = '';
        this.isZestStationEnabled = true;
        this.fetchSettings = function() {
            var deferred = $q.defer(),
                url = '/api/hotel_settings/kiosk';

            zsBaseWebSrv.getJSON(url).then(function(data) {
                if (data.status && data.status === 'unauthorized') {
                    that.isZestStationEnabled = false;
                    deferred.resolve(data);
                } else {
                     // fetch hotel theme and set variable to this controller,
                    // then resolve the fetch settings
                    that.fetchHotelTheme(data, deferred);
                    // fetch Feature toggles and save in Srv for using in future.
                    that.retrieveFeatureToggles();
                }
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.fetchHotelTheme = function(resolveData, deferred) {
            var url = '/api/themes/hotel_theme';

            // This is a part of synchronous API calls - hence the resolveData param;
            zsBaseWebSrv.getJSON(url).then(function(response) {
                that.hotelTheme = themeMappings[response['theme']] || 'snt';
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

            var langShortCode, url, promises = [], results = {};

            languages.map(function(language) {
                langShortCode = language.code;

                that.langName[langShortCode] = language.code;

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
                url = '/api/guest_details/' + params.guest_id;

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
                pageNumber: pageNumber,
                total: array.length
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

        this.getRoomTypes = function(params) {
            var url = '/api/room_types.json';

            return zsBaseWebSrv.getJSON(url, params);
        };

        this.getAvailableRatesForTheDay = function(params) {
            var url = '/api/availability/room_type_adrs';

            return zsBaseWebSrv.getJSON(url, params);
        };

        this.createReservation = function(params) {
            var url = '/api/reservations';

            return zsBaseWebSrv.postJSON(url, params);
        };

        this.featuresToggleList = {};
        this.retrieveFeatureToggles = function() {
             var deferred = $q.defer(),
                url = '/api/features/list';

            zsBaseWebSrv.getJSON(url).then(function(response) {
                that.featuresToggleList = response;
                deferred.resolve(response);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.getRoomInstructions = function(params) {
            var url = '/api/reservations/' + params.id + '/room_instructions.json';

            delete params.id;
            return zsBaseWebSrv.getJSON(url, params);
        };

        this.fetchAvailableRooms = function(params) {
            var url = '/api/rooms/retrieve_available_rooms';

            return zsBaseWebSrv2.postJSON(url, params);
        };
    }
]);
