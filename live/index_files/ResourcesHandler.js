define([ 'fs/ResourcesHandlerDefinition', 'fs/FacetedSearchSettings' ],
		function(ResourcesHandler, FacetedSearchSettings) {

			console.log('creating ResourcesHandler');

			return new ResourcesHandler(
					FacetedSearchSettings.resourcesMapAsJSON);
		});