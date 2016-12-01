const { createClass, PropTypes } = React;
const { findDOMNode } = ReactDOM;
const ReservationComponent = createClass ({

    render() {
        return (
        <div style={this.props.reservation.style} className={this.props.reservation.reservationClass} onClick={(e) => this.props.selectReservation(e, this.props.reservation)}>
        <div className="reservation-data">
            {
                this.props.reservation.isReservationDayStay ? <span className="day-stay-icon"></span> : ''
            }
            {
                this.props.reservation.isReservationDayStay ?
                <span className="name" data-initials={this.props.reservation.guest_details.short_name} >{this.props.reservation.guest_details.short_name}</span> :
                <span className="name">{this.props.reservation.guest_details.full_name}</span>
            }

            {
                this.props.reservation.is_vip ? <span className="vip">VIP</span> : ''
            }
         </div>
         {
            (this.props.reservation.belongs_to_allotment || this.props.reservation.belongs_to_group || this.props.reservation.no_room_move || this.props.reservation.is_suite_reservation) ?
            <div className="reservation-icons">
                {this.props.reservation.no_room_move ?  <span className="icons icon-diary-lock"></span> : ''}
                {this.props.reservation.belongs_to_group ?  <span className="icons icon-group-large"></span> : ''}
                {this.props.reservation.belongs_to_allotment ?  <span className="icons icon-allotment-large"></span> : ''}
                {

                    this.props.reservation.is_suite_reservation ?
                        (<span className="suite-room">
                        {
                             this.props.reservation.suite_room_details.map((suiteItem) => (
                                    <span>
                                        <span className="icons icon-suite-white"></span>
                                        {suiteItem.room_no}
                                    </span>
                                    )
                                )
                        }
                        </span>)
                    : ''
                }
            </div> :
            ''
         }

    </div>
    );
    }
});

