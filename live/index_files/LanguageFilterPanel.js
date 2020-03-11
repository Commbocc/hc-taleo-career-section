define(
		[ 'jquery', 'fs/FilterFactory' ],
		function($, FilterFactory) {

			function LanguageFilterPanel(panelHtmlId, searchHandler, fieldPanel) {

				this.paramName = 'f';

				var self = this;

				this.fFilters = new Array();
				this.filter = null;
				this.externalFilters = new Array();
				this.init = function() {
					var thisFilterPanel = this;
					thisFilterPanel.addFilter();
				}

				this.addFilter = function() {
					var tobDiv = document.getElementById("filter-JOB_LOCALE");
					var groupSelector = $('#' + tobDiv.id + ' .filter-groups');
					var name = groupSelector.children("*[name='name']").val();
					var fieldId = groupSelector.children("*[name='fieldId']")
							.val();
					var code = groupSelector.children("*[name='code']").val();
					var filterFactory = new FilterFactory(searchHandler);
					var filter = filterFactory.getLanguageFilter(name, code,
							fieldId);
					filter.render();
					this.filter = filter;
				}

				this.findFilterById = function(id) {
					return this.findFilter(function(filter) {
						return filter.id == id;
					});
				}

				this.findFilter = function(predicate) {
					var match = predicate(this.filter);
					if (match) {
						return this.filter;
					}
					return null;
				}

				this.findFilterByFieldId = function(id) {
					return this.findFilter(function(filter) {
						return filter.fieldId == id;
					});
				}

				this.refresh = function(event) {
					if (event.type == "PAGE") {
						return;
					}
					var values = event.data.facetResults;
					for ( var i = 0; i < values.length; i++) {
						var value = values[i];
						var filter = this.findFilterById(value.id);
						if (filter != null) {
							// setting object from results which represents
							// filter into filter object
							filter.setFilterModel(value);

							// setting selection from field panel into filter to
							// use by SeeAllOlf... objects
							var olfValue = fieldPanel
									.getFieldValue(filter.getFieldCode());
							filter.criteriaId = Boolean(olfValue.id) ? olfValue.id
									: null;
							filter.criteriaLabel = Boolean(olfValue.label) ? olfValue.label
									: null;

							if (event.type == "FILTER"
									&& value.id == event.activeFilterId) {
								filter
										.extendFilterValues(value.facetValueResults);
							} else {
								filter.setFilterValues(value.facetValueResults);
							}
						}
					}
					this.fill();
				}

				this.fill = function() {
					this.filter.refresh();
				}

			}
			// end-of-class-definition

			return LanguageFilterPanel;
		});