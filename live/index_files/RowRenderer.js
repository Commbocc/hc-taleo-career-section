define(
		[ 'jquery', 'fs/list/CellRenderer', 'fs/list/ActionsCellRenderer',
				'fs/FacetedSearchSettings', 'fs/list/IconsCellRenderer' ],
		function($, CellRenderer, ActionsCellRenderer,
				FacetedSearchSettings, IconsCellRenderer) {

			function RowRenderer() {

				this.cellRenderer = new CellRenderer()
				this.actionsRenderer = new ActionsCellRenderer()
				this.iconsCellRenderer = new IconsCellRenderer();

				var self = this;

				this.renderRow = function(listItem, isEven) {
					var row = $('<tr>').attr('id', 'job' + listItem.jobId)
					row.addClass(isEven ? 'even' : 'odd')

					row.append(renderIconsCell(listItem))

					for ( var i = 0; i < listItem.column.length; i++) {
						row.append(renderNormalCell(i, listItem))
					}

					row.append(renderActionsCell(listItem))

					return row
				}

				function renderIconsCell(listItem) {
					var iconsCell = $('<td>').addClass('icons');
					self.iconsCellRenderer
							.fillIconsCell(
									listItem,
									iconsCell,
									FacetedSearchSettings.addToJobCartEnabled);
					return iconsCell;
				}

				function renderActionsCell(listItem) {
					var actions = $('<td>').addClass('actions')
					var container = $('<div>').addClass('actions-container')

					container.append(self.actionsRenderer
							.createApplyOrReferCandidateButton(listItem))

					if (self.actionsRenderer.checkIfMoreActionsEnabled()) {
						container.append(self.actionsRenderer
								.renderMoreActionsContainer(listItem))
					}

					actions.append(container)
					return actions
				}

				function renderNormalCell(idx, listItem) {
					var cell = $('<td>')
					if (idx == 0) {
						cell = $('<th scope="row">')
					}
					var divRelative = $('<div class="relative">')
					var divAbsolute = $('<div class="absolute">')

					divAbsolute.append(self.cellRenderer.renderCell(idx,
						listItem))
					divAbsolute.attr('title', getTitleText(idx, listItem))

					divRelative.append(divAbsolute)
					cell.append(divRelative)
					return cell
				}

				function getTitleText(idx, listItem) {
					if (isLocationsColumn(idx, listItem)) {
						text = JSON.parse(listItem.column[idx]).join('; ');
					} else {
						text = listItem.column[idx];
					}
					if (isFireFox()) {
						return ' ' + text + ' ';
					}
					return text;
				}

				function isLocationsColumn(idx, listItem) {
					var locationsColumn = listItem.locationsColumns;
					for ( var i = 0; i < locationsColumn.length; i++) {
						if (idx == locationsColumn[i]) {
							return true;
						}
					}
					return false;
				}

                function isFireFox()
                {
                    return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
                }
			}
			// end-of-class-definition

			return RowRenderer;

		});