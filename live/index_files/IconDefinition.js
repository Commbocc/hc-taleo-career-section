define([ 'jquery' ], function($) {

	function IconDefinition(className, title, isIconDisplayed) {
		this.className = className;
		this.title = title;
		this.isIconDisplayed = isIconDisplayed;

		this.createIcon = function() {
			return $('<i>').addClass('icon icon-' + this.className).attr(
					'title', this.title);
		}
	}
	// end-of-class-definition

	return IconDefinition;
});