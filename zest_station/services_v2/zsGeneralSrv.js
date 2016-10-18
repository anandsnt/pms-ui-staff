/**
 * Service used for tablet-kiosk UI (Zest Station)
 */

sntZestStation.service('zsGeneralSrv', ['$http', '$q', 'zsBaseWebSrv', 'zsBaseWebSrv2', '$translate',
    function($http, $q, zsBaseWebSrv, zsBaseWebSrv2, $translate) {
        var that = this;
        /*
        * The configuredHotels list are the hotels which zest station has added stylesheets / images / icons, and we 'officially' support
        * all other hotels should default to the SNT theme until which time we add the styling into our product or until a CMS is integrated
        */
        var themeMappings = {
            'zoku': 'zoku',
            'yotel': 'yotel',
            'avenue': 'avenue',
            'epik': 'Hotel epik',
            'conscious': 'Conscious vondelpark',
            'fontainebleau': 'fontainebleau'
        };

        this.isThemeConfigured = function(theme) {
            //if theme is configured with stylesheets, use it, otherwise default to SNT Theme
            return (typeof themeMappings[theme] !== "undefined");
        };
        this.hotelTheme = '';
        this.fetchSettings = function() {
            var deferred = $q.defer(),
                url = '/api/hotel_settings/kiosk';

            zsBaseWebSrv.getJSON(url).then(function(data) {
                //fetch hotel theme and set variable to this controller,
                //then resolve the fetch settings
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
                    if (hotelTheme && hotelTheme.name){
                        theme = hotelTheme.name.toLowerCase();    
                    } else {
                        deferred.reject();
                    }
                }

                //the hotel theme name has to be mapped to the zeststation resource files 
                //corresponding to those themes.
                theme = _.findKey(themeMappings, function(themeMapping) {
                    return themeMapping.toLowerCase() === theme;
                });

                if (!that.isThemeConfigured(theme)){
                    theme = 'snt';
                }
                that.hotelTheme = theme;
                resolveData.themeLogoPath = '/assets/zest_station/css/themes/'+that.hotelTheme+'/logo.svg';
                //resolves this.fetchSetting()
                deferred.resolve(resolveData);
            }, function(data) {
                deferred.reject(data);
            });

            return deferred.promise;
        };

        this.fetchLanguages = function() { //to get terms & conditions
            var url = '/api/kiosk/languages';
            return zsBaseWebSrv.getJSON(url);
        };

        /**
         * to fetch the translation file against languages
         * @param  {Object} language
         */
        this.fetchTranslations = function(languages) {
            var deferred = $q.defer();

            var languageConfig, langShortCode, url, promises = [], results = {};

            languages.map(function(language) {
                languageConfig = that.languageValueMappingsForUI[language.name];
                langShortCode = languageConfig.code;
                url = '/api/locales/' + langShortCode + '.json';
                promises.push(
                    zsBaseWebSrv.getJSON(url)
                        .then(function(langShortCode, data){
                                results[langShortCode] = data.data;
                            }.bind(null, langShortCode)
                        )
                    );
            });

            $q.all(promises).then(function(data){
                deferred.resolve(results);
            });

            return deferred.promise;
        };

        this.fetchHotelSettings = function() { //to get terms & conditions
            var url = '/api/hotel_settings.json';
            return zsBaseWebSrv.getJSON(url);
        };

        this.getDoorLockSettings = function() {
            var deferred = $q.defer(),
                url = 'api/door_lock_interfaces.json';

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



        this.fetchReservationDetails = function(param) {
            var url = '/staff/staycards/reservation_details.json?reservation_id=' + param.reservation_id;
            var deferred = $q.defer();

            zsBaseWebSrv2.getJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.ValidateEmail = function(email) {
            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
                return false;
            } else return true;
        };


        this.isValidEmail = function(email) {
            if (email === '') {
                return false;
            };
            email = email.replace(/\s+/g, '');
            if (that.ValidateEmail(email)) {
                return false;
            } else return true;

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
            //send email address as string, returns true/false depending on if the domain was found to be blacklisted
            //in settings/zest//email blacklist
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

        this.languageValueMappingsForUI = {
            //LangugaeName: Corresponsing values
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
                    //using name as an english reference (which is in the api call)
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

        //This data supposed to be handled in back end.
        //TODO : Move to api
        this.returnLanguageList = function() {
            return [ //in our admin/API, these are saved in english, we will keep reference here if needed
            ];
        }



        this.fetchWorkStations = function(params) {
            var deferred = $q.defer();
            var url = '/api/workstations.json';

            zsBaseWebSrv.getJSON(url, params).then(function(data) {
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
                url = 'api/workstations/' + params.id + '/set_out_or_order.json';

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
                url = 'api/users/check_if_admin';

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

    }
]);