function getDiff(obj1, obj2) {
	var diff = false;

	for (var key in obj1) {
		if(obj1.hasOwnProperty(key) && typeof obj1[key] !== "function") {
			var obj1Val	= obj1[key],
				obj2Val	= obj2[key];


			// if property removed then explicitly set to null
			if (!(key in obj2)) {
				if(!diff) { diff = {}; }
				diff[key] = {
					from: obj1Val,
					to: null
				};
			}
			// if the property exists in both and is an object
			// then we recurse to check each property of that object
			else if(typeof obj1Val === "object") {
				var tempDiff = this.getDiff(obj1Val, obj2Val);
				if(tempDiff) {
					if(!diff) { diff = {}; }
					diff[key] = tempDiff;
				}
			}
			// if property exists in both objects but different
			else if (obj1Val !== obj2Val) {
				if(!diff) { diff = {}; }
				diff[key] = {
					from: obj1Val,
					to: obj2Val
				};
			}
		}
	}

	// For each property in obj2, check to see if any
	// new values have been added.
	for (key in obj2) {
		if(obj2.hasOwnProperty(key) && typeof obj2[key] !== "function") {
			var obj1Val	= obj1[key],
				obj2Val	= obj2[key];
			if (!(key in obj1)) {
				if(!diff) { diff = {}; }
				diff[key] = {
					from: null,
					to: obj2Val
				};
			}
		}
	}

	return diff;
};