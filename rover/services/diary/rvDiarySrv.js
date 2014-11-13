sntRover.service('rvDiarySrv', ['$q', 'RVBaseWebSrv', 'rvBaseWebSrvV2', 'rvDiaryStore',
        function($q, RVBaseWebSrv, rvBaseWebSrvV2, store) {
                var std_params = {
                        begin_date: undefined,
                        begin_time: undefined,
                        end_date: undefined,
                        end_time: undefined
                    },
                    std_params_addl = {
                        rate_id: undefined,
                        room_type_id: undefined
                    },
                    hops = Object.prototype.hasOwnProperty,
                    define = Object.defineProperty,
                    api_config = {
                        Availability: {
                            type: 'GET',
                            url: 'api/hourly_availability',
                            params: _.extend({}, std_params, std_params_addl),
                            namespace: 'results.availability'
                        },
                        AvailabilityCount: {
                            type: 'GET',
                            url: 'api/hourly_availability_count',
                            params: _.extend({}, std_params, std_params_addl),
                            namespace: 'availability_count_per_hour',
                            store: {
                                data: {}
                            }
                        },
                        Occupancy: {
                            type: 'GET',
                            url: 'api/hourly_occupancy',
                            params: dateRangeTransfer,
                            namemspace: 'reservations',
                            store: {
                                data: undefined,
                                index: {
                                    id: {},
                                    room_id: {},
                                    room_type: {}
                                }
                            }
                        },
                        Room: {
                            type: 'GET',
                            url: 'api/rooms',
                            params: undefined,
                            namespace: 'results',
                            store: {
                                data: {},
                                index: {
                                    id: {},
                                    reservation_id: {},
                                    room_type: {} 
                                }
                            }
                        },
                        RoomType: {
                            type: 'GET',
                            url: '/api/room_types.json?is_exclude_pseudo=true',
                            params: undefined,
                            namespace: 'results',
                            store: {
                                data: {},
                                index: {
                                    id: {}
                                }
                            }
                        },
                        Maintenance: {
                            type: 'GET',
                            url: '/api/room_types_task_completion_time?exclude_pseudo=true',
                            params: undefined,
                            namespace: 'results',
                            store: {
                                data: {},
                                index: {
                                    room_type_id: {}
                                }
                            }
                        }
                    },
                    APIs = {
                        GET: rvBaseWebSrvV2.getJSON.bind(rvBaseWebSrvV2)
                    },
                    request = function(klass) {
                        return _.partial(APIs[klass.type], klass.url, klass.params);
                    };
                
                function dateRangeTransfer(start_date, end_date) {
                    var s_comp = start_date.toComponents(),
                        e_comp = end_date.toComponents();

                    return {
                        begin_time: s_comp.time.toString(),
                        end_time: e_comp.time.toString(),
                        begin_date: s_comp.date.toDateString(),
                        end_date: e_comp.date.toDateString()
                    };
                }


               /* function resolve(config, data) {
                    config.store.data = data[config.namespace];

                    _.map(_.keys(config.store.index), function(key) {
                        this.index[key] = _.groupBy(this.data, key);
                    }.bind(config.store));
                }*/

                this.load = function(arrival_time) {     
                        var start_date = new Date(arrival_time - 7200000),
                        end_date = new Date(arrival_time + 86400000),
                        mt = request(api_config.Maintenance),
                        rt = request(api_config.RoomType),
                        rm = request(api_config.Room),
                        oc = request(api_config.Occupancy);

                        api_config.Occupancy.params = dateRangeTransfer(start_date, end_date);

                        var resolve = function(fn, data) {
                            this.store.data = data[this.namespace];
                            var temp = _.chain(Object.keys(this.store.index))
                                .map(function(by) {
                                    var index_by = by.slice(3);

                                    return index_by;
                                })
                                .indexBy()
                                .value();

                            return fn();
                        }

                        mt().then(resolve.bind(api_config.Maintenance, rt))
                            .then(resolve.bind(api_config.RoomType, rm))
                            .then(resolve.bind(api_config.Room, oc))
                            .then(resolve.bind(api_config.Occupancy, 
                            function() {
                                var occ = api_config.Occupancy,
                                    rooms = api_config.Room,
                                    room_types = api_config.RoomType,
                                    maintenance = api_config.Maintenance;

                                var o_r = _.chain(occ.store.data).invoke(store.normalizeOccupancy).groupBy('room_id').value();

                                return {
                                    start_date: start_date,
                                    rooms: rooms.store.data,
                                    room_types: room_types.store.data
                                };
                            }
                        });
                

                //_.extend(api_config.Occupancy.params, configOccParams());

                this.FilterOptions = {
                    fetchArrivalTimes: function(base_interval) {
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
                    },
                    fetchRates: function() {
                        var q = $q.defer();

                        rvBaseWebSrvV2.getJSON('/api/rates')
                            .then(function(data) {
                                q.resolve(data.results);
                            }, function(data) {
                                q.reject(data);
                            });

                        return q.promise;
                    };

                };

                this.fetchAvailability = function(start_date, end_date, rate_id, room_type_id) {
                    var self = this,
                        q = $q.defer(),
                        gen_uid = _.uniqueId('available-'); //USED TO RESIZE ALL INSERTED ELEMENTS SIMULTANEOUSLY

                    this.fetchData(start_date, end_date, api.availability, rate_id, room_type_id)
                        .then(function(payload) {
                            var ref_data = store.payload(),
                                data = payload.results[0].availability,
                                reference_slot, row_item_data, row_data;

                            data.forEach(function(ava) {
                                reference_slot = store.mergeAvailableSlots(start_date,
                                    end_date,
                                    gen_uid,
                                    rate_id,
                                    ava);
                                if (!row_item_data && reference_slot) {
                                    row_item_data = util.deepCopy(reference_slot);
                                    row_data = _.findWhere(ref_data.rooms, {
                                        id: row_item_data.room_id
                                    });
                                }
                            });


                            q.resolve({
                                start_date: start_date,
                                end_date: end_date,
                                stay_dates: _.flatten(payload.results),
                                row_data: row_data,
                                row_item_data: row_item_data
                            });

                        });

                    return q.promise;
                };

            }]);
                //------------------------------------------------------------------
