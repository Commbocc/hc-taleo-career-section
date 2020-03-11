define(
		[ 'jquery', 'fs/ResourcesHandler', 'fs/FacetedSearchSettings' ,'fs/ButtonsDefinitionsProvider'],
		function($, ResourcesHandler, FacetedSearchSettings, ButtonsDefinitionsProvider) {

			function ActionsCellRenderer() {

				var self = this;

				this.createApplyOrReferCandidateButton = function(listItem) {
					if (FacetedSearchSettings.agencyPortal) {
						return createReferCandidateButton(
								ButtonsDefinitionsProvider.referCandidateButtonDefinition,
								FacetedSearchSettings.userSignedIn, listItem)
					} else if (FacetedSearchSettings.applicationFlowSet) {
						return createApplyButton(
								ButtonsDefinitionsProvider.applyButtonDefinition,
								FacetedSearchSettings.userSignedIn, listItem)
					}
				}

				this.createButtonList = function(listItem) {
					var buttonList = $('<ul>').attr("role", "menu")

					if (FacetedSearchSettings.addToJobCartEnabled
							&& !FacetedSearchSettings.agencyPortal) {
						buttonList
								.append(self
										.createAddToJobCartButton(
												ButtonsDefinitionsProvider.addToJobCartButtonDefinition,
												FacetedSearchSettings.userSignedIn,
												listItem))
					}

					if (FacetedSearchSettings.addThisEnabled) {
						buttonList.append(createAddThisButton(
								ButtonsDefinitionsProvider.addThisButtonDefinition,
								listItem))
					}

					return buttonList
				}

				this.createAddToJobCartButton = function(buttonDefinition,
						isUserLoggedIn, listItem) {
					var link = buttonDefinition.createAddToJobCartLink(this,
							isUserLoggedIn, listItem)
					var disabledLink = buttonDefinition
							.createAddToJobCartDisabledLink(isUserLoggedIn,
									listItem)
					$(disabledLink).attr('tabindex', '0')

					var item = $('<li>').addClass(
							buttonDefinition.className + ' metalink2').append(
							link).append(disabledLink).attr("role", "menuitem");
					return item
				}

				this.disableAddToJobCartLink = function(listItem) {
					var link = $('#job' + listItem.jobId + ' #add-to-jobcart'
							+ listItem.jobId)
					var disabledLink = $('#job' + listItem.jobId
							+ ' #add-to-jobcart-disabled' + listItem.jobId)
					link.addClass('hidden-element')
					disabledLink.removeClass('hidden-element')
				}

				this.renderMoreActionsContainer = function(listItem) {
					var moreActionsContainerWithToggleButton = createMoreActionsContainerWithToggleButton()
					var dropdownList = this.createButtonList(listItem)
					dropdownList.addClass('dropdown-menu').addClass(
							'dropdown-list-searchresults')
					moreActionsContainerWithToggleButton.append(dropdownList)
					return moreActionsContainerWithToggleButton
				}

				this.checkIfMoreActionsEnabled = function() {
					return FacetedSearchSettings.addThisEnabled
							|| FacetedSearchSettings.addToJobCartEnabled
							&& !FacetedSearchSettings.agencyPortal;
				}

				function createMoreActionsContainerWithToggleButton() {
					var moreActionsContainer = $('<span>')
							.attr({
								role : "button",
								tabindex : '0'
							})
							.attr(
									"aria-label",
									ResourcesHandler
											.getResource("resultListPanel.moreActionsButton"))
							.attr("aria-expanded", "false").attr(
									"aria-haspopup", "true").html("&zwnj;");
					var toggleButton = $('<a>').addClass(
							'more-actions menu-toggle')
					moreActionsContainer.append(toggleButton)
					return moreActionsContainer
				}

				function createAddThisButton(buttonDefinition, listItem) {
					var addThisButtonAnchor = buttonDefinition
							.createAddThisButton(listItem)
					var item = $('<li>').addClass('li_addThis metalink2').attr(
							"role", "menuitem").append(addThisButtonAnchor)
					return item
				}

				function createReferCandidateButton(buttonDefinition,
						isUserLoggedIn, listItem) {
					return buttonDefinition.createButton(isUserLoggedIn,
							listItem)
				}

				function createApplyButton(buttonDefinition, isUserLoggedIn,
						listItem) {
					return buttonDefinition.createApplyButton(isUserLoggedIn,
							listItem)
				}
			}
			// end-of-class-definition

			return ActionsCellRenderer;

		});