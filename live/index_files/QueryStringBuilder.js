define([ 'fs/FacetedSearchSettings','fs/CookieStore' ], function(FacetedSearchSettings, CookieStore) {

	function build() {

		console.log('creating QUERY_STRING');
		
		var queryString = FacetedSearchSettings.queryString;

        if (queryString.indexOf("ignoreSavedQuery") == -1 && CookieStore.isRestoreQuery())
        {
            queryString = CookieStore.readQueryCookie();
        }

        return queryString;
	}
	// end-of-method-definition

	return {
		build : build
	};

});