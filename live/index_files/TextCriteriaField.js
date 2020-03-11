define(['jquery'], function($) {

	function TextCriteriaField(id, fieldId) {
		this.id = id;
		this.fieldId = fieldId;
		this.textInputId = id + '-text-criteria-input';
		this.searchCriteriaValue = '';
		
		var currentInstance = this;
		
		this.getSelection = function() {
			return {
				id : this.id,
				selectedValues : getSelectedValues()
			};
		}
	
		this.saveSearchCriteriaValues = function() {
			this.searchCriteriaValue = getTextInput().val();
		}
		
		this.refresh = function() {
			getTextInput().val(this.searchCriteriaValue);
		}
		
		function getSelectedValues () {
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
					label: selectedValues[i]
				});
			}
			return labelledValues;
		}
		
		this.clearSelection = function() {
			getTextInput().val("");
		}
	
		function getTextInput () {
			return $('#' + currentInstance.textInputId);
		}
		
		this.deselect = function(value) {
			currentInstance.searchCriteriaValue = '';
		}
		
		function init () {
			var inputID = currentInstance.id + '-text-criteria-input';
			var input = $('#' + inputID);
			var suggestId = input.attr('suggestid');
			if (input.attr('isautosuggest') == 'true') {
				input.autosuggestText({
					suggestId: suggestId
				});
			}
			currentInstance.saveSearchCriteriaValues();
		}
		
		init();
	}
	//end-of-class-definition
	
	return TextCriteriaField;
});	