angular.module('sntRover').filter('highlightWords', function() {
    return function(text, selectedWords) {
      if(selectedWords.length > 0) {

        for (var i = 0; i < selectedWords.length; i++){
          var pattern = new RegExp(selectedWords[i].trim(), "gi");
          text = text.replace(pattern, '<span class="ui-match">' + selectedWords[i] + '</span>');
        }
        return text;
      }
      else {
        return text;
      }
    };
});