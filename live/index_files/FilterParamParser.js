define(function() {

	function FilterParamParser() {

		this.parse = function(params) {
			var result = new Object();
			if (params == null) {
				return result;
			}

			var params = decodeURIComponent(params.replace("/\+/g", " "))
					.split("|");
			var pair, values, arr, match;

			for ( var i = 0; i < params.length; i++) {
				match = (new RegExp('(.*)\\((.*)\\)', 'g')).exec(params[i]);
				if (match != null && match[1] != null && match[1] != "") {
					values = match[2].split(",");
					arr = new Array();
					for (j in values) {
						arr.push(values[j]);
					}
					result[match[1]] = arr;
				}
			}
			return result;
		}
	}
	// end-of-class-definition
	
	return FilterParamParser;

});