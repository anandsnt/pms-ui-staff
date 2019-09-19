const {connect} = ReactRedux;

let convertRoomsListReadyToComponent = (roomsList, selectedRoomId, state) => {
    roomsList.map((room, index) => {

        var reservations =[],
            overlappedReservationsCount = 0;
        room.room_class = (room.service_status === 'IN_SERVICE') ? "room-number " + room.hk_status : "room-number out";
        room.main_room_class = (room.id === selectedRoomId) ? 'room not-clickable highlighted' : 'room not-clickable';
        switch (room.hk_status) {
            case 'CLEAN':
                room.main_room_class += ' clean';
                break;
            case 'DIRTY' :
                room.main_room_class += ' dirty';
                break;
            case 'INSPECTED' :
                room.main_room_class += ' inspected';
                break;
            case 'PICKUP' :
                room.main_room_class += ' pickup';
                break;
            default:
        }
        // For Inspected Only Hotel, Adding class for clean not-inspected case
        room.main_room_class += ( room.hk_status === 'CLEAN' && !room.is_inspected ) ? ' not-inspected' : '';
        // Add class when room is OOO/OOS
        if ( room.service_status === 'OUT_OF_ORDER' || room.service_status === 'OUT_OF_SERVICE') {
            room.main_room_class = 'room unavailable';
        }

        state.reservationsList[index].reservations.map((reservation, iterator) => {
            reservations.push(state.reservationsList[index].reservations[iterator]);
        })
        // if(reservations.length !== 0) {
        //     reservations.push(reservations[reservations.length - 1]); 
        // }
        overlappedReservationsCount = reservations.length - 1;

        if (overlappedReservationsCount >= 0) {
            room.main_room_class += ' overlap-' + overlappedReservationsCount;
        }
        room.isSuitesAvailable = (room.suite_room_details.length > 0) ? true : false;
    })
    return roomsList;
}


const mapStateToNightlyDiaryRoomsListContainerProps = (state) => ({
    roomListToComponent: convertRoomsListReadyToComponent(state.roomsList, state.selectedRoomId, state),
    selectedRoomId: state.selectedRoomId
});

const NightlyDiaryRoomsListContainer = connect(
  mapStateToNightlyDiaryRoomsListContainerProps
)(NightlyDiaryRoomsListComponent);
