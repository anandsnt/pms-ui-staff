admin.service('ADTranslationSrv',['$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2){
   /**
    * Get the list of available guest languages
    * @return {array} of guest languages
    */
    this.getGuestLanguages = function(){
        var deferred = $q.defer();
        var url = '/admin/locales';
        ADBaseWebSrvV2.getJSON(url).then(function(data) {
            deferred.resolve(data);
        },function(data){
            deferred.reject(data);
        });
        return deferred.promise;
    };

    /**
    * Get menu options and items under it for the translation of labels
    * @return {array} of menu options
    */
    this.getMenuOptionDetails = function(){
        var deferred = $q.defer();
        var url = '/admin/translations/menu_details';
        ADBaseWebSrvV2.getJSON(url).then(function(data) {
            deferred.resolve(data);
        },function(data){
            deferred.reject(data);
        });
        return deferred.promise;
    };
   /*
    * Get the translation of labels for a given locale and given item
    * @param {object} menu item id,item id and locale
    * @return {array} of label translations
    */

    this.getLabelTranslationForLocale = function(request){
        var deferred = $q.defer();
        var url = ' /admin/translations';
        ADBaseWebSrvV2.getJSON(url, request).then(function(data) {
            deferred.resolve(data);
        },function(data){
            deferred.reject(data);
        });
        return deferred.promise;
    };

   /*
    * Save label translation for a given locale
    * @param {object} label translation of the selected locale
    * @return {object} status of saving new translation
    */
    this.saveLabelTranslationForLocale = function(request){
        var deferred = $q.defer();
        var url = '/admin/translations';
        ADBaseWebSrvV2.postJSON(url, request).then(function(data) {
            deferred.resolve(data);
        },function(data){
            deferred.reject(data);
        });
        return deferred.promise;
    };

}]);