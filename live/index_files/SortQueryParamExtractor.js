define(
		[ 'fs/QueryStringParser' ],
		function(QueryStringParser) {

			function SortQueryParamExtractor() {
				this.queryStringParser = new QueryStringParser();
				PARAM_NAME = "s";

				this.extractSortParameter = function(queryString) {
					var paramValue = this.queryStringParser.parse(queryString)[PARAM_NAME];
					if (!paramValue) {
						return null;
					}
					var paramParts = decodeURIComponent(
							paramValue.replace("/\+/g", " ")).split("|");
					return {
						field : paramParts[0],
						ascending : (paramParts[1] == 'A')
					}

				}
			}
			// end-of-class-definition

			return SortQueryParamExtractor;

		});