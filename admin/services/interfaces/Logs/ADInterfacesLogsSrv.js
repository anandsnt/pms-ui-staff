admin.service('ADInterfaceLogsSrv', ['$http', '$q', 'sntBaseWebSrv',
    function($http, $q, sntBaseWebSrv) {

        var service = this;


        /**
         * function extracted and modified from https://github.com/vkiryukhin/vkBeautify
         * @return {[string]} array of indentation
         */
        function createShiftArr() {
            var space = '    ';
            var shift = ['\n']; // array of shifts
            var ix;

            for (ix = 0; ix < 100; ix++) {
                shift.push(shift[ix] + space);
            }

            return shift;
        }

        /**
         * function extracted and modified from https://github.com/vkiryukhin/vkBeautify
         * @param {string} text xml string to be indented
         * @return {string} indented xml
         */
        function indentXML(text) {

            var ar = text.replace(/>\s{0,}</g, "><")
                    .replace(/</g, "~::~<")
                    .replace(/\s*xmlns\:/g, "~::~xmlns:")
                    .replace(/\s*xmlns\=/g, "~::~xmlns=")
                    .split('~::~'),
                len = ar.length,
                inComment = false,
                deep = 0,
                str = '',
                ix = 0,
                shift = createShiftArr();

            for (ix = 0; ix < len; ix++) {
                // start comment or <![CDATA[...]]> or <!DOCTYPE //
                if (ar[ix].search(/<!/) > -1) {
                    str += shift[deep] + ar[ix];
                    inComment = true;
                    // end comment  or <![CDATA[...]]> //
                    if (ar[ix].search(/-->/) > -1 || ar[ix].search(/\]>/) > -1 || ar[ix].search(/!DOCTYPE/) > -1) {
                        inComment = false;
                    }
                } else
                // end comment  or <![CDATA[...]]> //
                if (ar[ix].search(/-->/) > -1 || ar[ix].search(/\]>/) > -1) {
                    str += ar[ix];
                    inComment = false;
                } else
                // <elm></elm> //
                if (/^<\w/.exec(ar[ix - 1]) && /^<\/\w/.exec(ar[ix]) &&
                    /^<[\w:\-\.\,]+/.exec(ar[ix - 1]) === /^<\/[\w:\-\.\,]+/.exec(ar[ix])[0].replace('/', '')) {
                    str += ar[ix];
                    if (!inComment) {
                        deep--;
                    }
                } else
                // <elm> //

                if (ar[ix].search(/<\w/) > -1 && ar[ix].search(/<\//) === -1 && ar[ix].search(/\/>/) === -1) {
                    str = !inComment ? str += shift[deep++] + ar[ix] : str += ar[ix];
                } else
                // <elm>...</elm> //
                if (ar[ix].search(/<\w/) > -1 && ar[ix].search(/<\//) > -1) {
                    str = !inComment ? str += shift[deep] + ar[ix] : str += ar[ix];
                } else
                // </elm> //
                if (ar[ix].search(/<\//) > -1) {
                    str = !inComment ? str += shift[--deep] + ar[ix] : str += ar[ix];
                } else
                // <elm/> //
                if (ar[ix].search(/\/>/) > -1) {
                    str = !inComment ? str += shift[deep] + ar[ix] : str += ar[ix];
                } else
                // <? xml ... ?> //
                if (ar[ix].search(/<\?/) > -1) {
                    str += shift[deep] + ar[ix];
                } else
                // xmlns //
                if (ar[ix].search(/xmlns\:/) > -1 || ar[ix].search(/xmlns\=/) > -1) {
                    str += shift[deep] + ar[ix];
                }

                else {
                    str += ar[ix];
                }
            }

            return (str[0] === '\n') ? str.slice(1) : str;
        }

        /**
         * function extracted and modified from https://github.com/vkiryukhin/vkBeautify
         * @param {string} text json string to be indented
         * @return {*}indented json
         */
        function indentJSON(text) {
            if (angular.isString(text)) {
                return JSON.stringify(JSON.parse(text), null, '    ');
            }
            if (angular.isObject(text)) {
                return JSON.stringify(text, null, '    ');
            }

            return text; // text is not string nor object
        }

        /**
         * This method cleans up the requests and responses so that they are intended properly before being highlighted
         * @param {*} message object
         * @return {string} message shortened and cleaned up string
         */
        function shorten(message) {
            var requestCharacterLimit = 600,
                responseCharacterLimit = 300,
                isJSON = message.meta_data.type && message.meta_data.type.match(/^json$/i),
                request = '\n' + message.request || '',
                response = '\n' + message.response || '',
                isLongRequest = request.length > requestCharacterLimit,
                isLongResponse = response.length > responseCharacterLimit,
                ellipsis = '\n....';

            if (isJSON) {
                message.request = indentJSON(request).substring(0, requestCharacterLimit);
            } else {
                message.request = indentXML(request.substring(0, requestCharacterLimit));
            }

            if (isLongRequest) {
                message.request += ellipsis;
            }

            message.response = response.substring(0, responseCharacterLimit);

            if (isLongResponse) {
                message.response += ellipsis;
            }
        }

        /**
         *
         * @return {deferred.promise|{then, catch, finally}} Promise for a request to fetch the list of interfaces
         */
        service.fetchInterfaces = function() {
            return sntBaseWebSrv.getJSON('/ifc/proxy/interfaces/index');
        };

        /**
         *
         * @return {deferred.promise|{then, catch, finally}} Promise for a request to fetch current hotel time
         */
        service.getTime = function() {
            return sntBaseWebSrv.getJSON('/api/hotel_current_time');
        };

        service.search = function(params) {
            var deferred = $q.defer();

            sntBaseWebSrv.getJSON('/admin/interface_messages', params).then(function(response) {
                // The whole messages need not be shown in the screens, as they are available for download
                response.messages.map(shorten);
                deferred.resolve(response);
            }, function(response) {
                deferred.reject(response.errors || response);
            });
            return deferred.promise;
        };

        service.download = function (params) {
            return sntBaseWebSrv.download(params.url, params.payload, 'GET');
        };
    }
]);
