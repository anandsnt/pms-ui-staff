sntRover.service('rvDiarySrv', ['$q', 'RVBaseWebSrv', 'rvBaseWebSrvV2', 'rvDiaryUtil', 'rvDiaryMetadata', '$vault',
        function($q, RVBaseWebSrv, rvBaseWebSrvV2, util, meta, $vault) {
                /* DATA STORE w/ set functions */
                function STORE() {
                    if(!(this instanceof STORE)) {
                        return new STORE();
                    }
                    this.bCreated = true;
                    this.creation_time = Date.now(); //_.now();
                }
                STORE.prototype = {
                    constructor: STORE,
                    /* Deserves to be in a more standard util library like UTILS!*/
                    namespace: function(def) {
                        var props = def.split('.'),
                            ret = this;

                        for(var i = 0, len = props.length; i < len; i++) {     
                            ret = ret[props[i]]; 
                        }

                        return ret;
                    },
                    set: function() {
                        var args = _.toArray(arguments),
                            setLookups = function(args) {
                                var key = args.shift(),
                                    val = args.shift();

                                if(_.isObject(val) && _.has(val, 'data')) {   
                                    this[key]           = val.data;      
                                    this['_' + key]     = val.index;
                                    this['__' + key]    = val.group;
                                } else{
                                    this[key]           = val;
                                }
                            }.bind(this);

                        switch(args.length) {
                            case 1:
                                if(_.isObject(args[0])) {
                                    _.each(_.pairs(args[0]), 
                                           function(data) {
                                                setLookups(data);
                                    });
                                }
                            break;
                            case 2:
                                setLookups(args);
                            break;
                        }

                        return this;
                    },
                    get: function(field) {
                        var args = _.toArray(arguments);

                        switch(args.length) {
                            case 1:
                                return this.namespace(args[0]);
                            default:
                                return _.pick(this, args);
                        }

                        //return this[field];
                    },
                    /*Merge [incoming] occupanices into [existing] room occupanices in 
                      the data model.  

                      Constraints: 
                        1) Maintain ascending sorted order by 'arrival' time in ms for each occupancy
                           (Why?  When scrolling, or jumping calendar dates, memory usage can be minimized
                            by chomping left side of occupancy collection at the point were the
                            ( scroll position / display.px_per_ms ) at x_origin +- resolving distance)

                      See also:
                        Coordinate system and Viewport composition
                        -details the relatiionship between occupancy set and x_origin bounded by LSR <> RSD
                        --LSR (left spatial resolution -> how far we see into the past) and similary for RSD
                    */
                    mergeOccupancies: function(room_oc_groups, isAvailability) {
                        var idx,
                            r,
                            existing,
                            incoming,
                            set_difference,
                            room_ids    = _.keys(room_oc_groups);

                        for(var i = 0, len = room_ids.length; i < len; i++) {
                            idx = +room_ids[i];

                            r = _.findWhere(this.get('room'), { id: idx });

                            existing = util.copyArray(r.occupancy, existing); //index[room_ids[i]].occupancy;
                            incoming = _.sortBy(room_oc_groups[idx], 'arrival');

                            if(existing.length === 0) {
                                r.occupancy = util.copyArray(existing.concat(incoming), r.occupancy);
                            } else {
                                set_difference = this.difference(existing, incoming, 'reservation_id');

                                if(set_difference.length > 0) {
                                    existing = this.merge(existing, 
                                                          _.sortBy(set_difference, 'arrival'), 
                                                          [], 
                                                          'arrival');

                                    r.occupancy = util.copyArray(existing, r.occupancy);
                                }     
                            }
                        }
                    },
                    /* Calculate the difference between sets */
                    difference: function(existing, incoming, itr, isAvailability) {
                        var diff    = _.difference(_.pluck(incoming, itr), _.pluck(existing, itr)),
                            result = [];
                        
                        if(diff.length > 0) {
                            result = _.filter(incoming, function(id) { return diff.indexOf(id); });
                        }

                        return result;
                    },
                    /* Merge two sorted lists */
                    merge: function(list_a, list_b, output, itr) {
                        var i = 0;
                            
                        while (list_a.length > 0 && list_b.length > 0) {
                            output.push(list_b[0][itr] < list_a[0][itr] ? list_b.shift() : list_a.shift());
                        }

                        return output.concat(list_a.length > 0 ? list_a : list_b);
                    }  
                };
      
                this.data_Store = new STORE();

                function Config(config, param_cfg, index_cfg, group_cfg, dataStore, normalizationFn, mergeFn) {
                    if(!(this instanceof Config)) {
                        return new Config(config, param_cfg, index_cfg, group_cfg, dataStore, normalizationFn, mergeFn);
                    }

                    for(var k in config) {
                        if(_.has(config, k)) {
                            this[k] = config[k];
                        }
                    }

                    this.params = {
                        descr: param_cfg || []
                    };

                    this.loaded = false;
                    this.dataStore = dataStore;
                    this.normalize = normalizationFn;
                    this.merge = mergeFn;
                    this.store = {
                        data: [],
                        index: {
                            values: Object.create(null),
                            descr: index_cfg || []
                        },
                        group: {
                            values: Object.create(null),
                            descr: group_cfg || []
                        }
                    };
                }

                Config.prototype = {
                    constructor: Config,
                    apis: {
                        GET: rvBaseWebSrvV2.getJSON.bind(rvBaseWebSrvV2)
                    },
                    read: function(params) {
                        //if(this.cache && this.loaded) {
                            //return $q.when(this.dataStore.get(this.name));
                        //} else {
                            return this.request('GET', params)();
                        //}
                    },
                    request: function(type, params) {
                        return _.partial(this.apis[type], this.url, params);
                    },
                    resolve: function(data, normalizeParams) {
                        var self = this,
                            recv = (data) ? data[this.namespace] : null,
                            local_store = this.store,
                            prefix = this.key_prefix;

                        if(recv !== null) { 
                            local_store.data= recv;  

                            this.homogenizeValues();
                            this.generateIndex();
                            this.generateGroup();

                            this.dataStore.set(self.name, local_store);

                            this.normalization(normalizeParams);
                            this.mergeData();

                            this.loaded = true;
                        }
                    },
                    homogenizeValues: function() {
                        var id = this.id,
                            local_store = this.store,
                            prefix = this.key_prefix;

                        if(_.isArray(local_store.data)) {
                            _.each(local_store.data, function(datum) {
                                if(prefix) { 
                                    datum.key = _.uniqueId(prefix + (datum[id] || _.random(0, 100000)) + '-');
                                }

                                for(var k in datum) {
                                    if(_.has(datum, k) && k !== 'room_no') {
                                        if(/^\d+\.?\d*$/.test(datum[k])) {
                                            datum[k] = +datum[k];
                                        }
                                    }
                                }      
                            });
                        }
                    },
                    mergeData: function() {
                        var local_store = this.store;

                        if(this.merge) {
                            this.merge(local_store.data);
                        }
                    },
                    normalization: function(normalizeParams) {
                        var local_store = this.store,
                            self = this;

                        if(this.normalize) {
                            _.each(local_store.data, function(obj) {
                                if(!normalizeParams) {
                                    self.normalize.call(self, obj);
                                } else{
                                    self.normalize.apply(self, [obj].concat(normalizeParams));
                                }
                            });
                        }
                    },
                    generateIndex: function() {
                        var local_store = this.store;

                        _.each(local_store.index.descr, function(index_by) {
                            local_store.index.values[index_by] = _.indexBy(local_store.data, index_by);
                        });
                    },
                    generateGroup: function() {
                        var local_store = this.store;

                        _.each(local_store.group.descr, function(group_by) {
                                local_store.group.values[group_by] = _.groupBy(local_store.data, group_by);
                        });                  
                    },
                    normalizeTime: function(date, time) {
                        var std = (time.indexOf('am') > -1 || time.indexOf('pm') > -1),
                            t_a = time.slice(0, -3),
                            t_b = time.slice(-2);

                        return Date.parse(date + ' ' + (std ? t_a + ' ' + t_b : time));
                    },
                    normalizeMaintenanceInterval: function(time) {
                        var intervals = time / 15,
                            intervals_per_hr = 4;

                        return parseInt(intervals); 
                    }       
                };

                /* Parameterize default format dates into API formatted strings */
                function dateRange(start_date, end_date, room_type_id) {
                    var s_comp = start_date.toComponents(),
                        e_comp = end_date.toComponents(),
                        params =  {
                            begin_time: s_comp.time.toString(),
                            end_time:   e_comp.time.toString(),
                            begin_date: s_comp.date.toDateString(),
                            end_date:   e_comp.date.toDateString()
                        };

                    if(room_type_id) {
                        _.extend(params, { room_type_id: room_type_id });
                    }

                    return params;
                }

                /* ROOM Configuration Adapter */
                var Room = Config({
                    id:         meta.room.id,
                    name:       'room',                       
                    url:        'api/rooms',
                    key_prefix: 'rm-',
                    namespace:  'rooms',
                    cache:      true
                }, 
                undefined, 
                ['id', 'room_no'],
                ['room_type_id'],
                this.data_Store,
                function(room) {
                    var room_type_id = room.room_type_id,
                        room_type = this.dataStore.get('_room_type.values.id')[room_type_id],
                        maintenance = this.dataStore.get('_maintenance.values.room_type_id')[room_type_id];

                    if(maintenance) {
                        room_type[meta.maintenance.time_span] = maintenance[meta.maintenance.time_span];
                    }
                    room.room_type = room_type;
                    room.occupancy = [];

                    return room;
                }),

                /* ROOM TYPE Configuration Adapter */
                RoomType = Config({
                    id:         meta.room_type.id,
                    name:       'room_type',
                    url:        '/api/room_types.json?is_exclude_pseudo=true',
                    key_prefix: 'rt-',
                    namespace:  'results',
                    cache:      true
                }, 
                undefined, 
                ['id'],
                undefined,
                this.data_Store),

                /* ROOM MAINTENANCE Configuration Adapter */
                Maintenance= Config({
                    id:             meta.maintenance.id,
                    name:           'maintenance',
                    url:            '/api/room_types_task_completion_time?exclude_pseudo=true',
                    namespace:      'results',
                    cache:          true
                }, 
                undefined, 
                ['room_type_id'],
                undefined,
                this.data_Store,
                function(maintenance) {
                    var m = meta.maintenance;

                    maintenance[m.time_span] = this.normalizeMaintenanceInterval(maintenance[m.time_span]);
                
                    return maintenance;
                }), 
                
                /* OCCUPANCY Configuration Adapter */
                Occupancy =  Config({
                    id:             meta.occupancy.id,
                    name:           'occupancy',
                    url:            'api/hourly_occupancy',
                    key_prefix:     'oc-',
                    namespace:      'reservations'
                }, 
                ['start_date', 'end_date'], 
                ['reservation_id'], 
                ['room_id'],
                this.data_Store,
                function(occupancy) {
                    var m = meta.occupancy,
                        room = this.dataStore.get('_room.values.id')[occupancy.room_id],
                        room_type = room.room_type; 

                    occupancy[m.start_date]     = this.normalizeTime(occupancy.arrival_date, occupancy.arrival_time);
                    occupancy[m.end_date]       = this.normalizeTime(occupancy.departure_date, occupancy.departure_time);
                    occupancy[m.maintenance]    = room_type[meta.maintenance.time_span]; //= this.normalizeMaintenanceInterval(room_type[meta.maintenance.time_span], 15);

                    occupancy[m.room_type]      = angular.lowercase(room_type.name); 
                    occupancy[m.status]         = angular.lowercase(occupancy[m.status]);

                    if(occupancy[m.status] === 'reserved') {
                        occupancy[m.status] = 'check-in';
                    }

                    delete occupancy.arrival_time;
                    delete occupancy.arrival_date;
                    delete occupancy.departure_time;
                    delete occupancy.departure_date;

                    return occupancy;
                },
                function(incoming) {
                    this.dataStore.mergeOccupancies(this.store.group.values.room_id); 
                }),
                
                /*AVAILABILITY Configuration Adapter */
                Availability = Config({
                    id:         meta.availability.id, 
                    name:       'availability',
                    url:        'api/hourly_availability',
                    key_prefix: 'av-',
                    namespace:  'availability' 
                }, 
                ['start_date', 'end_date', 'room_type_id'], 
                undefined, 
                ['id'],
                this.data_Store,
                function() { //slot, start_date, end_date, guid, selected) {
                    var args        = _.toArray(arguments),
                        slot        = args.shift(),
                        start_date  = args.shift(),
                        end_date    = args.shift(),
                        guid        = args.shift(),
                        selected    = args.shift(),
                        m           = meta.occupancy,
                        room        = this.dataStore.get('_room.values.id')[slot.id],
                        room_type   = room.room_type;

                    /*
                        Configrue Available slot to mirror occupancy, execpt
                        set revervation_id for the collection so the resize
                        will work on all as a group.
                    */
                    slot.room_id                = room.id;
                    slot.reservation_status     = 'available';
                    slot.room_service_status    = '';
                    slot.reservation_id         = guid;
                    slot.selected               = selected;
                    slot[m.start_date]          = start_date.getTime();
                    slot[m.end_date]            = end_date.getTime();
                    slot[m.maintenance]         = room_type[meta.maintenance.time_span]; //= this.normalizeMaintenanceInterval(room_type[meta.maintenance.time_span], 15);
                    slot[m.room_type]           = angular.lowercase(room_type.name); 

                    return slot;
                },
                function(incoming) {
                    this.dataStore.mergeOccupancies(this.store.group.values.id, true); 
                }),
                
                /*AVAILABILITY COUNT Configuration Adapter */
                AvailabilityCount = Config({
                    name:       'availability_count',
                    url:        'api/hourly_availability_count',
                    key_prefix: 'ac-',
                    namespace:  'availability_count_per_hour'
                }, 
                ['start_date', 'end_date'],
                undefined,
                undefined,
                this.data_Store),         

                HourlyRate = Config({
                    id:         'min_hours',
                    name:       'min_hours',
                    url:        '/api/hourly_rate_min_hours',
                    namespace:  'min_hours',
                    cache:      true
                },
                undefined,
                undefined,
                undefined,
                this.data_Store);

                /*ROUTER RESOLVE - LOADING POINT FOR DIARY*/
                this.load = function(arrival_time, create_reservation_data) {     
                    var _data_Store     = this.data_Store,
                        time_settings   = util.gridTimeComponents(arrival_time, 50),
                        start_time      = time_settings.x_0.toComponents().time,
                        arrival_times   = this.fetchArrivalTimes(15, { 
                            hours: start_time.hours, 
                            min: (start_time.minutes / 15).toFixed() * 15 
                        }),
                        q = $q.defer();

                        _data_Store.set({
                                company_id: undefined,
                                travel_Agent_id: undefined,
                                guest_first_name: undefined,
                                guest_last_name: undefined,
                                reservation_defaults: {
                                    adults: 1,
                                    children: 0,
                                    infants: 0
                                }
                        });

                        if(create_reservation_data) {
                            time_settings = util.gridTimeComponents(create_reservation_data.start_date, 50);

                            _data_Store.set({ past_date:        time_settings.x_nL,
                                              start_date:       time_settings.x_0, 
                                              end_date:         time_settings.x_nR, 
                                              arrival_times:    arrival_times,
                                              arrival_time:     (new Date(create_reservation_data.start_date)).toComponents().time.toString(),
                                              min_hours:        (create_reservation_data.end_date - create_reservation_data.start_date) / 3600000,
                                              room_type_id:     create_reservation_data.room_type_id, 
                                              company_id:       create_reservation_data.company_id, 
                                              travel_agent_id:  create_reservation_data.travel_agent_id,
                                              reservation_defaults: {
                                                adults: create_reservation_data.adults,
                                                children: create_reservation_data.children,
                                                infants: create_reservation_data.infants
                                              } });
                        } else {
                            _data_Store.set({ past_date:        time_settings.x_nL,
                                              start_date:       time_settings.x_0, 
                                              end_date:         time_settings.x_nR, 
                                              arrival_times:    arrival_times,
                                              arrival_time:     time_settings.x_0.toComponents().time.toString() 
                            });
                        }

                        $q.all([Maintenance.read(),
                                RoomType.read(),
                                Room.read(), 
                                Occupancy.read(dateRange(new Date(time_settings.x_nL.setHours(0, 0, 0)), 
                                                         new Date(time_settings.x_nR.setHours(23, 59, 0)))),
                                AvailabilityCount.read(dateRange(time_settings.x_nL, time_settings.x_nR))])
                        .then(function(data_array) {
                            _.reduce([Maintenance, RoomType, Room, Occupancy, AvailabilityCount], //Rate],
                                function(memo, obj, idx) {  
                                    obj.resolve(data_array[idx]);
                            }, data_array);

                            return HourlyRate.read();
                        })
                        .then(function(data) {
                            HourlyRate.resolve(data);

                            q.resolve(_data_Store.get(
                                                 'past_date',
                                                 'start_date', 
                                                 'end_date', 
                                                 'arrival_times',
                                                 'arrival_time',
                                                 'room',
                                                 'room_type',
                                                 'availability_count',
                                                 'min_hours',
                                                 'reservation_defaults',
                                                 'rate_id',
                                                 'room_type_id',
                                                 'company_id', 
                                                 'travel_agent_id'));
                        }, function(err) {
                            console.log(err);
                        });

                    return q.promise;
                };

                this.fetchArrivalTimes = function(base_interval, offset) {
                    var times   = [],
                        day_min = 24 * 60,
                        int_ms  = 900000,
                        min, hour, cur_time;

                    if(!offset) {
                        offset = {
                            hours: 0,
                            min: 0
                        };
                    }

                    for (var i = 0; i < day_min; i += base_interval) {
                        min = offset.min + (i % 60);
                        hour = (offset.hours + parseInt(i / 60, 10));

                        if(min >= 60) {
                            min = 0;
                            hour += 1;
                        }

                        hour = hour - hour / 24 * (hour % 24 === 0 ? 1 : 0);
                        cur_time =  hour + ':' + (min === 0 ? '00' : min);

                        times.push( cur_time );
                    }

                    return times;
                };

                this.Occupancy = function(start_date, end_date) {
                    var q = $q.defer();

                    Occupancy.read(dateRange(start_date, end_date))
                    .then(function(data) {
                        Occupancy.resolve(data);

                        q.resolve(Occupancy.store.data);
                    }, function(err) {
                        q.reject(err);
                    });

                    return q.promise;
                };

                this.AvailabilityCount = function(start_date, end_date) {
                    var q = $q.defer();

                    AvailabilityCount.read(dateRange(start_date, end_date))
                    .then(function(data) {
                        AvailabilityCount.resolve(data);

                        q.resolve(AvailabilityCount.store.data);
                    }, function(err) {
                        q.reject(err);
                    });

                    return q.promise;
                };

                this.Availability = function(start_date, end_date, room_type_id) { 
                    var _data_Store = this.data_Store,
                        q = $q.defer(),
                        guid = _.uniqueId('available-'); 

                    Availability.read(dateRange(start_date, end_date, room_type_id)) 
                    .then(function(data) {
                        if(data && data.results) {
                            Availability.resolve(data.results.shift(), [
                                start_date,
                                end_date,       
                                guid,
                                false
                            ]);

                            q.resolve(Availability.store.data);
                       }
                    });

                    return q.promise;
                };

                this.ArrivalFromCreateReservation = function() {
                    var data = $vault.get('searchReservationData');

                    if(data) {
                        data = JSON.parse(data);
                    }

                    if(data) {
                        if(data.fromDate === data.toDate) {
                            var start_date  = parseDate(data.fromDate, data.arrivalTime),
                                end_date    = parseDate(data.toDate, data.departureTime);

                            return {
                                start_date:         start_date,
                                end_date:           end_date,
                                adults:             data.adults,
                                children:           data.children,
                                infants:            data.infants,
                                room_type_id:       data.roomTypeID,
                                guest_first_name:   data.guestFirstName,
                                guest_last_name:    data.guestLastName,
                                company_id:         data.companyID,
                                travel_agent_id:    data.TravelAgenID
                            };
                        }
                    }

                    function parseDate(ms, timeObj) {
                        var t_a, t_b;

                        if(timeObj.ampm === 'AM') {
                            t_a = (12 + parseInt(timeObj.hh, 10)) * 3600000;
                        } else {
                            t_a = (parseInt(timeObj.hh, 10)) * 3600000;
                        }

                        t_b = parseInt(timeObj.mm, 10) * 60000;

                        return t_a + t_b + ms;
                    }
                };
            }]);
                //------------------------------------------------------------------
