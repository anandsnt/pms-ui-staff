const ReservationComponent = ({reservation}) => (
    <div style={reservation.style} className={reservation.reservationClass}>
        {
            reservation.isReservationDayStay ? <span className="day-stay-icon"></span> :''
        }
        <span className="name">{reservation.guest_details.first_name+" "+reservation.guest_details.last_name}</span>
    </div>
);

