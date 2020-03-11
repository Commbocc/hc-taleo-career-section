define([ 'jquery' ], function($) {

	function OLFFieldBuilder() {

		this.createAutocompleteInput = function(inputId, removeCallback) {

			var input = createInput(inputId);
			var hidden = createHiddenInput(inputId);
			var removeButton = createRemoveButton(inputId, removeCallback);

			var inputDiv = $("<div>").attr({
				id : inputId + '-div'
			})
			inputDiv.append(input).append(removeButton).append(hidden);
			inputDiv.addClass("olf-autocomplete-field");

			return inputDiv;
		}

		function createHiddenInput(id) {
			return $("<input>").attr({
				type : "hidden",
				id : id + "-olfid"
			});
		}

		function createInput(id) {
            var unformattedTitle = id.toString();
            var formattedTitle = unformattedTitle.substring(0, unformattedTitle.indexOf("-"));
            formattedTitle = formattedTitle.replace("_"," ");
			var input = $("<input>").attr({
				type : "text",
				size : 20,
				id : id,
                title : formattedTitle
			});
			input.addClass("ui-autocomplete-input");
			return input;
		}

		function createRemoveButton(inputId, callback) {

			var button = $('<a>').attr({
				id : inputId + '-remove-button'
			});
            button.attr('href', '#');
			button.attr('role', 'button');
            button.attr('aria-label', 'close');
			button.addClass("remove-button-olf-widget");
			button.html('&times;');
			button.click(function() {
				callback(inputId);
			});

			return button;
		}
	}
	// end-of-class-definition

	return OLFFieldBuilder;

});