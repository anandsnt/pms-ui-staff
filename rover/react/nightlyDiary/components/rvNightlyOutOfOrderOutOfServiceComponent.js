const { createClass, PropTypes } = React;
const { findDOMNode } = ReactDOM;
const OutOfOrderOutOfServiceComponent = createClass ({

    render() {
        return (
            <div style={this.props.ooo_oos.style} className={this.props.classForDiv}>
                {
                    this.props.ooo_oos_data.hk_service_status === "OUT_OF_SERVICE" ?
                    <span class="name" data-initials="OOS">Out Of Service</span> :
                    <span class="name" data-initials="OOO">Out Of Order</span>
                }
            </div>

        );
    }
});

