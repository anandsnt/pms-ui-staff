sntRover.service('rvDiarySrv', ['$q', 'RVBaseWebSrv', 'rvBaseWebSrvV2', 'rvDiaryStore', 'rvDiaryUtil',
        function($q, RVBaseWebSrv, rvBaseWebSrvV2, store, util) {
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
                    slice = Array.prototype.slice,
                    api_config = {
                        Availability: {
                            type: 'GET',
                            url: 'api/hourly_availability',
                            params: _.extend({}, std_params, std_params_addl),
                            namespace: 'results',
                            store: {
                                data: []
                            }
                        },
                        AvailabilityCount: {
                            type: 'GET',
                            url: 'api/hourly_availability_count',
                            params: _.extend({}, std_params, std_params_addl),
                            namespace: 'availability_count_per_hour',
                            store: {
                                data: []
                            }
                        },
                        Occupancy: {
                            type: 'GET',
                            url: 'api/hourly_occupancy',
                            params: dateRangeTransfer,
                            namemspace: 'reservations',
                            store: {
                                data: [],
                                index: {
                                    reservation_d: {},
                                    room_id: {},
                                    room_type: {}
                                }
                            }
                        },
                        Room: {
                            type: 'GET',
                            url: 'api/rooms',
                            params: undefined,
                            namespace: 'rooms',
                            store: {
                                data: [],
                                index: {
                                    id: {},
                                    room_no: {},
                                    room_type_id: {} 
                                }
                            }
                        },
                        RoomType: {
                            type: 'GET',
                            url: '/api/room_types.json?is_exclude_pseudo=true',
                            params: undefined,
                            namespace: 'results',
                            store: {
                                data: [],
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
                                data: [],
                                index: {
                                    room_type_id: {}
                                }
                            }
                        },
                        Rate: {
                            type: 'GET',
                            params: undefined,
                            namespace: 'rates',
                            store: {
                                data: [],
                                index: {
                                    rate_id: {}
                                }
                            }
                        }
                    },
                    APIs = {
                        GET: rvBaseWebSrvV2.getJSON.bind(rvBaseWebSrvV2)
                    },
                    request = function(klass) {
                        return _.partial(APIs[klass.type], klass.url, klass.params);
                    },
                    resolve = function(fn, data) {
                        var self = this;

                        if(_.has(data, this.namespace) && _.isArray(data[this.namespace])) {
                            this.store.data = slice.call(data[this.namespace]);
                        
                            if(_.has(this.store, 'index')) {
                                _.each(Object.keys(this.store.index), function(by) {
                                    var index_by =by;

                                    self.store.index[index_by] = _.indexBy(self.store.data, index_by);
                                });
                            }
                        }

                        return fn();
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

                this.load = function(arrival_time) {     
                    var start_date = new Date(arrival_time - 7200000),
                        end_date = new Date(arrival_time + 86400000),
                        arrival_times = this.fetchArrivalTimes(15),
                        mt = request(api_config.Maintenance),
                        rt = request(api_config.RoomType),
                        rm = request(api_config.Room),
                        oc = request(api_config.Occupancy),
                        ar = request(api_Config.Rate),
                        q = $q.defer();

                        api_config.Occupancy.params = dateRangeTransfer(start_date, end_date);

                        mt().then(resolve.bind(api_config.Maintenance, rt))
                            .then(resolve.bind(api_config.RoomType, rm))
                            .then(resolve.bind(api_config.Room, oc))
                            .then(resolve.bind(api_config.Occupancy, 
                            function() {
                                var occ = api_config.Occupancy,
                                    rooms = api_config.Room,
                                    room_types = api_config.RoomType,
                                    maintenance = api_config.Maintenance;

                                //var o_r = _.chain(occ.store.data).invoke(store.normalizeOccupancy).groupBy('room_id').value();

                                _.each(room_types.store.data, function(rt) {
                                    if(rt.id in maintenance.store.index.room_type_id) {
                                        rt.housekeeping_task_completion_time = maintenance.store.index.room_type_id[rt.id].housekeeping_task_completion_time;
                                    }
                                });

                                store.transform({
                                    start_date: start_date,
                                    end_date: end_date,
                                    arrival_times: arrival_times,
                                    rooms: rooms.store.data,
                                    room_types: room_types.store.data,
                                    occupancy: occ.store.data
                                });

                                q.resolve(store.payload());
                            }
                        ));

                    return q.promise;
                };

                //_.extend(api_config.Occupancy.params, configOccParams());

                this.fetchArrivalTimes = function(base_interval, offset) {
                    var times = [],
                        day_min = 24 * 60,
                        min, cur_time;

                    if(!offset) {
                        offset = {
                            hours: 0,
                            min: 0
                        };
                    }

                    for (var i = 0; i < day_min; i += base_interval) {
                        min = offset.min + (i % 60);
                        cur_time = offset.hours + parseInt(i / 60, 10) + ':' + (min === 0 ? '00' : min);

                        times.push(cur_time);
                    }

                    return times;
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

                this.Availability = function(start_date, end_date, rate_id) {
                    var ava = api_config.Availability,
                        q = $q.defer(),
                        gen_uid = _.uniqueId('available-'); 

                    ava.params = dateRangeTransfer(start_date, end_date);
                    ava.params.rate_id = rate_id;

                    request(ava)().then(resolve.bind(ava, function() {
                        var set = _.pick(ava.store.data.shift(), 'availability');

                        if(_.isObject(set) && _.has(set, 'availability')) {
                            var data = set.availability,
                                stay_date = data.date,
                                reference_slot, 
                                row_item_data, 
                                row_data,
                                merge = _.partial(store.mergeAvailableSlots, start_date, end_date, gen_uid, rate_id);

                            data.forEach(function(occupancy) {
                                reference_slot = merge(occupancy);

                                if (!row_item_data && reference_slot) {
                                    row_item_data = util.deepCopy(reference_slot);
                                    row_data = _.findWhere(store.payload().rooms, {
                                        id: row_item_data.room_id
                                    });
                                }
                            });

                            q.resolve({
                                start_date:     start_date,
                                end_date:       end_date,
                                stay_dates:     [data.date],
                                row_data:       row_data,
                                row_item_data:  row_item_data
                            });

                        };
                    }));

                    return q.promise;
                };
            }]);
                //------------------------------------------------------------------
