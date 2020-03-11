define([ 'jquery' ,'jquery-ui'], function($) {

	function create() {

		$.widget("criteria.autosuggestText", $.criteria.autosuggestSimple, {
			options : {
				serviceURL : "/careersection/rest/suggestions/text"
			}
		})

	}
	// end-of-create-method

	return {
		create : create
	};
});