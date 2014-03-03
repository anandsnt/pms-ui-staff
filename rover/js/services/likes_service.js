sntRover.factory('Likes', function(){
	var likes = {};
	likes.newspaper = [
		{
			'name': 'TIMES OF INDIA',
			'value': 'TIMES OF INDIA'
		},
		{
			'name': 'BOSTON HERALD',
			'value': 'BOSTON HERALD'
		},
		{
			'name': 'CROATIAN TIMES',
			'value': 'CROATIAN TIMES'
		},
		{
			'name': 'SUEDDEUTSCHE ZEITUNG',
			'value': 'SUEDDEUTSCHE ZEITUNG'
		}						
	];

	//likes.user.room_type = {'id': 3};

	likes.room_types = [
		{
			'id': 1,
			'name': 'Executive Suite',
			'value': 'Executive Suite'
		},
		{
			'id': 2,
			'name': 'Business Suite',
			'value': 'Business Suite'
		},
		{
			'id': 3,
			'name': 'Ordinary Suite',
			'value': 'Ordinary Suite'
		}		
	];

	return likes;
});