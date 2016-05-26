/**
 * Service used for tablet-kiosk UI (Zest Station)
 */

sntZestStation.service('zsUtilitySrv', ['$http', '$q', 'zsBaseWebSrv',
    function($http, $q, zsBaseWebSrv) {
        //service provider for common utilities
        var that = this;

        this.CommaFormatted = function(amount) {
            if (amount.indexOf('.') === -1) {
                amount = parseFloat(amount).toFixed(2) + '';
            }
            var delimiter = ",";
            var a = amount.split('.', 2)
            var d = a[1];
            var i = parseInt(a[0]);
            if (isNaN(i)) {
                return '';
            }
            var minus = '';
            if (i < 0) {
                minus = '-';
            }
            i = Math.abs(i);
            var n = new String(i);
            var a = [];
            while (n.length > 3) {
                var nn = n.substr(n.length - 3);
                a.unshift(nn);
                n = n.substr(0, n.length - 3);
            }
            if (n.length > 0) {
                a.unshift(n);
            }
            n = a.join(delimiter);
            if (d.length < 1) {
                amount = n;
            } else {
                amount = n + '.' + d;
            }
            amount = minus + amount;
            return amount;
        };



        this.formatCurrency = function(amt) {
            return parseFloat(amt).toFixed(2);
        };

        this.getFloat = function(n) {
            //to check/remove any commas in a string..
            var num = n + '';
            num = num.replace(/,/gi, "");
            return this.CommaFormatted(parseFloat(num).toFixed(2) + ''); //return with comma back in
        };



        this.getMonthN = function(mo) {
            var monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
            for (var i in monthNames) {
                if (monthNames[i].toLowerCase() == mo.toLowerCase() || monthNames[i].toLowerCase().indexOf(mo.toLowerCase()) != -1) { //exact or not
                    return i;
                }
            }
        };
        this.getMonthName = function(mo) {
            var monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
            for (var i = 0; i < monthNames.length; i++) {
                if (i === parseInt(mo)) {
                    return monthNames[i];
                }
            }
        };

        this.isValidEmail = function(email) {
            email = email.replace(/\s+/g, '');
            if (that.ValidateEmail(email)) {
                return false;
            } else return true;

        };
        this.ValidateEmail = function(email) {
            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
                return false;
            } else return true;
        };

        this.returnLanguageList = function() {
            return [ //in our admin/API, these are saved in english, we will keep reference here if needed
                {
                    'language': 'Castellano',
                    'info': {
                        'prefix': '',
                        'code': 'cl',
                        'flag': 'flag-ca',
                        'name': 'Castellano' //using name as an english reference (which is in the api call)
                    }
                }, {
                    'language': 'Deutsche',
                    'info': {
                        'prefix': '',
                        'code': 'de',
                        'flag': 'flag-de',
                        'name': 'German'
                    }
                }, {
                    'language': 'English',
                    'info': {
                        'prefix': 'EN',
                        'code': 'en',
                        'flag': 'flag-gb',
                        'name': 'English'
                    }
                }, {
                    'language': 'Español',
                    'info': {
                        'prefix': 'ES',
                        'code': 'es',
                        'flag': 'flag-es',
                        'name': 'Spanish'
                    }
                }, {
                    'language': 'Français',
                    'info': {
                        'prefix': 'FR',
                        'code': 'fr',
                        'flag': 'flag-fr',
                        'name': 'French'
                    }
                }, {
                    'language': 'Italiano',
                    'info': {
                        'prefix': '',
                        'code': 'it',
                        'flag': 'flag-it',
                        'name': 'Italian'
                    }
                }, {
                    'language': 'Nederlands',
                    'info': {
                        'prefix': 'NL',
                        'code': 'nl',
                        'flag': 'flag-nl',
                        'name': 'Netherlands'
                    }
                }
            ];
        }

    }
]);