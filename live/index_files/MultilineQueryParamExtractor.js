define(
		[ 'fs/QueryStringParser' ],
		function(QueryStringParser) {

			function MultilineQueryParamExtractor() {
				this.queryStringParser = new QueryStringParser();
				var PARAM_NAME = "multiline";

				this.extractMultilineParameter = function(queryString) {
					var paramValue = this.queryStringParser.parse(queryString)[PARAM_NAME];

					if (!paramValue) {
						return null;
					} else {
						return ('true' == paramValue);
					}
				}
			}
			// end-of-class-definition

			return MultilineQueryParamExtractor;
		});