define([ 'fs/FacetedSearchSettings' ], function(FacetedSearchSettings) {

	console.log('creating VersionHolder');

	function VersionHolder(pBuildVersion) {
		this.buildVersion = pBuildVersion;

		if (this.buildVersion == null || this.buildVersion == 'null') {
			throw "UninitializedBuildVersionException";
		}

		this.getBuildVersion = function() {
			return this.buildVersion;
		}

		this.getResourceUri = function(resource) {
			return "/careersection/" + this.buildVersion + resource;

		}
	}
	// end-of-class-definition

	return new VersionHolder(FacetedSearchSettings.versionNumber);
});
