const ReservationComponent = ({reservation, onClickMethod}) => (
    <div style={reservation.style} className={reservation.reservationClass} onClick={(e) => onClickMethod(e, reservation)}>
        <div className="reservation-data">
            {
                reservation.isReservationDayStay ? <span className="day-stay-icon"></span> : ''
            }
            {
                reservation.isReservationDayStay ?
                <span className="name" data-initials={reservation.guest_details.first_name + "." + reservation.guest_details.last_name} > {reservation.guest_details.first_name + " " + reservation.guest_details.last_name}</span> :
                <span className="name">{reservation.guest_details.first_name + " " + reservation.guest_details.last_name}</span>
            }

            {
                reservation.is_vip ? <span className="vip">VIP</span> : ''
            }
         </div>
         {
            (reservation.belongs_to_allotment || reservation.belongs_to_group || reservation.no_room_move || reservation.is_suite_reservation) ?
            <div className="reservation-icons">
                {reservation.no_room_move ?  <span className="icons icon-diary-lock"></span> : ''}
                {reservation.belongs_to_group ?  <span className="icons icon-group-large"></span> : ''}
                {reservation.belongs_to_allotment ?  <span className="icons icon-allotment-large"></span> : ''}
                {

                    reservation.is_suite_reservation ?
                        (<span className="suite-room">
                        {
                             reservation.suite_room_details.map((suiteItem) => (
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

