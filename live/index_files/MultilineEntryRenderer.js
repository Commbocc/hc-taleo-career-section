define(
		[ 'jquery', 'fs/list/ActionsCellRenderer', 'fs/list/CellRenderer',
				'fs/list/LineRenderer', 'fs/list/IconsCellRenderer', 'fs/FacetedSearchSettings' ],
		function($, ActionsCellRenderer, CellRenderer, LineRenderer,
				IconsCellRenderer,  FacetedSearchSettings) {

			function MultilineEntryRenderer() {
				this.lineRenderers = new Array()
				this.actionsRenderer = new ActionsCellRenderer()
				this.cellRenderer = new CellRenderer()
				this.iconsCellRenderer = new IconsCellRenderer();

				var self = this

				this.renderEntry = function(listItem) {
					var listEntry = $('<li>')
							.attr('id', 'job' + listItem.jobId)

					listEntry.append(renderIconsCell(listItem))

					var linesContainer = $('<div>').addClass(
							'multiline-data-container')

					for ( var i = 0; i < this.lineRenderers.length; i++) {
						if (this.lineRenderers[i]
								.checkIfLineShouldBeRenered(listItem)) {
							linesContainer.append(this.lineRenderers[i]
									.renderLine(listItem));
						}
					}
					listEntry.append(linesContainer)

					listEntry.append(renderActionsCell(listItem))

					listEntry.append($('<div style="clear:both;">'))

					if (this.actionsRenderer.checkIfMoreActionsEnabled()) {
						listEntry
								.append(renderAdditionalActionButtons(listItem))
						listEntry.hover(listEntryHoverInHandler,
								listEntryHoverOutHandler)
						listEntry.focusin(listEntryHoverInHandler)
						listEntry.focusout(listEntryHoverOutHandler)
					}

					return listEntry
				}

				function createLineRenderers() {
					var cellRenderer = new CellRenderer()
					var multilineDefinition = FacetedSearchSettings.multilineLayoutAsJSONArray;
					for ( var i = 0; i < multilineDefinition.length; ++i) {
						var lineItems = multilineDefinition[i]
						self.lineRenderers.push(new LineRenderer(lineItems,
								cellRenderer))
					}
				}

				function renderIconsCell(listItem) {
					var iconsCell = $('<div>').addClass(
							'multiline-icon-container');
					self.iconsCellRenderer.fillIconsCell(
							listItem,
							iconsCell,
							FacetedSearchSettings.addToJobCartEnabled);
					return iconsCell;
				}

				function renderActionsCell(listItem) {
					var actions = $('<div>').addClass(
							'multiline-action-container')
					actions.append(self.actionsRenderer
							.createApplyOrReferCandidateButton(listItem))
					return actions
				}

				function renderAdditionalActionButtons(listItem) {
					var buttonListContainer = $('<div>').addClass(
							'additional-action-buttons-container').css("top",
							"-999999px")
					var buttonList = self.actionsRenderer
							.createButtonList(listItem)
					buttonList.addClass('multiline-button-list')
					buttonListContainer.append(buttonList)
					return buttonListContainer
				}

				function listEntryHoverInHandler() {
					$(this).children('.additional-action-buttons-container')
							.css({
								"top" : "",
								"right" : "0px",
								"bottom" : "0px"
							});
				}

				function listEntryHoverOutHandler() {
					$(this).children('.additional-action-buttons-container')
							.css({
								"top" : "-999999px",
								"right" : "",
								"bottom" : ""
							})
				}

				createLineRenderers()
			}
			// end-of-class-definition

			return MultilineEntryRenderer;
		});