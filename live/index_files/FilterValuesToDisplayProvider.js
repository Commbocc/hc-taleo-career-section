define([ 'jquery', 'fs/Utilities' ], function($, Utilities) {
	/*
	 * Gives items accordingly to designed rules and limits 1. firstly all
	 * selected items without limit 2. if selected less then limit then gives
	 * all selected plus values with highest quantity but not more than limit
	 */
	function FilterValuesToDisplayProvider() {

		this.getValues = function(values, selected, limitValue) {
			var items = new Array();

			var limit = selected.length > limitValue ? selected.length
					: limitValue;

			var selectedIdx = 0;
			var valuesIdx = 0;

			while (limit > 0 && values.length > valuesIdx
					&& values.length > selectedIdx) {
				var nextValue = null;

				while (nextValue == null && limit > 0
						&& selected.length > selectedIdx) {
					var selectedId = selected[selectedIdx];
					nextValue = getValueById(values, selectedId);
					selectedIdx++;
				}

				while (nextValue == null && limit > 0
						&& values.length > valuesIdx) {
					nextValue = values[valuesIdx];
					if ($.inArray(nextValue.id, selected) > -1) {
						nextValue = null;
					}
					valuesIdx++;
				}

				if (nextValue != null) {
					items.push(nextValue);
					limit--;
				}
			}
			return items;
		}

		function getValueById(values, id) {
			return Utilities.getInstance()
					.findFirstWhereValueEqualToExtractedValue(values, id,
							function(value) {
								return value.id
							});
		}
	}
	// end-of-class-definition

	return FilterValuesToDisplayProvider;

});