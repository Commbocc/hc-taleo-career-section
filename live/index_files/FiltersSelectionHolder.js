define(
		[ 'jquery' ],
		function($) {

			function FiltersSelectionHolder() {
				var self = this;

				this.filter = null;

				var originalSelection = null;
				var currentSelection = null;

				var selectionLimit = null;
				var selectionLimitEvent = null;

				this.init = function(filter, addFilterEvent, removeFilterEvent,
						selLimit, selLimitEvent) {
					this.filter = filter;
					originalSelection = new Array();
					currentSelection = new Array();

					selectionLimit = selLimit;
					selectionLimitEvent = selLimitEvent;

					this.on(addFilterEvent, removeFilterEvent);

					var select = this.filter.select;
					for ( var j = 0; j < select.length; j++) {
						var selection = {
							itemId : select[j],
							itemLabel : this.filter
									.findFilterTextById(select[j])
						};

						originalSelection.push(selection);
						$(document).trigger(addFilterEvent, selection);
					}
				}

				this.getOriginalSelection = function() {
					return originalSelection;
				}

				this.getCurrentSelection = function() {
					return currentSelection;
				}

				this.on = function(addFilterEvent, removeFilterEvent) {
					$(document).on(addFilterEvent,
							function(event, selection) {
								addFilter(selection);
							});
					$(document).on(removeFilterEvent,
							function(event, selection) {
								removeFilter(selection);
							});
				}

				this.off = function(addFilterEvent, removeFilterEvent) {
					$(document).off(addFilterEvent);
					$(document).off(removeFilterEvent);
				}

				this.isSelectionChanged = function() {
					return !($(originalSelection).not(currentSelection).length == 0 && $(
							currentSelection).not(originalSelection).length == 0);
				}

				function addFilter(selection) {
					if (currentSelection.length + 1 <= selectionLimit) {
						currentSelection.push(selection);
					} else {
						$(document).trigger(selectionLimitEvent, selection);
					}
				}

				function removeFilter(selection) {
					for ( var i = 0; i < currentSelection.length; i++) {
						if (selection.itemId == currentSelection[i].itemId) {
							currentSelection.splice(i, 1);
							break;
						}
					}
				}

			}
			// end-of-class-definition

			return FiltersSelectionHolder;
		});