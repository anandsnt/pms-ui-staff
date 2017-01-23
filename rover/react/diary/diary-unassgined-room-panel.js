var UnassignedRoomPanel = React.createClass({
    __onToggle: function() {
        this.props.unassignedRoomList.fetchList();

        this.props.iscroll.unassignedList.enable();
        this.setState({
            selectedIndex: null,
            dragInProgress: null
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

    _dragStart: function(event) {
        this.props.iscroll.unassignedList.disable();
        this.setState({
            dragInProgress: true
        });
    },

    _dragEnd: function(event) {
        this.props.iscroll.unassignedList.enable();
        this.setState({
            dragInProgress: null
        });
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

            stay_span: this.__getTimeDiff(item.arrival_date, item.arrival_time, item.departure_date, item.departure_time)
        });

        // enable draggable
        $('.unassigned-list-item.ui-draggable').draggable('disable');
        $('#ob-' + index).draggable({
            start: this._dragStart,
            stop: this._dragEnd,
            containment: '.diary-grid',
            zIndex: 1100,
            revert: true,
            revertDuration: 200
        });
        $('#ob-' + index).draggable('enable');
    },

    getInitialState: function() {
        return {
            selectedIndex: null,
            dragInProgress: null
        };
    },

    componentDidUpdate: function() {
        var iscroll = this.props.iscroll;

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
        if ( nextProps.edit.active || (nextProps.edit.passive && nextProps.unassignedRoomList.selectedReservations.length) ) {
            this.setState({
                selectedIndex: null,
                dragInProgress: null
            });
        }
    },

    render: function() {
        var self = this,
            unassignedRoomListProp = this.props.unassignedRoomList;

        var panelClassName = 'sidebar-right',
            containerClassName = 'sidebar-content scrollable',
            handleClassName = "rightMenuHandle";

        if (unassignedRoomListProp && unassignedRoomListProp.open) {
            panelClassName = panelClassName + ' open';
        }
        if (unassignedRoomListProp && unassignedRoomListProp.isUnassignedPresent) {
            handleClassName = handleClassName + ' not-empty';
        }
        if (self.state.dragInProgress) {
            containerClassName = containerClassName + ' dragging';
        }

        var __getItemClassName = function(index) {
            return index.toString() === self.state.selectedIndex ? 'occupancy-status editing occupied check-in' : 'occupancy-status occupied check-in';
        };

        var unassignedList;

        if ( unassignedRoomListProp ) {
            unassignedList = unassignedRoomListProp.data.map(function(room, i) {
                var occupancyBlock = {
                    key: i,
                    id: 'ob-' + i,
                    className: 'occupancy-block unassigned-list-item'
                };

                occupancyBlock[self.clickEvent] = self.__onListSelect.bind(self, i);

                return (
                    React.DOM.div(
                        occupancyBlock,
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
