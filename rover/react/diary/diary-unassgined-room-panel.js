var UnassignedRoomPanel = React.createClass({
    __onToggle: function() {
        this.props.unassignedRoomList.fetchList();

        this.props.iscroll.unassignedList.enable();
        this.setState({
            selectedIndex: null
        });
    },

    __getTimeDiff: function(arrivalDate, arrivalTime, departureDate, departureTime) {
        var arrival = {},
            departure = {},
            dateParts,
            timeParts,
            fullArrivalDate,
            fullDepartureDate,
            difference,
            fraction;

        var arrivalTimeFix, departureTimeFix;
        if ( ! arrivalTime || ! departureTime ) {
            arrivalTimeFix = "00:00";
            departureTimeFix = "04:00";
        } else {
            arrivalTimeFix = arrivalTime;
            departureTimeFix = departureTime;
        }

        dateParts = arrivalDate.split('-');
        arrival.year = parseInt( dateParts[0] );
        arrival.month = parseInt( dateParts[1] ) - 1;
        arrival.date = parseInt( dateParts[2] );
        /**/
        timeParts = arrivalTimeFix.split(':');
        arrival.hour = parseInt( timeParts[0]);
        arrival.mins = parseInt( timeParts[1]);

        dateParts = departureDate.split('-');
        departure.year = parseInt( dateParts[0] );
        departure.month = parseInt( dateParts[1] ) - 1;
        departure.date = parseInt( dateParts[2] );
        /**/
        timeParts = departureTimeFix.split(':');
        departure.hour = parseInt( timeParts[0] );
        departure.mins = parseInt( timeParts[1] );

        fullArrivalDate = new Date(arrival.year, arrival.month, arrival.date, arrival.hour, arrival.mins);
        fullDepartureDate = new Date(departure.year, departure.month, departure.date, departure.hour, departure.mins);

        difference = Math.abs( fullDepartureDate - fullArrivalDate ) / 36e5;
        fraction = Math.ceil( ((difference < 1.0) ? difference : (difference % Math.floor(difference))) * 10 );

        difference = Math.floor(difference);

        return {
            hh: difference,
            mm: fraction,
            hhs: difference + 'h'
        }
    },

    __onListSelect: function(index) {
        this.props.iscroll.unassignedList.disable();
        this.setState({
            selectedIndex: index.toString()
        });

        var item = this.props.unassignedRoomList.data[index];
        this.props.unassignedRoomList.selectAnUnassigned({
            arrival_date: item.arrival_date, 
            arrival_time: item.arrival_time,
            departure_date: item.departure_date,
            departure_time: item.departure_time,
            
            reservationId: item.reservation_id,
            adults: item.adults,
            children: item.children,
            infants: item.infants,
            rate_id: item.rate_id,
            room_type_id: item.room_type_id,

            stay_span: this.__getTimeDiff(item.arrival_date, item.arrival_time, item.departure_date, item.departure_time)
        });
    },

    getInitialState: function() {
        return {
            selectedIndex: null
        };
    },

    componentDidUpdate: function(){
        var iscroll = this.props.iscroll;
        iscroll.unassignedList.refresh();
    },

    componentDidMount: function() {
        var self = this,
            rootEl = angular.element( this.getDOMNode() );

        var dragstart = function(e) {
            event.dataTransfer.effectAllowed = 'move';
        };

        var dragend = function(e) {
            self.props.iscroll.unassignedList.enable();
            self.props.unassignedRoomList.dragEnded();
            self.setState({
                selectedIndex: null
            });
        };

        rootEl.on('dragstart', '.occupancy-block', dragstart);
        rootEl.on('dragend', '.occupancy-block', dragend);

        var iscroll = this.props.iscroll;
        iscroll.unassignedList = new IScroll('#unassigned-list', {
            scrollbars: 'custom',
            scrollX: false,
            scrollY: true,
            tap: true,
            //bounce: false,
            //useTransition: true
        });
        setTimeout(function () {
            iscroll.unassignedList.refresh();
        }, 0);
    },

    componentWillUnmount: function() {
        var rootEl = angular.element( this.getDOMNode() );

        rootEl.off('dragstart');
        rootEl.off('dragend');

        this.props.iscroll.unassignedList.destroy();
        this.props.iscroll.unassignedList = null;
    },

    componentWillReceiveProps: function(nextProps) {
        if ( nextProps.edit.active || (nextProps.edit.passive && nextProps.unassignedRoomList.selectedReservations.length) ) {
            this.setState({
                selectedIndex: null
            });
        }
    },

    render: function() {
        var self = this;

        var panelClassName = 'sidebar-right';
        if ( this.props.unassignedRoomList ) {
           panelClassName = this.props.unassignedRoomList.open ? 'sidebar-right open' : 'sidebar-right';
        }

        var __getItemClassName = function(index) {
            return index.toString() === self.state.selectedIndex ? 'occupancy-status editing occupied check-in' : 'occupancy-status occupied check-in';
        };

        var unassignedList;
        if ( this.props.unassignedRoomList ) {
            unassignedList = this.props.unassignedRoomList.data.map(function(room, i) {
                return (
                    React.DOM.div({
                            key: i,
                            id: 'ob-' + i,
                            className: 'occupancy-block',
                            draggable: !! self.state.selectedIndex,
                            onClick: function () { self.__onListSelect(i); }
                        },
                        React.DOM.span({
                                className: __getItemClassName(i)
                            },
                            React.DOM.span({
                                className: 'guest-name'
                            }, room.guests),
                            React.DOM.span({
                                className: 'room-type'
                            }, room.room_type_name),
                            React.DOM.span({
                                    className: 'occupancy-time'
                                },
                                React.DOM.span({
                                    className: 'duration'
                                }, self.__getTimeDiff(room.arrival_date, room.arrival_time, room.departure_date, room.departure_time).hhs ),
                                React.DOM.span({
                                    className: 'eta'
                                }, room.arrival_time)
                            )
                        )
                    )
                );
            });
        }

        return (
            React.DOM.div({
                    id: 'room-diary-rooms',
                    className: panelClassName,
                },
                React.DOM.a({
                    className: 'rightMenuHandle',
                    onClick: this.__onToggle
                }),
                React.DOM.div({
                        className: 'sidebar-header'
                    },
                    React.DOM.h2({
                        className: 'sidebar-header'
                    }, 'Unassigned Rooms'),
                    React.DOM.p({
                        className: 'sidebar-header'
                    }, 'Drag & Drop To Assign or Unassign a Room')   
                ),
                React.DOM.div({
                        id: 'unassigned-list',
                        className: 'scrollable'
                    },
                    React.DOM.div({
                        className: 'wrapper'
                    }, unassignedList)
                )
            )
        );
    }
});
