define(
		[ 'jquery', 'fs/FilterParamParser', 'fs/QueryStringParser',
				'fs/FilterFactory' ],
		function($, FilterParamParser, QueryStringParser, FilterFactory) {

			function FilterPanel(panelHtmlId, searchHanlder, fieldPanel,
					filterTopPanel) {

				this.fFilters = new Array();
				this.externalFilters = new Array();
				this.filterParamParser = new FilterParamParser();
				this.queryStringParser = new QueryStringParser();
			
				this.paramName = 'f';

				var self = this;

				this.init = function() {
					var thisFilterPanel = this;
					$("#" + panelHtmlId + " .filter-group").each(function(idx) {
						thisFilterPanel.addFilter(this);
					});
				}

				this.addFilter = function(group) {

					if (group == null) {
						return;
					}

					var groupSelector = $('#' + group.id
							+ ' .filter-group-config');

					var name = groupSelector.children("*[name='name']").val();
					var asSelect = groupSelector.children("*[name='asSelect']")
							.val();
					var isOlf = groupSelector.children("*[name='isOlf']").val();
					var expanded = groupSelector.children("*[name='expanded']")
							.val();
					var code = groupSelector.children("*[name='code']").val();
					var fieldId = groupSelector.children("*[name='fieldId']")
							.val();
					var filterFactory = new FilterFactory(searchHanlder);
					var filter = filterFactory.getFilter(asSelect, code, name,
							isOlf == "true", expanded, fieldId);
					this.fFilters.push(filter);

					filter.render();
				}

				this.findFilter = function(predicate) {
					for ( var i = 0; i < this.fFilters.length; i++) {
						var match = predicate(this.fFilters[i]);
						if (match) {
							return this.fFilters[i];
						}
					}

					return null;
				}

				this.findFilterById = function(id) {
					return this.findFilter(function(filter) {
						return filter.id == id;
					});
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

							var olfValue = fieldPanel.getFieldValue(filter
									.getFieldCode());
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
					for ( var i = 0; i < this.fFilters.length; i++) {
						this.fFilters[i].refresh();
					}

					this.fillTopFilterPanel();
				}

				this.getData = function() {
					self.mergeAdvancedSearchCriteria(self.advancedSearchPanel
							.getFieldValueMap());

					var filters = new Array();

					for ( var i = 0; i < this.fFilters.length; i++) {
						filters.push(this.fFilters[i].getSelection());
					}

					return {
						searchFilterSelections : filters
					}
				}

				this.fillTopFilterPanel = function() {

					var selectedFilters = new Array();

					for ( var i = 0; i < this.fFilters.length; i++) {
						var select = this.fFilters[i].select;
						for ( var j = 0; j < select.length; j++) {
							selectedFilters.push({
								id : this.fFilters[i].id,
								valueId : select[j],
								name : this.fFilters[i]
										.findFilterTextById(select[j]),
								fieldId : this.fFilters[i].fieldId
							});
						}
					}

					filterTopPanel.update(selectedFilters
							.concat(this.externalFilters));
				}

				this.filterRemoved = function(fieldId, filterValue) {
					var filter = this.findFilterByFieldId(fieldId);
					if (filter) {
						filter.removeSelection(filterValue);
					}
				}

				this.mergeAdvancedSearchCriteria = function(fieldValueMap) {
					this.externalFilters.length = 0;
					for ( var fieldId in fieldValueMap) {
						var selectedValues = fieldValueMap[fieldId];
						var filter = self.findFilterByFieldId(fieldId);
						if (filter != null) {
							filter.mergeCriteria(selectedValues);
						} else {
							for ( var i = 0; i < selectedValues.length; ++i) {
								self.externalFilters.push({
									valueId : selectedValues[i].value,
									fieldId : fieldId,
									id : 'not-a-facet-' + fieldId
											+ selectedValues[i].value,
									name : selectedValues[i].label
								});
							}
						}
					}
				}

				this.addQueryParamsToFilters = function(queryString) {
					queryString = this.queryStringParser.parse(queryString);
					var params = this.filterParamParser
							.parse(queryString[this.paramName]);
					var param = null;
					for ( var i = 0; i < this.fFilters.length; i++) {
						param = params[this.fFilters[i].id];
						if (param != null) {
							this.addQueryParamToFilterSelection(
									this.fFilters[i], param);
						}
					}
				}

				this.addQueryParamToFilterSelection = function(filter, params) {
					for ( var i = 0; i < params.length; i++) {
						filter.addSelection(params[i]);
					}
				}

				this.clear = function() {
					for ( var i = 0; i < this.fFilters.length; i++) {
						this.fFilters[i].clearSelection();
					}
				}
				
				this.setAdvancedSearchPanel = function(_advancedSearchPanel) {
					this.advancedSearchPanel = _advancedSearchPanel;
				}
				
				searchHanlder.registerDataProvider('filterSelectionParam', this);
				searchHanlder.registerRefreshListener(this);
				filterTopPanel.registerFilterList(this);
			}
			// end-of-class-definition

			return FilterPanel;

		});