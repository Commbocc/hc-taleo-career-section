define([ 'jquery', 'fs/Utilities'], function($, Utilities) {

	function DefaultFilter(id, name, olf, expanded, fieldId, searchHandler) {
		var self = this;

		this.id = id;
		this.name = name;
		this.olf = olf;
		this.fieldId = fieldId;
		this.expandedByDefault = expanded;

		this.criteriaId = null;
		this.criteriaLabel = null;

		this.model = null;
		this.values = new Array();
		this.select = new Array();

		this.renderer = null;

		// VIEW
		this.setRenderer = function(filterRenderer) {
			this.renderer = filterRenderer;
		}

		this.render = function() {
			if (this.renderer && this.renderer.render) {
				this.renderer.render();
			}
		}

		this.refresh = function() {
			if (this.renderer && this.renderer.refresh) {
				this.renderer.refresh();
			}
		}

		// DATA
		this.setFilterModel = function(filterModel) {
			this.model = filterModel;
		}

		this.setFilterValues = function(vals) {
			this.values = vals;
			this.synchronizeSelectedValues();
		}

		this.extendFilterValues = function(newValues) {
			$.each(newValues, function(index, newValue) {
				if (Utilities.getInstance()
						.findFirstWhereValueEqualToExtractedValue(self.values,
								newValue.id, function(value) {
									return value.id
								}) == null) {
					self.values.push(newValue);
				}
			});
			this.synchronizeSelectedValues();
		}

		this.findFilterTextById = function(id) {
			var value = findFilterValueById(this.values, id);
			return value == null ? null : value.text;
		}

		this.addNewValue = function(values, id) {
			var value = findFilterValueById(values, id);
			if (value) {
				this.values.push(value);
			}
		}

		function findFilterValueById(values, id) {
			for ( var i = 0; i < values.length; i++) {
				if (values[i].id == id) {
					return values[i];
				}
			}
			return null;
		}

		// SELECTION
		this.getSelection = function() {
			var selectedValues = new Array();
			for ( var i = 0; i < this.select.length; ++i) {
				selectedValues.push(this.select[i]);
			}
			var id = this.id;
			return {
				id : id,
				selectedValues : selectedValues
			};
		}

		this.addSelection = function(filterValue) {
			if (!this.isSelectedValue(filterValue)) {
				this.select.push(filterValue);
			}
		}

		this.removeSelection = function(filterValue) {
			for ( var i = 0; i < this.select.length; i++) {
				if (filterValue == this.select[i]) {
					this.select.splice(i, 1);
					break;
				}
			}
		}

		this.clearSelection = function() {
			this.select = new Array();
		}

		this.synchronizeSelectedValues = function() {
			this.select = $.grep(this.select, function(id, index) {
				return Utilities.getInstance()
						.findFirstWhereValueEqualToExtractedValue(self.values,
								id, function(value) {
									return value.id
								}) != null;
			});
		}

		this.mergeCriteria = function(selectedValues) {
			for ( var i = 0; i < selectedValues.length; ++i) {
				this.addSelection(selectedValues[i].value);
			}
		}

		this.isSelectedValue = function(id) {
			return $.inArray(id, this.select) > -1;
		}

		// ACTIONS
		this.callSearch = function(newValueId) {
			var event = {
				type : "FILTER"
			};
			if (newValueId
					&& findFilterValueById(this.values, newValueId) == null) {
				event.newValueId = newValueId;
			} else if (this.select.length >= 1) {
				event.activeFilterId = this.id;
			}

			searchHandler.refresh(event);
		}

		this.getFieldCode = function() {
			if (this.id == "JOB_FIELD") {
				return "CATEGORY";
			}
			return this.id;
		}
	}
	// end-of-class-definition

	return DefaultFilter;

});