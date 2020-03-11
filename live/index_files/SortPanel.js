define(
		[ 'jquery', 'fs/SortQueryParamExtractor' ],
		function($, SortQueryParamExtractor) {

			function SortPanel(searchHandler, defaultSortingField,
					defaultOrder, queryString) {
				var currentInstance = this
				this.defaultSortingField = defaultSortingField
				this.defaultOrder = defaultOrder
				this.sortQueryParamExtractor = new SortQueryParamExtractor()

				this.sortBySelectChangeEvent = function(selectedOptionId) {
					var selectedOption = $('#' + selectedOptionId)
					var sortingOrderSelect = $('#sortingOrder')

					if (selectedOption.attr('ascending') === "true"
							&& selectedOption.attr('descending') === "true") {
						sortingOrderSelect.prop('disabled', false)
					} else {
						sortingOrderSelect
								.val(selectedOption.attr('ascending') === "true" ? 'ascendingOrder'
										: 'descendingOrder')
						sortingOrderSelect.prop('disabled', true)
					}
				}

				this.getOptionForSortId = function(sortId) {
					return $('#sortBySelect').find(
							'option[sortid="' + sortId + '"]').attr('value')
				}

				this.setDefaultFieldAndOrder = function() {
					var param = this.sortQueryParamExtractor
							.extractSortParameter(queryString)
					var field = param ? this.getOptionForSortId(param.field)
							: this.defaultSortingField
					var ascending = param ? param.ascending : this.defaultOrder
					this.applySelection(field, ascending)
				}

				this.applySelection = function(fieldName, ascending) {
					$('#sortingOrder').val(
							ascending ? 'ascendingOrder' : 'descendingOrder')
					$('#sortBySelect').val(fieldName)

					this.sortBySelectChangeEvent(fieldName + "-sortfield")
				}

				this.getData = function() {
					var sortingSelection = new Object()

					sortingSelection.sortBySelectionParam = $(
							'#sortBySelect :selected').attr('sortid')
					sortingSelection.ascendingSortingOrder = $(
							'#sortingOrder :selected').attr('ascendingorder')

					return sortingSelection
				}

				this.callSearch = function() {
					searchHandler.refresh({
						type : "SORT"
					});
				}

				this.clear = function() {
				};

				$('#sortBySelect')
						.change(
								function() {
									currentInstance
											.sortBySelectChangeEvent(this.options[this.options.selectedIndex].id)
									currentInstance.callSearch()
								});

				$('#sortingOrder').change(function() {
					currentInstance.callSearch()
				});

				searchHandler.registerDataProvider('sortingSelection', this);
			}
			// end-of-class-definition

			return SortPanel;
		});