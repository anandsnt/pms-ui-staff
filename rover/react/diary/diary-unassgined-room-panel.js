var UnassignedRoomPanel = React.createClass({
    __onToggle: function() {
        this.setState({
            open: ! this.state.open,
            panelClassName: 'sidebar-right ' + (this.state.open ? '' : 'open')
        });
    },
    getInitialState: function() {
        return {
            open: false,
            panelClassName: 'sidebar-right'
        };
    },
    render: function() {
    	return React.createElement(
            "div",
            { id: "room-diary-rooms", className: this.state.panelClassName, role: "complementary" },
            React.createElement("a", { className: "rightMenuHandle", onClick: this.__onToggle }),
            React.createElement(
                "div",
                { className: "sidebar-header" },
                React.createElement(
                    "h2",
                    null,
                    "Unassigned Rooms"
                ),
                React.createElement(
                    "p",
                    null,
                    "Drag & Drop To Assign or Unassign a Room"
                )
            ),
            React.createElement(
                "div",
                { className: "scrollable" },
                React.createElement(
                    "div",
                    { className: "wrapper" },
                    React.createElement(
                        "div",
                        { draggable: "true", className: "occupancy-block" },
                        React.createElement(
                            "span",
                            { className: "occupancy-status occupied check-in" },
                            React.createElement(
                                "span",
                                { className: "guest-name" },
                                "Guest"
                            ),
                            React.createElement(
                                "span",
                                { className: "room-type" },
                                "Room Type"
                            )
                        ),
                        React.createElement(
                            "span",
                            { className: "occupancy-time" },
                            "hours | exp. 2h",
                            React.createElement(
                                "span",
                                { className: "eta" },
                                "time | exp. 23:15"
                            )
                        )
                    )
                )
            )
        );
    }
});
