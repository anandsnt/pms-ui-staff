var UnassignedRoomPanel = React.createClass({

    __getTimeDiff: function(arrivalDate, arrivalTime, departureDate, departureTime) {
        var arrival = {},
            departure = {},
            dateParts,
            timeParts,
            fullArrivalDate,
            fullDepartureDate,
            difference,
            hour_difference,
            min_difference;

        var arrivalTimeFix, departureTimeFix;

        if ( ! arrivalTime || ! departureTime ) {
            arrivalTimeFix = '00:00';
            departureTimeFix = '04:00';
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

        difference = Math.abs( fullDepartureDate - fullArrivalDate );
        hour_difference = Math.floor(difference / 36e5);
        min_difference = Math.floor((difference % 36e5) / 6e4);

        // fraction = Math.ceil( ((difference < 1.0) ? difference : (difference % Math.floor(difference))) * 10 );
        // difference = Math.floor(difference);

        return {
            hh: hour_difference,
            mm: min_difference,
            hhs: hour_difference + 'h'
        };
    },

    __onListSelect: function(index) {

        var item = this.props.unassignedRoomList.data[index];

        this.setState({
            selectedIndex: index.toString(),
            dragInProgress: false
        });
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
            is_hourly: item.is_hourly,

            stay_span: this.__getTimeDiff(item.arrival_date, item.arrival_time, item.departure_date, item.departure_time)
        });
    },

    getInitialState: function() {
        return {
            selectedIndex: null,
            dragInProgress: null
        };
    },

    componentDidUpdate: function() {
        var iscroll = this.props.iscroll;

        this.props.iscroll.unassignedList.enable();
        iscroll.unassignedList.refresh();
    },

    componentDidMount: function() {
        var self = this;

        var iscroll = this.props.iscroll;

        iscroll.unassignedList = new IScroll('#unassigned-list', {
            scrollbars: 'custom',
            scrollX: false,
            scrollY: true,
            tap: true,
            mouseWheel: true,
            disablePointer: true
            // bounce: false,
            // useTransition: true
        });
        setTimeout(function () {
            iscroll.unassignedList.refresh();
        }, 0);
    },


    /**
     * Find if browser supports touch events or not. handles most cases
     * @return {Boolean} supports touch or not
     */
    _hasTouchSupport: function () {
        var hasSupport = false;

        try {
            if (navigator.maxTouchPoints !== undefined) {
                // for modern browsers
                // even if touchpoints test is supported event support is also needed
                hasSupport = navigator.maxTouchPoints > 0 && 'ontouchstart' in window;
            } else {
                // for browsers with no support of navigator.maxTouchPoints
                hasSupport = 'ontouchstart' in window;
            }
        } catch (e) {
            hasSupport = 'ontouchstart' in window;
        }

        return hasSupport;
    },

    componentWillMount: function() {
        this.isTouchEnabled = this._hasTouchSupport();
        this.clickEvent = this.isTouchEnabled ? 'onTouchEnd' : 'onClick';
    },

    componentWillUnmount: function() {
        this.props.iscroll.unassignedList.destroy();
        this.props.iscroll.unassignedList = null;
    },

    componentWillReceiveProps: function(nextProps) {
        var unassignedRoomListProp = nextProps.unassignedRoomList;

        if ( nextProps.edit.active
            || (nextProps.edit.passive && unassignedRoomListProp.selectedReservations.length)) {
            this.setState({
                selectedIndex: null,
                dragInProgress: null
            });
        }

        if ( !unassignedRoomListProp.open) {
            this.setState({
                selectedIndex: null,
                dragInProgress: null
            });
        }
    },

    render: function() {
        var self = this,
            unassignedRoomListProp = this.props.unassignedRoomList;

        // var panelClassName = 'sidebar-right',
        var panelClassName = 'diary-sidebar diary-unassigned',
            containerClassName = 'unassigned-list scrollable',
            handleClassName = 'rightMenuHandle';

        if (unassignedRoomListProp && unassignedRoomListProp.open) {
            panelClassName = panelClassName + ' visible';
            this.props.iscroll.unassignedList.enable();
        }
        if (unassignedRoomListProp && unassignedRoomListProp.isUnassignedPresent) {
            handleClassName = handleClassName + ' not-empty';
        }
        if (self.state.dragInProgress) {
            containerClassName = containerClassName + ' dragging';
        }

        var __getItemClassName = function(room, index) {
            return index.toString() === self.state.selectedIndex ?
                room.statusClass + ' selected' : room.statusClass;
        };

        var unassignedList;

        if ( unassignedRoomListProp ) {
            unassignedList = unassignedRoomListProp.data.map(function(room, i) {

                var occupancyBlock = {
                    key: i,
                    id: 'ob-' + i,
                    className: __getItemClassName(room, i)
                };

                occupancyBlock[self.clickEvent] = self.__onListSelect.bind(self, i);

                return (
                    React.DOM.div(
                        occupancyBlock,
                        React.DOM.div(
                            {
                                className: 'data'
                            },
                            React.DOM.div(
                                {
                                    className: 'name'
                                }, room.guests
                            ),
                            room.is_vip ? React.DOM.span(
                                {
                                    className: 'vip'
                                }
                            ) : '',
                            React.DOM.span(
                                {
                                    className: 'guest-room'
                                }, room.room_type_name
                            )
                        ),
                        React.DOM.div(
                            {
                                className: 'type'

                            }, room.is_hourly ? 'D' : 'N'
                        ),
                        React.DOM.div(
                            {
                                className: 'nights'
                            }, room.is_hourly ?
                                self.__getTimeDiff(room.arrival_date, room.arrival_time, room.departure_date, room.departure_time).hh + ' Hours'
                                : room.no_of_nights + ' Nights',
                            room.is_hourly ? React.DOM.span(
                                {
                                },
                                room.arrival_time
                            ) : ''
                        )
                    )
                );
            });
        }

        return (
            React.DOM.div({
                id: 'room-diary-rooms',
                className: panelClassName
            },
                React.DOM.a({
                    className: handleClassName,
                    onClick: this.__onToggle
                }),
                React.DOM.div({
                    className: 'sidebar-header'
                },
                    React.DOM.h2({
                    }, 'Unassigned Rooms'),
                    React.DOM.p({
                    }, 'Drag & Drop To Assign a Room')
                ),
                React.DOM.div({
                    id: 'unassigned-list',
                    className: containerClassName
                },
                    React.DOM.div({
                        className: 'wrapper'
                    }, unassignedList)
                )
            )
        );
    }
});
