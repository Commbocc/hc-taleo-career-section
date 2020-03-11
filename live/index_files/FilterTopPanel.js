define([ 'jquery', 'fs/ResourcesHandler'],
		function($, ResourcesHandler) {

			function FilterTopPanel(htmlId, searchHandler) {

				var filterLists = new Array();

				var activeFilters = new Object();

				this.htmlId = htmlId;

				var self = this;

				this.clear = function() {
					$('#' + this.htmlId).find('#filterList').children()
							.remove();
					activeFilters = new Object();
				}

				this.registerFilterList = function(filterList) {
					filterLists.push(filterList);
				}

				this.update = function(selectedFilters) {
					this.clear();
					if (selectedFilters.length == 0) {
						$('#' + htmlId).hide();
					} else {
						$('#' + htmlId).show();
					}

					for ( var i = 0; i < selectedFilters.length; ++i) {
						this.addFilter(selectedFilters[i]);
					}
				}

				this.addFilter = function(selectedFilter) {
					var filterList = $('#' + this.htmlId).find('#filterList');

					var filterElement = $('<li>', {
						text : selectedFilter.name
					});
					filterList.append(filterElement);

					var filterValueId = selectedFilter.id + "-"
							+ selectedFilter.valueId;

					var removeFilterButton = $('<input>').attr({
						type : 'button',
						id : filterValueId,
						name : selectedFilter.valueId
					}).click(function() {
						removeFilter(filterValueId);
						self.callSearch(selectedFilter.id);
					}).attr(
							"aria-label",
							ResourcesHandler
									.getResource(
											'filterTopPanel.removeCriterion',
											selectedFilter.name));
					filterElement.append(removeFilterButton);
					activeFilters[filterValueId] = selectedFilter;
				}

				this.removeFilter = function(filterId, valueId) {
					removeFilter(filterId + "-" + valueId);
				}

				function removeFilter(filterValueId) {
					var filter = activeFilters[filterValueId];
					delete activeFilters[filterValueId];
					broadcastFilterRemoved(filter);
				}

				function broadcastFilterRemoved(filter) {
					for ( var i = 0; i < filterLists.length; i++) {
						filterLists[i].filterRemoved(filter.fieldId,
								filter.valueId);
					}

				}

				this.callSearch = function(removedFilterId) {
					 searchHandler.refresh({
						type : "FILTER",
						activeFilterId : removedFilterId
					});
				}

				this.init = function() {
					$('#' + htmlId).find('#clearButton').click(function() {
						for (id in activeFilters) {
							removeFilter(id);
						}
						self.callSearch('ALL');
					});
				}
			}
			// end-of-class-definition

			return FilterTopPanel;

		});
