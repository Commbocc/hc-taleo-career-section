define(function() {

	function QueryStringParser() {

		this.parse = function(url) {
			var result = new Object();
			var regexp = new RegExp('[?|&]?(.*)', 'g');
			var match = regexp.exec(url);

			if (match == null)
				return result;

			var paramString = decodeURIComponent(match[1].replace("/\+/g", " "));
			var params = paramString.split(/&amp;|&/);

			var pair;

			for ( var i = 0; i < params.length; ++i) {
				pair = params[i].split("=");
				if (pair[0] != null && pair[0] != "") {
					result[pair[0]] = pair[1];
				}
			}
			return result;
		}

	}

	return QueryStringParser;
});
