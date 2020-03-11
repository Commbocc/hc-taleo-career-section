define([ 'jquery' ], function($) {

	function FiltersSelectionPanel() {
		var self = this;

		// IDs which refers to filtersSelectionPanel.jsp
		this.panelId = "filtersSelectionPanel";
		this.listId = "filtersSelectionList";

		this.init = function(addFilterEvent, removeFilterEvent,
				selectionLimitEvent) {
			this.clear();
			this.on(addFilterEvent, removeFilterEvent, selectionLimitEvent);
		}

		this.on = function(addFilterEvent, removeFilterEvent,
				selectionLimitEvent) {
			$(document).on(addFilterEvent, function(event, selection) {
				addFilter(selection, removeFilterEvent);
			});
			$(document).on(removeFilterEvent, function(event, selection) {
				removeFilter(selection);
			});
			$(document).on(selectionLimitEvent, function(event, selection) {
				removeFilter(selection);
			});
		}

		this.off = function(addFilterEvent, removeFilterEvent,
				selectionLimitEvent) {
			$(document).off(addFilterEvent);
			$(document).off(removeFilterEvent);
			$(document).off(selectionLimitEvent);
		}

		this.clear = function() {
			$('#' + self.panelId).find('#' + self.listId).remove();
		}

		function addFilter(selection, removeFilterEvent) {
			var panel = $('#' + self.panelId);
			var filterList = panel.find('#' + self.listId);
			if (filterList.length == 0) {
				filterList = $('<ul>').attr("id", self.listId).attr("class",
						"filter-list");
				panel.append(filterList);
			}
			var filterElement = $('<li>').attr("id", selection.itemId).html(
					selection.itemLabel);

			var removeFilterButton = $('<input>').attr({
				type : 'button',
				id : selection.itemId + 'BT'
			}).click(function() {
				$(document).trigger(removeFilterEvent, selection);
			});

			filterElement.append(removeFilterButton);
			filterList.append(filterElement);
		}

		function removeFilter(selection) {
			$('#' + self.listId).find('#' + selection.itemId).children()
					.remove();
			$('#' + self.listId).find('#' + selection.itemId).remove();
			if ($('#' + self.listId).children().length == 0) {
				$('#' + self.listId).remove();
			}
		}
	}
	// end-of-class-definition

	return FiltersSelectionPanel;
});