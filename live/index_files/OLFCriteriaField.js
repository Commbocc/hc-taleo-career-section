define([ 'jquery', 'fs/OLFFieldBuilder' ], function($,
		OLFFieldBuilder) {

	function OLFCriteriaField(id, fieldId, type) {
		this.id = id;
		this.fieldId = fieldId;
		this.type = type;
		this.widgetId = id + '-olf';
		this.addButton = this.widgetId + '-add-button';
		this.criteriaField = this.widgetId + '-criteria-field';
		this.max = 3;
		this.time = 500;
		this.searchCriteriaValues = new Array();

		var olfFieldBuilder = new OLFFieldBuilder();

		var counter = 0;
		var currentInstance = this;

		this.getSelection = function() {
			return {
				id : this.id,
				selectedValues : getSelectedValues()
			};
		}

		this.saveSearchCriteriaValues = function() {
			var selectedValues = new Array();
			getInputs().each(function() {
				var hiddenInput = getHiddenInput(this.id);
				if (hiddenInput.val() != '') {
					selectedValues.push({
						id : hiddenInput.val(),
						label : this.value
					});
				}
			});
			currentInstance.searchCriteriaValues = selectedValues;
		}

		this.refresh = function() {
			clear();

			var selectedValues = currentInstance.searchCriteriaValues;
			for ( var i = 1; i < selectedValues.length; i++) {
				addInputField(getNewInputId());
			}

			if (selectedValues.length > 0) {
				getInputs().each(function(i, input) {
					$(input).val(selectedValues[i].label);
					getHiddenInput(input.id).val(selectedValues[i].id);
				});
			}
			manageRemoveButtons();
			manageAddButton();
		}

		function getSelectedValues() {
			return $.map(currentInstance.searchCriteriaValues, function(
					criteriaValue) {
				return criteriaValue.id;
			});
		}

		this.getLabelledValues = function() {
			return $.map(currentInstance.searchCriteriaValues, function(
					criteriaValue) {
				return {
					value : criteriaValue.id,
					label : criteriaValue.label
				};
			});
		}

		function clear() {
			$.each(getInputs(), function(i, input) {
				getValueInput(input.id).val("");
				getHiddenInput(input.id).val("");
			});

			$.each(getInputs(), function(i, input) {
				hideRemoveButton(input.id);
				if (i > 0) {
					removeInput(input.id);
				}
			});
		}

		this.clearSelection = function() {
			clear();
			manageAddButton();
			manageRemoveButtons();
		}

		function createAddButton(id) {
			$('#' + id).click(function() {
				if (getInputs().length < currentInstance.max) {
					addInputField(getNewInputId());
					if (getInputs().length > currentInstance.max - 1) {
						hideAddButton();
					}
					manageRemoveButtons();
				}
			});
		}

		function addInputField(id) {
			var olfInput = olfFieldBuilder.createAutocompleteInput(id,
					removeButtonCallback);
			$('#' + currentInstance.criteriaField).append(olfInput);

			olfInput.slideDown(currentInstance.time);
			$('#' + id).autosuggestOLF({
				suggestId : currentInstance.type
			});
		}

		this.deselect = function(value) {
			this.searchCriteriaValues = $.grep(this.searchCriteriaValues,
					function(criteriaValue) {
						return criteriaValue.id != value;
					});
		}

		function removeInput(inputId) {

			var parent = $('#' + inputId + '-div');
			parent.slideUp(currentInstance.time, function() {
				parent.remove();
			});
			removeUIAutocompleteClass(inputId);
		}

		function removeButtonCallback(id) {
			if (getInputs().length > 1) {
				removeInput(id);
				displayAddButton();
				manageRemoveButtons();
			}
		}

		function removeUIAutocompleteClass(id) {
			$('#' + id).removeClass("ui-autocomplete-input");
		}

		function manageRemoveButtons() {
			var inputs = getInputs();
			if (inputs.length == 1) {
				fadeOutRemoveButton(inputs[0].id);
			} else {
				$.each(inputs, function(i, val) {
					fadeInRemoveButton(val.id);
				});
			}
		}

		function manageAddButton() {
			if (getInputs().length < currentInstance.max) {
				displayAddButton()
			} else {
				hideAddButton();
			}
		}

		function getInputs() {
			return $("#" + currentInstance.criteriaField
					+ " .ui-autocomplete-input");
		}

		function getValueInput(id) {
			return $('#' + currentInstance.criteriaField).find('#' + id);
		}

		function getHiddenInput(id) {
			return $('#' + currentInstance.criteriaField).find(
					"#" + id + "-olfid");
		}

		function getNewInputId() {
			return currentInstance.widgetId + '-' + (counter++);
		}

		function displayAddButton() {
			$('#' + currentInstance.addButton).animate({
				opacity : 1
			}, currentInstance.time);
			$('#' + currentInstance.addButton).css('cursor', 'pointer');
		}

		function hideAddButton() {
			$('#' + currentInstance.addButton).animate({
				opacity : 0
			}, currentInstance.time);
			$('#' + currentInstance.addButton).css('cursor', 'default');
		}

		function fadeInRemoveButton(id) {
			$('#' + id + '-remove-button').fadeIn(currentInstance.time);
		}

		function fadeOutRemoveButton(id) {
			$('#' + id + '-remove-button').fadeOut(currentInstance.time);
		}

		function hideRemoveButton(id) {
			$('#' + id + '-remove-button').hide();
		}

		this.init = function(optionsAsJSONString) {
			createAddButton(currentInstance.addButton);

			if (optionsAsJSONString == '{}') {
				addInputField(getNewInputId());
			}

			var options = JSON.parse(optionsAsJSONString);
			$.each(options, function(key, value) {
				createInputForSelectedOption(key, value);
				manageAddButton();
			});

			manageRemoveButtons();
			currentInstance.saveSearchCriteriaValues();
		}

		function createInputForSelectedOption(key, value) {
			var newInputID = getNewInputId();
			addInputField(newInputID);
			getHiddenInput(newInputID).val(key);
			getValueInput(newInputID).val(value);
		}
	}
	// end-of-class-definition

	return OLFCriteriaField;
});