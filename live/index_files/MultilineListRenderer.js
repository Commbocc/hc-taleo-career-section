define([ 'jquery', 'fs/list/MultilineEntryRenderer' ], function($,
		MultilineEntryRenderer) {

	function MultilineListRenderer(listId) {
		this.listId = listId
		this.entryRenderer = new MultilineEntryRenderer()

		function updateMargins() {
			$('.multiline-action-container').each(
					function() {
						var actionsColumnWidth = $(this).width();
						$(this).prev().css('margin-right',
								(actionsColumnWidth + 20) + 'px');
					});
		}

		this.renderResults = function(requisitionList) {
			$('#' + this.listId).children().remove()

			for ( var i = 0; i < requisitionList.length; ++i) {
				$('#' + this.listId).append(
						this.entryRenderer.renderEntry(requisitionList[i]))
			}

			updateMargins()
		}
	}
	// end-of-class-definition

	return MultilineListRenderer;
});