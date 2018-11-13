admin.service('adZestEmailTemplateSrv', function(ADBaseWebSrvV2) {
    /*
     * Service methode for save settings
     * @param {object} data - setting data for save.
     */
    this.saveSettings = function(data) {
        var url = '/api/email_templates/save_settings';

        return ADBaseWebSrvV2.postJSON(url, data);
    };
    /*
     * Service methode for save settings
     * @param - none
     */
    this.getSettings = function() {
        var url = '/api/email_templates/list_settings.json';

        return ADBaseWebSrvV2.getJSON(url);
    };
});
