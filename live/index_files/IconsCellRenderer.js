define(
		[ 'jquery', 'fs/IconsDefinitionProvider', 'fs/FacetedSearchSettings' ],
		function($, IconsDefinitionProvider, FacetedSearchSettings) {

			function IconsCellRenderer() {

				this.fillIconsCell = function(listItem, cellToFill,
						isAddToJobCartAction) {
					var iconsDefinitions = IconsDefinitionProvider.iconsDefinitions;
					for ( var i = 0; i < iconsDefinitions.length; ++i) {
						var iconDefinition = iconsDefinitions[i];
						if (iconDefinition.isIconDisplayed(listItem,
								FacetedSearchSettings.userSignedIn,
								isAddToJobCartAction)) {
							cellToFill.append(iconDefinition.createIcon());
						}
					}
				}

				this.refreshIconsCell = function(job) {
					var cellToRefresh = $('#job' + job.jobId + ' .icons,'
							+ '#job' + job.jobId + ' .multiline-icon-container');
					cellToRefresh.children().remove();
					this.fillIconsCell(job, cellToRefresh, true);
				}
			}
			// end-of-class-definition

			return IconsCellRenderer;

		});