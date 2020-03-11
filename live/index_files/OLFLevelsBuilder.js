define([ 'jquery', 'fs/FilterValuesToDisplayProvider', 'fs/SortRule',
		'fs/Utilities' ], function($, FilterValuesToDisplayProvider, SortRule,
		Utilities) {

	/*
	 * Creates levels structure base on search results, selected values and
	 * limit of elements
	 */
	function OLFLevelsBuilder() {
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

		this.buildStructure = function(values, selected, elementsLimit,
				levelsLabels) {
			var levels = new Array();

			var valuesToDisplay = this.valuesToDisplayProvider.getValues(
					values, selected, elementsLimit);

			$.each(valuesToDisplay, function(index, value) {
				if (value != null) {
					// get level from value or 1 as a default
					var levelIndex = value.level ? value.level : 1;

					var levelLabel = getLabelByIndex(levelsLabels, levelIndex);
					var level = getLevelByIndex(levels, levelIndex);
					if (level == null) {
						level = {
							index : levelIndex,
							label : levelLabel ? levelLabel.name
									: ('Level ' + levelIndex),
							items : new Array()
						};
						levels.push(level);
					}

					level.items.push({
						id : value.id,
						label : value.text,
						quantity : value.quantity,
						selected : $.inArray(value.id, selected) > -1
					});
				}
			});

			levels = sortByLevels(levels);
			$.each(levels, function(index, level) {
				level.items = sortByQuantityAndId(level.items);
			});

			return levels;
		}

		function getLevelByIndex(levels, levelIndex) {
			return Utilities.getInstance()
					.findFirstWhereValueEqualToExtractedValue(levels,
							levelIndex, function(level) {
								return level.index
							});
		}

		function getLabelByIndex(labels, levelIndex) {
			return Utilities.getInstance()
					.findFirstWhereValueEqualToExtractedValue(labels,
							levelIndex, function(label) {
								return label.level
							});
		}

		function sortByLevels(levels) {
			return Utilities.getInstance().sortAsc(levels, function(level) {
				return level.index
			});
		}

		function sortByQuantityAndId(values) {
			return Utilities.getInstance()
					.sortByRule(values, quantityAndIdRule);
		}

	}
	// end-of-class-definition

	return OLFLevelsBuilder;

});