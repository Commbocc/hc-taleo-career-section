define(['jquery'], function($) {

	function RadioCriteriaField(id, fieldId) {
		this.id = id;
		this.fieldId = fieldId;
		this.containerId = id + '-radio-criteria';
		this.searchCriteriaValue = '';
		
		var currentInstance = this;
	
		this.getSelection = function() {
			return {
				id : this.id,
				selectedValues : getSelectedValues()
			};
		}
	
		this.saveSearchCriteriaValues = function() {
			var result = '';
			var selectedInputElement = getCheckedInput();
			if (selectedInputElement.length > 0) {
				result = selectedInputElement.attr('value');
			}
			this.searchCriteriaValue = result;
		}
		
		this.refresh = function() {
			this.clearSelection();
			var inputToSelect = getInputWithGivenValue(this.searchCriteriaValue);
			$(inputToSelect).attr('checked', true);
		}
		
		function getInputWithGivenValue(value) {
			return $('#' + currentInstance.containerId).find("input[value='" + value + "']");
		}
	
		this.clearSelection = function() {
			var input = getCheckedInput();
			$(input).attr('checked', false);
		}
		
		this.deselect = function(value) {
			this.searchCriteriaValue = '';
		}
		
		function getSelectedValues() {
			var selectedValues = new Array();
			if(currentInstance.searchCriteriaValue != '') {
				selectedValues.push(currentInstance.searchCriteriaValue);
			}
			return selectedValues;
		}
		
		this.getLabelledValues = function() {
			var labelledValues = new Array();
			var selectedValues = getSelectedValues();
			for (var i = 0; i < selectedValues.length; ++i) {
				labelledValues.push({
					value: selectedValues[i],
					label: getOptionDescription(selectedValues[i])
				});
			}
			
			return labelledValues;
		}
		
		function getOptionDescription(value) {
			var inputId = getInputWithGivenValue(value).attr('id');
			return $('#' + inputId + '-desc').html();
		}
		
		function getCheckedInput() {
			return $('#' + currentInstance.containerId).find('input:checked');
		}
		
		this.saveSearchCriteriaValues();
	}
	//end-of-class-definition
	
	return RadioCriteriaField;
});	