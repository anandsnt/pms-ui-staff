(function() {
	var guestIDScanService = function($q, $http, $rootScope) {

	var getSampleAcuantIdScanDetails = function() {
            var deferred = $q.defer();
            var url = '/sample_json/zest_station/acuant_sample_response.json';

            $http.get(url).success(function(response) {
			deferred.resolve(response);
		})
		.error(function() {
			deferred.reject();
		});
		return deferred.promise;

        };

    var savePassport = function(params) {
            var deferred = $q.defer();
            var url = '/api/guest_identity';

            params.application = 'WEB';

            $http.post(url, params).success(function(response) {
				this.responseData = response;
				deferred.resolve(this.responseData);
			}.bind(this))
			.error(function() {
				deferred.reject();
			});
			return deferred.promise;
        };

	var verifyStaffByPin = function(params) {
            var deferred = $q.defer(),
                url = '/api/users/authenticate_user_by_pin_code';

            $http.post(url, params).success(function(response) {
				this.responseData = response;
				deferred.resolve(this.responseData);
			}.bind(this))
			.error(function() {
				deferred.reject();
			});
			return deferred.promise;
		};
    var recordIdVerification = function(params) {

            var deferred = $q.defer(),
                url = '/api/reservation_actions';

            $http.post(url, params).success(function(response) {
				this.responseData = response;
				deferred.resolve(this.responseData);
			}.bind(this))
			.error(function() {
				deferred.reject();
			});
			return deferred.promise;
        };

    var proceesPaginationDetails = function(array, itemsPerPage, pageNumber) {
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

    var retrievePaginationStartingData = function() {
            return {
                disableNextButton: false,
                disablePreviousButton: false,
                pageStartingIndex: 1,
                pageEndingIndex: '',
                viewableItems: [],
                pageNumber: 1
            };
        };
	

	return {
	retrievePaginationStartingData: retrievePaginationStartingData,
	proceesPaginationDetails: proceesPaginationDetails,
	recordIdVerification: recordIdVerification,
	verifyStaffByPin: verifyStaffByPin,
	getSampleAcuantIdScanDetails: getSampleAcuantIdScanDetails,
	savePassport: savePassport
	};
};

var dependencies = [
'$q', '$http', '$rootScope',
guestIDScanService
];

sntGuestWeb.factory('guestIDScanService', dependencies);
})();