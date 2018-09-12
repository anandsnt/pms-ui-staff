angular.module('sntRover').service('RVGuestCardsSrv', 
[
 '$q',
 'rvBaseWebSrvV2', 
  function($q, RVBaseWebSrvV2) {       

        this.PER_PAGE_COUNT = 50;

        var statisticsSummaryData = {
                  "stay_count": {
                    "annual": 5,
                    "ytd": 2,
                    "total": 7,
                    "change_percent": 10
                  },
                  "nights_count": {
                    "annual": 5,
                    "ytd": 2,
                    "total": 7,
                    "change_percent": -20
                  },
                  "cancellation_count": {
                    "annual": 5,
                    "ytd": 2,
                    "total": 7,
                    "change_percent": 5
                  },
                  "no_show_count": {
                    "annual": 5,
                    "ytd": 2,
                    "total": 7,
                    "change_percent": 0
                  },
                  "adr": {
                    "annual": 5,
                    "ytd": 2,
                    "total": 7,
                    "change_percent": 12
                  },
                  "room_revenue": {
                    "annual": 5,
                    "ytd": 2,
                    "total": 7,
                    "change_percent": -15
                  },
                  "total_revenue": {
                    "annual": 5,
                    "ytd": 2,
                    "total": 7,
                    "change_percent": -20
                  }
            },
            statisticsDetails = {
              "monthly_data": [
                {
                  "stay_count": 10,
                  "nights_count": 10,
                  "cancellation_count": 10,
                  "no_show_count": 5,
                  "adr": 100,
                  "room_revenue": 200,
                  "total_revenue": 300,
                  "month": "June",
                  "year": "2018",
                  "data_available": true,
                  "reservations": [
                    {
                      "reservation_id": "",
                      "confirmation_no": 10234,
                      "first_name": "Ragesh",
                      "last_name": "Kumar",
                      "arrival_date": "28-09-2018",
                      "departure_date": "30-09-2018",
                      "arrival_time": "08:30 AM",
                      "departure_time": "10:30 PM",
                      "rate_name": "BEST AVAILABLE RATE",
                      "adr": 120,
                      "room_type_name": "Delux King",
                      "room_no": '110',
                      "is_cancelled": true,
                      "reservation_status": "RESERVED"
                    },
                    {
                      "reservation_id": "",
                      "confirmation_no": 10234,
                      "first_name": "Ragesh",
                      "last_name": "Kumar",
                      "arrival_date": "28-09-2018",
                      "departure_date": "30-09-2018",
                      "arrival_time": "08:30 AM",
                      "departure_time": "10:30 PM",
                      "rate_name": "BEST AVAILABLE RATE",
                      "adr": 120,
                      "room_type_name": "Delux King",
                      "room_no": '110',
                      "is_cancelled": false,
                      "reservation_status": "CHECKEDIN"
                    },
                    {
                      "reservation_id": "",
                      "confirmation_no": 10234,
                      "first_name": "Ragesh",
                      "last_name": "Kumar",
                      "arrival_date": "28-09-2018",
                      "departure_date": "30-09-2018",
                      "arrival_time": "08:30 AM",
                      "departure_time": "10:30 PM",
                      "rate_name": "BEST AVAILABLE RATE",
                      "adr": 120,
                      "room_type_name": "Delux King",
                      "room_no": '',
                      "is_cancelled": true,
                      "reservation_status": "CHECKEDOUT"
                    }
                  ]
                },
                {
                  "stay_count": 10,
                  "nights_count": 10,
                  "cancellation_count": 10,
                  "no_show_count": 5,
                  "adr": 100,
                  "room_revenue": 200,
                  "total_revenue": 300,
                  "month": "June",
                  "year": "2018",
                  "data_available": true,
                  "reservations": [
                    {
                      "reservation_id": "",
                      "confirmation_no": 10234,
                      "first_name": "Ragesh",
                      "last_name": "Kumar",
                      "arrival_date": "28-09-2018",
                      "departure_date": "30-09-2018",
                      "arrival_time": "08:30 AM",
                      "departure_time": "10:30 PM",
                      "rate_name": "BEST AVAILABLE RATE",
                      "adr": 120,
                      "room_type_name": "Delux King",
                      "room_no": '110',
                      "is_cancelled": true,
                      "reservation_status": "RESERVED"
                    },
                    {
                      "reservation_id": "",
                      "confirmation_no": 10234,
                      "first_name": "Ragesh",
                      "last_name": "Kumar",
                      "arrival_date": "28-09-2018",
                      "departure_date": "30-09-2018",
                      "arrival_time": "08:30 AM",
                      "departure_time": "10:30 PM",
                      "rate_name": "BEST AVAILABLE RATE",
                      "adr": 120,
                      "room_type_name": "Delux King",
                      "room_no": '110',
                      "is_cancelled": false,
                      "reservation_status": "CHECKEDIN"
                    },
                    {
                      "reservation_id": "",
                      "confirmation_no": 10234,
                      "first_name": "Ragesh",
                      "last_name": "Kumar",
                      "arrival_date": "28-09-2018",
                      "departure_date": "30-09-2018",
                      "arrival_time": "08:30 AM",
                      "departure_time": "10:30 PM",
                      "rate_name": "BEST AVAILABLE RATE",
                      "adr": 120,
                      "room_type_name": "Delux King",
                      "room_no": '',
                      "is_cancelled": true,
                      "reservation_status": "CHECKEDOUT"
                    }
                  ]
                },
                {
                  "stay_count": 10,
                  "nights_count": 10,
                  "cancellation_count": 10,
                  "no_show_count": 5,
                  "adr": 100,
                  "room_revenue": 200,
                  "total_revenue": 300,
                  "month": "June",
                  "year": "2018",
                  "data_available": true,
                  "reservations": [
                    {
                      "reservation_id": "",
                      "confirmation_no": 10234,
                      "first_name": "Ragesh",
                      "last_name": "Kumar",
                      "arrival_date": "28-09-2018",
                      "departure_date": "30-09-2018",
                      "arrival_time": "08:30 AM",
                      "departure_time": "10:30 PM",
                      "rate_name": "BEST AVAILABLE RATE",
                      "adr": 120,
                      "room_type_name": "Delux King",
                      "room_no": '110',
                      "is_cancelled": true,
                      "reservation_status": "RESERVED"
                    },
                    {
                      "reservation_id": "",
                      "confirmation_no": 10234,
                      "first_name": "Ragesh",
                      "last_name": "Kumar",
                      "arrival_date": "28-09-2018",
                      "departure_date": "30-09-2018",
                      "arrival_time": "08:30 AM",
                      "departure_time": "10:30 PM",
                      "rate_name": "BEST AVAILABLE RATE",
                      "adr": 120,
                      "room_type_name": "Delux King",
                      "room_no": '110',
                      "is_cancelled": false,
                      "reservation_status": "CHECKEDIN"
                    },
                    {
                      "reservation_id": "",
                      "confirmation_no": 10234,
                      "first_name": "Ragesh",
                      "last_name": "Kumar",
                      "arrival_date": "28-09-2018",
                      "departure_date": "30-09-2018",
                      "arrival_time": "08:30 AM",
                      "departure_time": "10:30 PM",
                      "rate_name": "BEST AVAILABLE RATE",
                      "adr": 120,
                      "room_type_name": "Delux King",
                      "room_no": '',
                      "is_cancelled": true,
                      "reservation_status": "CHECKEDOUT"
                    }
                  ]
                },
                {
                  "stay_count": 10,
                  "nights_count": 10,
                  "cancellation_count": 10,
                  "no_show_count": 5,
                  "adr": 100,
                  "room_revenue": 200,
                  "total_revenue": 300,
                  "month": "June",
                  "year": "2018",
                  "data_available": true,
                  "reservations": [
                    {
                      "reservation_id": "",
                      "confirmation_no": 10234,
                      "first_name": "Ragesh",
                      "last_name": "Kumar",
                      "arrival_date": "28-09-2018",
                      "departure_date": "30-09-2018",
                      "arrival_time": "08:30 AM",
                      "departure_time": "10:30 PM",
                      "rate_name": "BEST AVAILABLE RATE",
                      "adr": 120,
                      "room_type_name": "Delux King",
                      "room_no": '110',
                      "is_cancelled": true,
                      "reservation_status": "RESERVED"
                    },
                    {
                      "reservation_id": "",
                      "confirmation_no": 10234,
                      "first_name": "Ragesh",
                      "last_name": "Kumar",
                      "arrival_date": "28-09-2018",
                      "departure_date": "30-09-2018",
                      "arrival_time": "08:30 AM",
                      "departure_time": "10:30 PM",
                      "rate_name": "BEST AVAILABLE RATE",
                      "adr": 120,
                      "room_type_name": "Delux King",
                      "room_no": '110',
                      "is_cancelled": false,
                      "reservation_status": "CHECKEDIN"
                    },
                    {
                      "reservation_id": "",
                      "confirmation_no": 10234,
                      "first_name": "Ragesh",
                      "last_name": "Kumar",
                      "arrival_date": "28-09-2018",
                      "departure_date": "30-09-2018",
                      "arrival_time": "08:30 AM",
                      "departure_time": "10:30 PM",
                      "rate_name": "BEST AVAILABLE RATE",
                      "adr": 120,
                      "room_type_name": "Delux King",
                      "room_no": '',
                      "is_cancelled": true,
                      "reservation_status": "CHECKEDOUT"
                    }
                  ]
                }
              ],
              "summary": {
                "stay_count": 10,
                "nights_count": 10,
                "cancellation_count": 10,
                "no_show_count": 5,
                "adr": 100,
                "room_revenue": 200,
                "total_revenue": 300
              }
          };

        /**
         * Fetch guest details
         * @param {object} data request object
         * @return {Promise} promise
         */
        this.fetchGuests = function(data) {
            var deferred = $q.defer(),
                url = '/api/guest_details';

            RVBaseWebSrvV2.getJSON(url, data).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.fetchGuestCardStatisticsSummary = function() {
            var deferred = $q.defer(),
                url = '/api/guest_details/statistics_summary';

            deferred.resolve(statisticsSummaryData);
            return deferred.promise;
        };

        this.fetchGuestCardStatisticsDetails = function() {
            var deferred = $q.defer(),
                url = '/api/guest_details/statistics_details';

            deferred.resolve(statisticsDetails);
            return deferred.promise;
        };
        
    }
]);