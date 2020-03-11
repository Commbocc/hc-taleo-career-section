define([ 'jquery', 'fs/FilterValuesToDisplayProvider', 'fs/SortRule',
		'fs/Utilities' ], function($, FilterValuesToDisplayProvider, SortRule,
		Utilities) {
	/*
	 * Creates sorted list of facets base on search results, selected values and
	 * limit of elements
	 */
	function ListSortedByQuantityBuilder() {
		this.valuesToDisplayProvider = new FilterValuesToDisplayProvider();

		var byQantityComparator = function(a, b) {
			if (parseInt(a.quantity) > parseInt(b.quantity)) {
				return -1;
			} else if (parseInt(a.quantity) < parseInt(b.quantity)) {
				return 1;
			}
			return 0;
		};
		var byIdComparator = function(a, b) {
			if (parseInt(a.id) < parseInt(b.id)) {
				return -1;
			} else if (parseInt(a.id) > parseInt(b.id)) {
				return 1;
			}
			return 0;
		};
		var quantityAndIdRule = new SortRule(byQantityComparator, new SortRule(
				byIdComparator));

		this.buildStructure = function(values, selected, elementsLimit) {
			var items = new Array();

			var valuesToDisplay = this.valuesToDisplayProvider.getValues(
					values, selected, elementsLimit);

			$.each(valuesToDisplay, function(index, value) {
				if (value != null) {
					items.push({
						id : value.id,
						label : value.text,
						quantity : value.quantity,
						selected : $.inArray(value.id, selected) > -1
					});
				}
			});
			items = sortByQuantityAndId(items);

			return items;
		}

		function sortByQuantityAndId(values) {
			return Utilities.getInstance()
					.sortByRule(values, quantityAndIdRule);
		}
	}
	// end-of-class-definition

	return ListSortedByQuantityBuilder;

});