reports.directive('repdropdown', function($timeout) {

    return {
    	restrict: 'AE',
        replace: 'true',
      	scope: {
            list:'=list',
            labelInDropDown: '@labelInDropDown',
            name:'@name',
            multiple:'@multiple'
	    },
    	template: [
            '<select name="{{ name }}" multiple="{{ multiple }}">',
                '<option value="">',
                    '{{ labelInDropDown }}',
                '</option>',
                '<option ng-repeat="item in list" value="{{ item.id }}">',
                    '{{ item.full_name }}',
                '<option>',
            '<select>'
        ].join('')
    };

});