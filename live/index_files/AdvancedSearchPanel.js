define(
		[ 'jquery', 'fs/StaticResourcesProvider','fs/PopupManager'],
		function($, StaticResourcesProvider, PopupManager) {

			function AdvancedSearchPanel(searchHandler, fieldPanel, filterPanel, filterTopPanel) {
				this.advancedSearchPanelContainerId = 'advanced-search-panel-container';
				this.slideTime = 500;
				this.isVisible = false;
				this.criteriaFields = new Array();

				var currentInstance = this;

				this.togglePanel = function() {
					if (this.isVisible) {
						this.hidePanel();
					} else {
						this.showPanel();
					}
				}

				this.showPanel = function() {
					if (!this.isVisible) {
						PopupManager.setLastActiveElement(
							this, $(':focus'));
						PopupManager
								.openFixedPositionedPopup(this, true);
					}
				}

				this.hidePanel = function() {
					if (this.isVisible) {
						PopupManager.closePopup(this);
					}
				}

				this.hide = function() {
					getAdvancedSearchPanelContainer().slideUp({
						duration : this.slideTime,
						complete : removeCriteriaContainerRelativePosition
					});
					setCriteriaContainerZIndexValue('');
					setMainsectionZIndexValue('');
					setHeaderPanelZIndexValue('');
					setAdvancedSearchLinkText(StaticResourcesProvider.advancedSearchLink);
                    setAdvancedSearchLinkAriaExpandedValue(false);
					this.isVisible = false;
					fieldPanel.updateCriteriaInputs();
				}

				this.show = function() {
					getAdvancedSearchPanelContainer().slideDown(this.slideTime);
					addCriteriaContainerRelativePosition();
					setCriteriaContainerZIndexValue(1101);
					setMainsectionZIndexValue(1010);
					setHeaderPanelZIndexValue(1102);
					setAdvancedSearchLinkText(StaticResourcesProvider.basicSearchLink);
                    setAdvancedSearchLinkAriaExpandedValue(true);
					this.isVisible = true;
				}

    this.keydown = function(functionPointer){
        getAdvancedSearchPanelContainer().keydown(functionPointer);
				}

				this.attr = function(name, value) {
					getAdvancedSearchPanelContainer().attr(name, value);
				}

				this.find = function(what) {
					return getAdvancedSearchPanelContainer().find(what);

				}

				this.css = function(property, value) {
					getAdvancedSearchPanelContainer().css(property, value);
				}

				this.zIndex = function() {
					return getAdvancedSearchPanelContainer().zIndex();
				}

				this.clear = function() {
					clearAdvancedCriteria();
					saveSearchedCriteria();
					this.hidePanel();
				}

				this.getData = function(event) {
					var selectedCriteria = new Array();
					for ( var i = 0; i < this.criteriaFields.length; ++i) {
						selectedCriteria.push(this.criteriaFields[i]
								.getSelection());
					}
					return {
						searchFilterSelections : selectedCriteria
					}
				}

				this.refresh = function() {
					for ( var i = 0; i < this.criteriaFields.length; ++i) {
						this.criteriaFields[i].refresh();
					}
				}

				function clearAdvancedCriteria() {
					for ( var i = 0; i < currentInstance.criteriaFields.length; ++i) {
						currentInstance.criteriaFields[i].clearSelection();
					}
					clearTopCriteriaPanel();
				}

				function clearTopCriteriaPanel() {
					var topCriteriaPanel = searchHandler.dataProviders['fieldData'];
					topCriteriaPanel.clearPanel();
				}

				this.registerCriteriaField = function(criteriaField) {
					this.criteriaFields.push(criteriaField);
				}

				this.registerClickHandlers = function() {
					$('#advancedSearch').click(function() {
						currentInstance.togglePanel();
					});

					$('#clear-advanced-search-criteria').click(function() {
						clearAdvancedCriteria();
					});

					$('#close-window-button').click(function() {
						currentInstance.hidePanel();
					});

					$('#advanced-search-button').click(function() {
						currentInstance.callSearch();
					});
				}

				this.callSearch = function() {
					saveSearchedCriteria();

					fieldPanel.updatePanelData();
					filterPanel.clear();

					searchHandler.refresh({
						type : "ADVANCED"
					});
					currentInstance.hidePanel();
				}

				this.getFieldValueMap = function() {
					var fieldValues = new Object();

					for ( var i = 0; i < currentInstance.criteriaFields.length; ++i) {
						var criteriaField = currentInstance.criteriaFields[i];
						fieldValues[criteriaField.fieldId] = criteriaField
								.getLabelledValues();
					}

					return fieldValues;
				}

				function saveSearchedCriteria() {
					for ( var i = 0; i < currentInstance.criteriaFields.length; ++i) {
						currentInstance.criteriaFields[i]
								.saveSearchCriteriaValues();
					}
				}

				function getAdvancedSearchPanelContainer() {
					return $('#'
							+ currentInstance.advancedSearchPanelContainerId);
				}

				function setAdvancedSearchLinkText(value) {
					$("#advancedSearch").text(value);
				}

				function  setAdvancedSearchLinkAriaExpandedValue(value) {
                    $("#advancedSearch").attr("aria-expanded", value);
                }

				function setCriteriaContainerZIndexValue(value) {
					$('#criteria-container').css('z-index', value);
				}
				function setMainsectionZIndexValue(value) {
					$('.mainsection').css('z-index', value);
				}
				function setHeaderPanelZIndexValue(value) {
					$('.headersection').css('z-index', value);
				}

				function addCriteriaContainerRelativePosition() {
					$('#criteria-container').css('position', 'relative');
				}
				function removeCriteriaContainerRelativePosition() {
					$('#criteria-container').css('position', '');
				}

				function findCriteriaByFieldId(fieldId) {
					for ( var i = 0; i < currentInstance.criteriaFields.length; ++i) {
						var criteriaField = currentInstance.criteriaFields[i];
						if (criteriaField.fieldId == fieldId) {
							return criteriaField;
						}
					}
					return null;
				}

				this.filterRemoved = function(fieldId, filterValue) {
					var criteria = findCriteriaByFieldId(fieldId);
					if (criteria) {
						criteria.deselect(filterValue);
					}
				}

				searchHandler
						.registerRefreshListener(this);
				searchHandler.registerDataProvider(
						'advancedSearchFiltersSelectionParam', this);

				$(document).ready(
						function() {
							currentInstance.registerClickHandlers();
							filterTopPanel
									.registerFilterList(currentInstance);
						});
			}
			// end-of-class-definition

			return AdvancedSearchPanel;

		});