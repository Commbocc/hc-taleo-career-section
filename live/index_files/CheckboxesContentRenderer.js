define([ 'jquery', 'fs/ListSortedByQuantityBuilder', 'fs/CheckboxItemRenderer',
		'fs/ShowMoreLessLinkFactory' ], function($,
		ListSortedByQuantityBuilder, CheckboxItemRenderer,
		ShowMoreLessLinkFactory) {

	/*
	 * Renders facets as a list of checkboxes
	 */
	function CheckboxesContentRenderer() {
		var self = this;

		this.DEFAULT_NR_OF_ELEMENT = 5;
		this.MAX_NR_OF_ELEMENT = 10;

		this.elementsLimit = this.DEFAULT_NR_OF_ELEMENT;

		this.structureBuilder = new ListSortedByQuantityBuilder();

		this.itemRenderer = new CheckboxItemRenderer();
		this.showLinkFactory = new ShowMoreLessLinkFactory();

		this.filter = null;
		this.containerId = null;
		this.showMoreID = null;

		this.init = function(filter, containerId) {
			this.filter = filter;
			this.containerId = containerId;
			this.showMoreID = this.filter.id + '-moreless';
		}

		this.render = function() {
			var container = $('#' + this.containerId);
			container.children().remove();

			var values = this.filter.values;
			var selected = this.filter.select;

			var items = this.structureBuilder.buildStructure(values, selected,
					this.elementsLimit);

			renderItems(container, items);
			renderShowMoreLessLink(container);
		}

		this.clear = function() {
			$('#' + this.containerId).children().remove();
		}

		function renderItems(container, items) {
			$.each(items, function(index, item) {
				var itemId = self.filter.id + "-item-" + index;

				self.itemRenderer.render(self.filter, container, itemId, item);
			})
		}

		function renderShowMoreLessLink(container) {
			// check whether the link should be displayed
			if ((self.filter.values.length != self.filter.select.length)
					&& (self.DEFAULT_NR_OF_ELEMENT < self.filter.values.length)
					&& (self.MAX_NR_OF_ELEMENT > self.filter.select.length)) {

				var link = self.showLinkFactory.getShowMoreLessLink(self,
						container);
				container.append(link);
			}
		}
	}
	// end-of-class-definition

	return CheckboxesContentRenderer;

});