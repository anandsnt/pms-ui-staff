sntRover
.factory('rvDiaryMetadata', function() {
	return {
		room: {
			id: 'id',
			number: 'room_no',
			type: 'room_type',
			type_id: 'room_type_id',
			row_children: 'occupancy',
			status: 'room_status'
		},
		occupancy: {
			id: 'reservation_id',
			room_id: 'room_id',
			room_type: 'room_type',
			status: 'reservatopm_status',
			guest: 'reservation_primary_guest_full_name',
			start_date: 'arrival',
			end_date: 'departure',
			maintenance: 'maintenance',
			rate: 'amount'
		},
		availability: {
			room_id: 'id',
			price: 'amount',
			rate_type_id: 'rate_type_id'
		}
	}
});