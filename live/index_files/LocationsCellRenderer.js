define(
		[ 'jquery', 'fs/StaticResourcesProvider' ],
		function($, StaticResourcesProvider) {

			function LocationsCellRenderer() {
				INITIAL_LOCATIONS_LIST_SIZE = 3;
				SEPARATOR = '; ';

				this.renderLocationsCell = function(locationsArray) {
					if (locationsArray.length > 1) {
						return renderMultipleLocationsCell(locationsArray);
					} else {
						return renderSingleLocationCell(locationsArray);
					}
				}

				function renderSingleLocationCell(locationsArray) {
					return $('<span>').text(locationsArray[0]);
				}

				function renderMultipleLocationsCell(locationsArray) {
					var initialLocationsToDisplay = getInitialLocationsToDisplay(locationsArray);
					var moreLocationsToDisplay = getMoreLocationsToDisplay(locationsArray);

					var mainCellContainer = createCellContainerWithInitialLocations(initialLocationsToDisplay);
					if (moreLocationsToDisplay.length > 0) {
						var moreLocationsContainer = createCellContainerWithMoreLocations(moreLocationsToDisplay);
						mainCellContainer.append(moreLocationsContainer);
						mainCellContainer
								.append(createShowMoreLink(moreLocationsContainer));
					}
					return mainCellContainer;
				}

				function createCellContainerWithInitialLocations(
						initialLocationsToDisplay) {
					var mainCellContainer = $('<span>');
					var initialLocationsSpan = $('<span>').addClass(
							'initial-locations')
							.text(initialLocationsToDisplay);
					mainCellContainer.append(initialLocationsSpan);
					return mainCellContainer;
				}

				function createCellContainerWithMoreLocations(
						moreLocationsToDisplay) {
					var moreLocationsContainer = $('<span>').addClass(
							'more-locations').css('display', 'inline').text(
							moreLocationsToDisplay);
					moreLocationsContainer.hide();
					return moreLocationsContainer;
				}

				function createShowMoreLink(moreLocationsContainer) {
					var showMoreLink = $('<span>').addClass('show-more-link')
							.text(StaticResourcesProvider.showMoreLocations)
							.click(
									function() {
										$(this).hide()
										moreLocationsContainer.css('display',
												'inline');
									});
					return showMoreLink;
				}

				function getInitialLocationsToDisplay(locationsArray) {
					var initialLocationsSubArray = locationsArray.slice(0, Math
							.min(locationsArray.length,
									INITIAL_LOCATIONS_LIST_SIZE));
					return initialLocationsSubArray.join(SEPARATOR);
				}

				function getMoreLocationsToDisplay(locationsArray) {
					if (locationsArray.length <= INITIAL_LOCATIONS_LIST_SIZE) {
						return "";
					} else {
						var moreLocationsSubArray = locationsArray.slice(
								this.INITIAL_LOCATIONS_LIST_SIZE,
								locationsArray.length);
						moreLocationsSubArray.splice(0, 0, '');
						return moreLocationsSubArray.join(SEPARATOR);
					}
				}
			}
			// end-of-class-definition

			return LocationsCellRenderer;

		});