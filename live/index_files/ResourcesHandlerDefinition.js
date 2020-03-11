define([], function() {

	function ResourcesHandler(resourcesMap) {
		this.resourcesMap = resourcesMap;

		this.getResource = function(resourceName) {
			var resource = resourcesMap[resourceName];
			for ( var index = 1; index < arguments.length; index++) {
				var regularExpression = '\\{' + (index - 1) + '\\}';
				var regExp = new RegExp(regularExpression, 'g');
				resource = resource.replace(regExp, arguments[index]);
			}
			return resource;
		}
	}
	// end-of-class-definition

	return ResourcesHandler;
});