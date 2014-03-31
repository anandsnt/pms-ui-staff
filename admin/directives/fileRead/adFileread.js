// admin.directive("adFileread", function ($timeout) {
    // return {
    	// restrict: 'AE',
        // replace: 'true',
        // scope: {
            // value: "=",
            // label: '@label',
	        // name : '@name'
        // },
        // link: function (scope, element, attributes) {
            // element.bind("change", function (changeEvent) {
                // scope.$apply(function () {
                    // scope.value = changeEvent.target.files[0];
                    // console.log(changeEvent.target.files[0]);
                    // // or all selected files:
                    // // scope.fileread = changeEvent.target.files;
                // });
            // });
        // },
        // templateUrl: '../../assets/directives/fileRead/adFileread.html'
    // };
// });
admin.directive('appFilereader', function(
    $q
){
    var slice = Array.prototype.slice;

    return {
        restrict: 'A'
        , require: '?ngModel'
        , link: function(scope, element, attrs, ngModel){
            if(!ngModel) return;

            ngModel.$render = function(){};

            element.bind('change', function(e){
                var element = e.target;

                $q.all(slice.call(element.files, 0).map(readFile))
                .then(function(values){
                    if(element.multiple) ngModel.$setViewValue(values);
                    else ngModel.$setViewValue(values.length ? values[0] : null);
                });

                function readFile(file) {
                	console.log("upto here");
                    var deferred = $q.defer();

                    var reader = new FileReader();
                    reader.onload = function(e){
                        deferred.resolve(e.target.result);
                    };
                    reader.onerror = function(e) {
                        deferred.reject(e);
                    };
                    reader.readAsDataURL(file);

                    return deferred.promise;
                }

            });//change

        }//link

    };//return

})//appFilereader
;