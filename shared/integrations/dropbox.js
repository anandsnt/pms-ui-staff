DROPBOX = function( $scope ) {
    var CLIENT_ID = '9mvxgqh77yktz92';
    console.log('adsa');

    var dbx = new Dropbox.Dropbox({ clientId: CLIENT_ID });
    var authUrl = dbx.getAuthenticationUrl(window.location.origin);

    window.location = authUrl;

}
