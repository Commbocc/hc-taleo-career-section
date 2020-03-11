define(['jquery'], function($) {

	function CheckboxCriteriaField(id, fieldId) {
		this.id = id;
		this.fieldId = fieldId;
		this.containerId = id + '-checkbox-criteria';
		this.searchCriteriaValues = new Array();
		
		var currentInstance = this;
		
		this.getSelection = function() {
			return {
				id : this.id,
				selectedValues : this.searchCriteriaValues
			};
		}
		
		this.clearSelection = function() {
			var inputs = getCheckedInputs();
			$.each(inputs, function(i, input) {
				$(input).attr('checked', false);
			});
		}
		
		this.saveSearchCriteriaValues = function() {
			this.searchCriteriaValues = getSelectedValues();
		}
		
		this.deselect = function(value) {
			this.searchCriteriaValues = $.grep(this.searchCriteriaValues, function(criteriaValue) {
				return criteriaValue != value;
			});
		}
		
		this.refresh = function() {
			this.clearSelection();
			for (var i=0; i< this.searchCriteriaValues.length; ++i) {
				var inputToSelect = getInputWithGivenValue(this.searchCriteriaValues[i]);
				$(inputToSelect).attr('checked', true);
			}
		}
		
		function getInputWithGivenValue(value) {
			return $('#' + currentInstance.containerId).find("input[value='" + value + "']");
		}
		
		function getSelectedValues () {
			var selectedValues = new Array();
			var selectedInputElements = getCheckedInputs();
			if(selectedInputElements.length > 0) {
				selectedValues = $.map(selectedInputElements, function (element){
					  return $(element).attr('value');
				}); 
			}
			return selectedValues;
		}
		
		this.getLabelledValues = function() {
			var labelledValues = new Array();
			for (var i = 0; i < this.searchCriteriaValues.length; ++i) {
				labelledValues.push({
					value: this.searchCriteriaValues[i],
					label: getOptionDescription(this.searchCriteriaValues[i])
				});
			}
			return labelledValues;
		}
		
		function getOptionDescription(value) {
			var inputId = getInputWithGivenValue(value).attr('id');
			return $('#' + inputId + '-desc').html();
		}
		
		function getCheckedInputs() {
			return $('#' + currentInstance.containerId).find('input:checked');
		}
		
		this.saveSearchCriteriaValues();
	}
	//end-of-class-definition

	return CheckboxCriteriaField;

});