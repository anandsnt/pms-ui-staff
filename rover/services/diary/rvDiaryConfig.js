sntRover
    .factory('rvDiaryConfig', ['rvBaseWebSrvV2', 
    function(rvBaseWebSrvV2) {
        var Descriptors,
            settings = {
                params: {
                    ___init: function(start_date, end_date) {
                         var s_comp =   start_date.toComponents(),
                             e_comp =   end_date.toComponents();

                        return {
                            begin_time: s_comp.time.toString(),
                            end_time:   e_comp.time.toString(),
                            begin_date: s_comp.date.toDateString(),
                            end_date:   e_comp.date.toDateString()
                        };                       
                    }
                },
                optional: {
                    rate_id: undefined,
                    room_type_id: undefined                   
                }
            },
            config  = {
                init: function(start_date, params) {
                    var api = this.api;

                        if(!_.isNumber(start_date)) {
                            start_date = Date.now();
                            start_date = new Date(start_date);
                            start_date = new Date(start_date.getFullYear(),
                                         start_date.getMonth(),
                                         start_date.getDate(),
                                         0, 
                                         0, 
                                         0);
                        }

                        api.params = settings.params.___init(new Date(start_date - 7200000),
                                                         new Date(start_date + 86400000)); 
                        if(params) {
                            api.params.rate_id = params.rate_id;
                            api.params.room_type_id = param.room_type_id;
                        }

                        return this;
                },
                api: {
                    type: undefined,
                    url: undefined,
                    params: { },
                    namespace: undefined
                },
                request: function() {
                    var klass = this,
                        type_map = {
                            GET: rvBaseWebSrvV2.getJSON.bind(rvBaseWebSrvV2)
                        };

                    return _.partial(type_map[klass.type], klass.url, klass.params);
                }.bind(this.api)
            };

             Descriptors = {
                Availability: config.init({
                    type: 'GET',
                    url: 'api/hourly_availability',
                    namespace: 'results.availability'
                }),
                AvailabilityCount: config.init({
                    type: 'GET',
                    url: 'api/hourly_availability_count',
                    namespace: 'availability_count_per_hour',
                    store: {
                        data: {}
                    }
                }),
                Occupancy: config.init({
                    type: 'GET',
                    url: 'api/hourly_occupancy',
                    namemspace: 'reservations',
                    store: {
                        data: undefined,
                        index: {
                            id: undefined,
                            room_id:  undefined,
                            room_type: undefined
                        }
                    }
                }),
                Room: config.init({
                    type: 'GET',
                    url: 'api/rooms',
                    params: undefined,
                    namespace: 'results',
                    store: {
                        data: undefined,
                        index: {
                            id: undefined,
                            reservation_id: undefined,
                            room_type: undefined
                        }
                    }
                }),
                RoomType: config.init({
                    type: 'GET',
                    url: '/api/room_types.json?is_exclude_pseudo=true',
                    params: undefined,
                    namespace: 'results',
                    store: {
                        data: undefined,
                        index: {
                            id: undefined
                        }
                    }
                }),
                Maintenance: config.init({
                    type: 'GET',
                    url: '/api/room_types_task_completion_time?exclude_pseudo=true',
                    params: undefined,
                    namespace: 'results',
                    store: {
                        data: undefined,
                        index: {
                            room_type_id: undefined
                        }
                    }
                })
            };

            return Descriptors;
        }
]);
