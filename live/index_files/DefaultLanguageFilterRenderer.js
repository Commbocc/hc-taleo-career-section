define([ 'jquery' ], function($) {

	function DefaultLanguageFilterRenderer(filter) {
		var self = this;
		this.filter = filter;

		this.groupID = "filter-" + this.filter.id + ".filter-language-panel";
		this.contentID = this.filter.id + "-content"

		this.contentRenderer = null;

		this.setContentRenderer = function(contentRenderer) {
			this.contentRenderer = contentRenderer;
			this.contentRenderer.init(this.filter, this.contentID);
		}

		this.render = function() {
			var container = $('#' + this.groupID);
			renderContentContainer(container);
			this.refresh();
		}

		this.refresh = function() {
			clearContent();
			if (this.filter.values.length > 0) {
				renderContent();
			}
		}

		function renderContent() {
			if (self.contentRenderer && self.contentRenderer.render) {
				self.contentRenderer.render();
			}
		}

		function clearContent() {
			if (self.contentRenderer && self.contentRenderer.clear) {
				self.contentRenderer.clear();
			}
		}

		function renderContentContainer(container) {
			var content = document.createElement("div");

			content.id = self.contentID;
			content.className = "language-filter-group-content";

			container.append(content);
		}
	}
	// end-of-class-definition

	return DefaultLanguageFilterRenderer;

});