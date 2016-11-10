const ReservationComponent = ({reservation}) => (
    <div style={reservation.style} className={reservation.reservationClass}>
        {reservation.confirm_no}
    </div>
);

