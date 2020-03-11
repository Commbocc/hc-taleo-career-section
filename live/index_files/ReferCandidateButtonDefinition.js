define([ 'jquery', 'fs/URLBuilder' ], function($, URLBuilder) {

	function ReferCandidateButtonDefinition(text, className) {

		this.text = text;
		this.className = className;

		this.getHref = function(job) {
			return URLBuilder
					.getReferCandidateButtonURL(job.jobId);
		};

		this.createButton = function(isUserLoggedIn, job) {

			var button = $('<a>').addClass(this.className).attr('href',
					this.getHref(job)).attr('title', this.text);
			button.text(this.text);
			return button;

		};
	}
	// end-of-class-definition
	
	return ReferCandidateButtonDefinition;

});