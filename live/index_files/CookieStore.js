define(['jquery', 'fs/FacetedSearchSettings' , 'jquery.cookie'],function($, FacetedSearchSettings){
	
	console.log('creating CookieStore');
	
	function CookieStore(pCode) {
		
		var QUERY_DATA = 'savedQuery';
        var IS_RESTORE_QUERY = 'restoreQuery';
	
		this.portalPath = '/careersection/' + pCode + '/';
		
		var self = this;
	
	    this.persistQueryCookie = function(queryStringToPersist){
	        $.cookie.json = true;
	        $.cookie(QUERY_DATA, {queryString : this.encodeString(queryStringToPersist)}, {path: self.portalPath });
	        $.cookie.json = false;
            $.cookie(IS_RESTORE_QUERY, "true", {path: self.portalPath})
	    }
	
	    this.encodeString = function(queryStringToEncode){
	        return encodeURIComponent(queryStringToEncode).replace(/\(/g, "%28").replace(/\)/g, "%29");
	    }
		
		this.readQueryCookie = function(){
			$.cookie.json = true;
			var queryData = $.cookie(QUERY_DATA);
            var queryString = '';
			if (queryData) {
				queryString = queryData.queryString;
			}
			return queryString;
		}

        this.isRestoreQuery = function () {
            $.cookie.json = false;
            var e = $.cookie(IS_RESTORE_QUERY);
            return e == "true"
        }

	}
	//end-of-class-definition
	
	return new CookieStore(FacetedSearchSettings.urlCode);
	
});
