const { createClass, PropTypes } = React;
const { findDOMNode } = ReactDOM;

const NightlyDiaryUnAssignedComponent = createClass({
    getStyles() {
        const width = this.props.uar_data.style.width;
        const position = this.props.uar_data.style.transform;
        const style = {
            width: width,
            transform: position,
            display: 'block'
        };

        return style;
    },
    render() {
        return (
            <div style={this.getStyles()}
                className="reservation unassigned"
                onClick={() => alert('clicked')}
            >
                <div className="reservation-data">
                    ASSIGN
                <span className="name">{this.props.roomDetails.room_number}</span>
                </div>
            </div>
        );
    }
});

