admin.service('ADRatesConfigureSrv', ['$http', '$q', 'ADBaseWebSrvV2', '$rootScope',
    function ($http, $q, ADBaseWebSrvV2, $rootScope) {
        var that = this;

        this.fetchSetsInDateRange = function (data) {
            var deferred = $q.defer();
            var url = "/api/rate_date_ranges/" + data.id;
            ADBaseWebSrvV2.getJSON(url).then(function (data) {
                var computedData = that.updateSetsForAllSelectedRoomTypes(data);
                deferred.resolve(computedData);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };


        //The Response from server may not have 
        //all the room_type details in in the room_rates dict
        //Calculate the room_rates dict for all selected room_types (from data.room_types)
        this.updateSetsForAllSelectedRoomTypes = function(data){
            var roomAddDetails = {};
            //Iterate through room types
            for(var i in data.room_types){

                //Iterate through sets
                for(var j in data.sets){
                    roomAddDetails = {};
                    var foundRoomType = false;

                    //Room rates in sets
                    for(var k in data.sets[j].room_rates){
                        roomRate = data.sets[j].room_rates[k];
                        if(data.room_types[i].id == roomRate.id){
                            foundRoomType = true;
                            continue;
                        }
                    }

                    //If the current room_type detail not available in the room_rates dict from server
                    //Add the room room_type to the set with details as empty.
                    if(!foundRoomType){
                        roomAddDetails.child = '';
                        roomAddDetails.double = '';
                        roomAddDetails.extra_adult = '';
                        roomAddDetails.single = '';
                        roomAddDetails.id = data.room_types[i].id;
                        roomAddDetails.name = data.room_types[i].name;
                        data.sets[j].room_rates.push(roomAddDetails);
                    }
                }
            }

            return data;
        };

        this.saveSet = function (data) {
            var deferred = $q.defer();
            var url = "/api/rate_sets";
            delete data['id'];
            
            ADBaseWebSrvV2.postJSON(url, data).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.updateSet = function (data) {
            var deferred = $q.defer();
            var url = "/api/rate_sets/" + data.id;
            delete data['id'];
            ADBaseWebSrvV2.putJSON(url, data).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
        this.deleteSet = function (id) {

            var deferred = $q.defer();
            var url = "/api/rate_sets/" + id;
            ADBaseWebSrvV2.deleteJSON(url).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;

        };
        this.updateDateRange = function (data) {
            var deferred = $q.defer();
            var id = data.dateId;
            var url = "/api/rate_date_ranges/" + id;
            ADBaseWebSrvV2.putJSON(url, data).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

    }
]);