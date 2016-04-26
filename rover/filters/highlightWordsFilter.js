angular.module('sntRover').filter('highlightWords', function() {
	return function(text, selectedWords) {
		return transformTextToHighlight(text, selectedWords);
	};
});

/**
	* Function to highlight the search words in the given text
*/
function transformTextToHighlight(replacableString, replaceableStrings) {
	var spanAddedIndex = [];
	replaceableStrings.forEach(function(element, index, array) {
		var subString = "";
		var subStringArray = [];
		var indexToMatch = 0;
		var strSize = element.length;
		var charToMatch = element.charAt(0);
		var substringPos = [];
		replacableString.split("").forEach(function(char, idx) {
			var isAlreadyAdded = false;
			if (spanAddedIndex.length > 0) {
				spanAddedIndex.forEach(function(idxsAdded) {
					idxsAdded.forEach(function(idxAdded) {
						var startIdx = idxAdded[0];
						var endIdx = idxAdded[1];
						if (idx >= startIdx && idx <= endIdx) {
							isAlreadyAdded = true;
						}
					});

				});
			}
			if (isAlreadyAdded)
				return;
			if (charToMatch.toLowerCase() == char.toLowerCase()) {
				subString += char;
				charToMatch = element.charAt(indexToMatch + 1);
				indexToMatch += 1;
				if (indexToMatch > 0 && (strSize == indexToMatch)) {
					substringPos.push(idx - strSize);
					subStringArray.push(subString);
				}
			} else {
				subString = "";
				charToMatch = element.charAt(0);
				indexToMatch = 0;
			}
		});
		var splitedString = [];
		lastIdx = 0;
		spanAddedIndex[index] = [];
		substringPos.forEach(function(idx, position) {
			splitedString.push(replacableString.substring(lastIdx, idx + 1));
			var formatedString = "<span class='ui-match'>" + subStringArray[position] + "</span>";
			splitedString.push(formatedString);
			if (index > 0) {
				spanAddedIndex.forEach(function(spanIndex) {
					spanIndex.forEach(function(spanIdx) {
						if (idx + 1 < spanIdx[0]) {
							spanIdx[0] = spanIdx[0] + (formatedString.length - strSize);
							spanIdx[1] = spanIdx[1] + (formatedString.length - strSize);
						}
					});
				});
			}
			spanAddedIndex[index].push([idx + 1, idx + lastIdx + formatedString.length]);
			lastIdx = idx + strSize + 1;
		});
		splitedString.push(replacableString.substring(lastIdx, replacableString.length));
		replacableString = splitedString.join("");
	});

	return replacableString;

}