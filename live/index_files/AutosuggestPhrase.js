define([ 'jquery','jquery-ui' ], function($) {
	
	function create() {
		$.widget("criteria.autosuggestPhrase", $.criteria.autosuggestSimple, {
			options : {
				serviceURL : "/careersection/rest/suggestions/phrase"
			}
		});
	}
	// end-of-create-method

	return {
		create : create
	};
});