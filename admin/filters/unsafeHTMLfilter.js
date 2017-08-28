admin.filter('unsafe', function($sce) {
	return function(text) {
        return $sce.trustAsHtml(text);
    };
});