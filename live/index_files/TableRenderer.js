define([ 'jquery', 'fs/list/RowRenderer' ], function($, RowRenderer) {

	function TableRenderer(tableId, popupManager) {

		this.tableId = tableId
		this.rowRenderer = new RowRenderer(popupManager)

		function updateCellsFormat() {
			$(".absolute").each(function() {
				$(this).parent().css("height", $(this).height())
			    $(this).parent().css("text-align", "left")
		});
		}

		$(window).resize(updateCellsFormat)

		this.renderResults = function(requisitionList) {

			var tbody = $('#' + this.tableId).find('tbody')
			tbody.children().remove()

			for ( var i = 0; i < requisitionList.length; ++i) {
				tbody.append(this.rowRenderer.renderRow(requisitionList[i],
						(i % 2 === 0)))
			}
			updateCellsFormat()
		}
	}
	// end-of-class-definition

	return TableRenderer;

});