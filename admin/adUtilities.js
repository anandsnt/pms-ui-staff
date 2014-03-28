
// Function to remove unwanted key elements from hash.
var dclone = function(object, unwanted_keys){
	if(typeof unwanted_keys==="undefined") unwanted_keys =[];
	var newObject = JSON.parse(JSON.stringify(object));
	for(var i=0;i<unwanted_keys.length;i++)	delete newObject[unwanted_keys[i]];
	return newObject;
};