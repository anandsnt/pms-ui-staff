sntRover
    .service('rvDiarySrv', ['$q', 'RVBaseWebSrv','rvBaseWebSrvV2','rvDiaryUtilSrv', 'rvDiaryStoreSrv',
            function($q, RVBaseWebSrv, rvBaseWebSrvV2, util, store) {
                var hops = Object.prototype.hasOwnProperty,
                    slice = Array.prototype.slice,
                    define = Object.defineProperty,
                    api_types = Object.freeze({
                        availability: {
                            url: 'api/hourly_availability', 
                            type: 'data'
                        },
                        availability_count: {
                            url: 'api/hourly_availability', 
                            type: 'count'
                        },
                        occupancy: {
                            url: 'api/hourly_occupancy', 
                            type: 'data'
                        }
                    }),
                    payload = store.payload();

                this.fetchArrivalTimes = function(base_interval) {
                    var times = [],
                        day_min = 24 * 60,
                        q = $q.defer(),
                        min, cur_time;

                    for (var i = 0; i < day_min; i += base_interval) {
                        min = i % 60;
                        cur_time = parseInt(i / 60, 10) + ':' + (min === 0 ? '00' : min);

                        times.push(cur_time);
                    }

                    q.resolve({
                        arrival_times: times
                    });

                    return q.promise;
                };

                this.fetchRates = function() {
                    var q = $q.defer();

                    rvBaseWebSrvV2.getJSON('/api/rates')
                    .then(function(data) {
                        q.resolve(data.results);
                    }, function(data) {
                        q.reject(data);
                    });

                    return q.promise;
                };

                this.init = function(start_date, end_date) {
                    var self = this,
                        q = $q.defer(),
                        room_types,
                        rooms,
                        occupancy;

                    start_date.setHours(0, 0, 0, 0);

                    $q.all([self.fetchData(start_date, end_date, api_types.occupancy),
                        self.fetchArrivalTimes(15),
                        self.fetchRates()
                    ]).then(function(data) {
                            store.transform(data[0], {
                                arrival_times: data[1].arrival_times,
                                rates: data[2]
                            });

                            q.resolve(store.payload());
                        }, function(err) {
                            q.reject(err);
                        });

                    return q.promise;
                };

                this.fetchOccupancy = function(start_date, end_date, inc_room_data_flag) {
                    var q = $q.defer();

                    this.fetchData(start_date, end_date, api_types.occupancy)
                        .then(q.resolve(util.deepCopy(data), function(err) {
                            q.reject(err);
                        }));

                    return q.promise;
                };

                this.fetchAvailability = function(start_date, end_date, rate_id, room_type_id) {
                    var self = this,
                        q = $q.defer(),
                        gen_uid = _.uniqueId('available-'); //USED TO RESIZE ALL INSERTED ELEMENTS SIMULTANEOUSLY

                    this.fetchData(start_date, end_date, api_types.availability, rate_id, room_type_id)
                        .then(function(payload) {
                            var ref_data = store.payload(),
                                data = payload.results[0].availability;
                                
                                


                            data.forEach(function(ava) {
                                store.mergeAvailableSlots(start_date,
                                                            end_date,
                                                            gen_uid,
                                                            rate_id,
                                                            ava);
                            });
                            
                            

                            $q.all(deferredArray)
                                .then(function(data) {
                                    q.resolve({
                                        start_date: start_date,
                                        end_date: end_date,
                                        stay_dates: _.flatten(payload.results),
                                        row_data: ref_data.rooms[0],
                                        row_item_data: ref_data.rooms[0].occupancy[0]
                                    });
                                }, function(err) {
                                    q.reject(err);
                                });
                        });

                    return q.promise;
                };

                this.fetchAvailabilityCount = function(start_date, end_date) {
                    var q = $q.defer();

                    this.fetchData(start_date, end_date, api_types.availability_count)
                        .then(function(data) {
                            q.resolve(copyArray(availability_count, data));
                        }, function(err) {
                            q.reject(err);
                        });

                    return q.promise;
                };             

                this.fetchData = function(start_date, end_date, type_config, rate_id, room_type_id) {
                    var q = $q.defer(),
                        s_comp = start_date.toComponents(),
                        e_comp = end_date.toComponents(),

                        dto = {
                            begin_time:     s_comp.time.toString(),
                            end_time:       e_comp.time.toString(),
                            begin_date:     s_comp.date.toDateString(),
                            end_date:       e_comp.date.toDateString(),
                            type:           type_config.type,
                            rate_id:        rate_id,
                            room_type_id:   room_type_id
                        };

                        rvBaseWebSrvV2
                        .getJSON(type_config.url, dto)
                        .then(function(data) {
                            q.resolve(util.mixin(data, {
                                start_date: start_date,
                                end_date: end_date
                            }));
                        }, function(data) {
                            q.reject(data);
                        });

                    return q.promise;
                };
            }]);
