define([ 'jquery' ], function($) {

	function LineRenderer(lineItems, cellRenderer) {
		this.lineItems = lineItems
		this.cellRenderer = cellRenderer

		var self = this

		this.renderLine = function(listItem) {
			var lineDiv = $('<div>')
			for ( var i = 0; i < this.lineItems.length; i++) {
				lineDiv.append(renderItem(this.lineItems[i], listItem))
			}

			return lineDiv
		}

		this.checkIfLineShouldBeRenered = function(listItem) {
			var renderLine = false;
			for ( var i = 0; i < this.lineItems.length; i++) {
				if (checkIfFieldNotEmpty(this.lineItems[i], listItem)) {
					renderLine = true;
					break;
				}
			}
			return renderLine;
		}

		function renderItem(lineItem, listItem) {
			if (lineItem.type === "field") {
				return self.cellRenderer.renderCell(lineItem.index, listItem)
			} else if (lineItem.type === "breakLine") {
				return $('<br>')
			} else {
				return $('<span>').text(lineItem.value)
			}
		}

		function checkIfFieldNotEmpty(lineItem, listItem) {
			if (lineItem.type === "field"
					&& listItem.column[lineItem.index] !== '') {
				return true;
			}
			return false;
		}
	}
	// end-of-class-definition

	return LineRenderer;

});