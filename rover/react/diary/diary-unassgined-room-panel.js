var UnassignedRoomPanel = React.createClass({
    __onToggle: function() {
        this.props.unassignedRoomList.fetchList();

        this.props.iscroll.unassignedList.enable();
        this.setState({
            selectedIndex: null
        });
    },

    __onListSelect: function(index) {
        this.props.iscroll.unassignedList.disable();
        this.setState({
            selectedIndex: index
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
            room_type_id: item.room_type_id
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

    render: function() {
        var self = this;

        var __getHours = function(arrival, departure) {
            var arrival_hour,
                arrival_min,
                departure_hour,
                departure_min,
                hour_diff,
                min_diff;

            if ( ! arrival || ! departure ) {
                return 'N/A';
            }

            arrival_hour = parseInt( arrival.split(':')[0] );
            arrival_min = parseInt( arrival.split(':')[1] );
            departure_hour = parseInt( departure.split(':')[0] );
            departure_min = parseInt( departure.split(':')[1] );

            hour_diff = departure_hour - arrival_hour;
            min_diff = departure_min - arrival_min;

            if ( hour_diff > 0 ) {
                return hour_diff + 'h';
            } else {
                return min_diff + 'm';
            }
        };

        var panelClassName = 'sidebar-right';
        if ( this.props.unassignedRoomList ) {
           panelClassName = this.props.unassignedRoomList.open ? 'sidebar-right open' : 'sidebar-right';
        }

        var __getItemClassName = function(index) {
            return index === self.state.selectedIndex ? 'occupancy-status editing occupied check-in' : 'occupancy-status occupied check-in';
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
                            }, room.primary_guest),
                            React.DOM.span({
                                className: 'room-type'
                            }, room.room_type_name),
                            React.DOM.span({
                                    className: 'occupancy-time'
                                },
                                React.DOM.span({
                                    className: 'duration'
                                }, __getHours(room.arrival_time, room.departure_time)),
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
