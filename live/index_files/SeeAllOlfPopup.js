define(
		[ 'jquery', 'fs/FiltersSelectionHolder', 'fs/FiltersSelectionPanel',
				'fs/ResourcesHandler', 'fs/SeeAllOlfTable' ],
		function($, FiltersSelectionHolder, FiltersSelectionPanel,
				ResourcesHandler, SeeAllOlfTable) {

			function SeeAllOlfPopup(filter, searchHandler, popupManager) {
				this.filter = filter;
				this.opened = false;

				var self = this;

				this.filtersSelectionHolder = new FiltersSelectionHolder();
				this.filtersSelectionPanel = new FiltersSelectionPanel();

				this.addFilterEvent = "addFilterEvent";
				this.removeFilterEvent = "removeFilterEvent";
				this.selectionLimitEvent = "selectionLimitEvent";

				this.SELECTION_LIMIT = 20;

				// IDs which refers to seeAllOlfPanel.jsp
				this.panelId = 'seeAllOlfPanel';
				this.titleId = 'title';
				this.showingWhatId = 'showingWhat';
				this.showingInfoId = 'showingInfo';
				this.tableId = 'dataTable';
				this.tableDivId = 'table';
				this.cancelActionId = 'cancelAction';
				this.addActionId = 'addAction';

				this.selectionLimitDialogId = 'selectionLimitDialog';
				this.selectionLimitMessageId = 'selectionLimitMessage';
				this.selectionLimitOKId = 'selectionLimitOK';
				this.dialogOverlayId = 'dialogOverlay';

				this.table = null;

				this.init = function() {
					getPopupContainer().find('#' + this.cancelActionId).off(
							'click').click(function() {
						self.closePopup();
					});

					getPopupContainer().find('#' + this.addActionId).off(
							'click').click(function() {
						self.callSearch();
						self.closePopup();
					});

					$(document).on(this.selectionLimitEvent,
							function(event, selection) {
								self.openMessageDialog();
							});

					getPopupContainer().find('#' + this.selectionLimitOKId)
							.click(function() {
								self.closeMessageDialog();
							});
				}

				this.openMessageDialog = function() {
					var container = getPopupContainer();

					var overlay = $('#' + this.dialogOverlayId);
					overlay.show();
					overlay.on('click', function(event) {
						event.stopPropagation();
					});
					overlay.css({
						width : $(container).width(),
						height : $(container).height()
					});
					overlay.css('z-index', container.css('z-index') + 10);
					overlay.offset($(container).offset());

					var dialog = $('#' + this.panelId).find(
							'#' + this.selectionLimitDialogId);
					dialog.find('#' + this.selectionLimitMessageId).text(
							ResourcesHandler.getResource(
									"seeAllOlf.selectionLimitMsg",
									self.SELECTION_LIMIT));
					dialog
							.css({
								"position" : "absolute",
								"top" : ((($(container).height() - dialog
										.outerHeight()) / 2)
										+ $(container).scrollTop() + "px"),
								"left" : ((($(container).width() - dialog
										.outerWidth()) / 2)
										+ $(container).scrollLeft() + "px")
							});

					dialog.show();
					dialog.css('z-index', overlay.css('z-index') + 10);
				}

				this.closeMessageDialog = function() {
					var overlay = $('#' + this.dialogOverlayId);
					overlay.hide();
					overlay.off('click');

					var dialog = $('#' + this.panelId).find(
							'#' + this.selectionLimitDialogId);
					dialog.hide();
				}

				this.openPopup = function() {
					if (!this.opened && this.filter != null) {
						popupManager.openFixedPositionedPopup(this, false);
					}
				}

				this.closePopup = function() {
					if (this.opened) {
						popupManager.closePopup(this);
					}
				}

				this.show = function() {
					getPopupContainer().show();
					this.setState();
		this.updatePosition();
					this.opened = true;
				}

    this.keydown = function(functionPointer){
        getPopupContainer().keydown(functionPointer);
				}

				this.attr = function(name, value) {
					getPopupContainer().attr(name, value);
				}

				this.find = function(what) {
					return getPopupContainer().find(what);

				}

				this.hide = function() {
					this.filtersSelectionHolder.off(this.addFilterEvent,
							this.removeFilterEvent);
					this.filtersSelectionPanel.off(this.addFilterEvent,
							this.removeFilterEvent, this.selectionLimitEvent);

					if (this.table != null) {
						this.table.off(this.addFilterEvent,
								this.removeFilterEvent,
								this.selectionLimitEvent);
						this.table.destroyTable();
						this.table = null;
					}
					$(document).off(this.selectionLimitEvent);

					getPopupContainer().hide();
					this.opened = false;
				}

				this.css = function(property, value) {
					getPopupContainer().css(property, value);
				}

				this.zIndex = function() {
					return getPopupContainer().css('zIndex');
				}

				function getPopupContainer() {
					return $('#' + self.panelId);
				}

	this.updatePosition = function () {
					var popupWindow = getPopupContainer();
					var container = window;

					popupWindow.css({
						"position" : "absolute",
						"top" : ((($(container).height() - popupWindow
								.outerHeight()) / 2)
								+ $(container).scrollTop() + "px"),
						"left" : ((($(container).width() - popupWindow
								.outerWidth()) / 2)
								+ $(container).scrollLeft() + "px")
					});
				}

				this.callSearch = function() {
					this.updateFilter();
				}

				this.setState = function() {
					this.setTitle();
					this.setTable();

					this.filtersSelectionPanel.init(this.addFilterEvent,
							this.removeFilterEvent, this.selectionLimitEvent);
					this.filtersSelectionHolder.init(this.filter,
							this.addFilterEvent, this.removeFilterEvent,
							this.SELECTION_LIMIT, this.selectionLimitEvent);
				}

				this.boldText = function(text) {
					return "<b>" + text + "</b>";
				}

				this.setTitle = function() {
					var showing_what = getPopupContainer().find(
							'#' + this.showingWhatId);
					var showing_info = getPopupContainer().find(
							'#' + this.showingInfoId);

					var boldCriteriaLabel = this
							.boldText(this.filter.criteriaLabel);

					showing_info.text(ResourcesHandler.getResource(
							"seeAllOlf.showingInfo", this.SELECTION_LIMIT));

					switch (this.filter.id) {
					case 'LOCATION':
						if (this.filter.criteriaLabel != null) {
							showing_what.html(ResourcesHandler.getResource(
									"seeAllOlf.showingLocationsIn",
									boldCriteriaLabel));
						} else {
							showing_what.text(ResourcesHandler
									.getResource("seeAllOlf.showingLocations"));
						}
						break;
					case 'JOB_FIELD':
						if (this.filter.criteriaLabel != null) {
							showing_what.html(ResourcesHandler.getResource(
									"seeAllOlf.showingJobFieldsIn",
									boldCriteriaLabel));
						} else {
							showing_what.text(ResourcesHandler
									.getResource("seeAllOlf.showingJobFields"));
						}
						break;
					case 'ORGANIZATION':
						if (this.filter.criteriaLabel != null) {
							showing_what.html(ResourcesHandler.getResource(
									"seeAllOlf.showingOrganizationsIn",
									boldCriteriaLabel));
						} else {
							showing_what
									.text(ResourcesHandler
											.getResource("seeAllOlf.showingOrganizations"));
						}
						break;
					}
				}

				this.setTable = function() {
					this.table = new SeeAllOlfTable(this, searchHandler);
				}

				this.updateFilter = function() {
					if (this.filtersSelectionHolder.isSelectionChanged()) {
						this.filter.clearSelection();
						var selections = this.filtersSelectionHolder
								.getCurrentSelection();

						$.each(selections, function(index, item) {
							self.filter.addSelection(item.itemId);
						});

						self.filter.callSearch();
					}
				}

				this.showProgress = function() {
					var progress = $('#popupProgressIndicator');
					progress.width(progress.parent().outerWidth());
					progress.height(progress.parent().outerHeight());
					progress.offset(progress.parent().offset());
				};

				this.hideProgress = function() {
					$('#popupProgressIndicator').width(0);
				};

    this.makeExpandedPopup = function() {
        getPopupContainer().removeClass('see-all-olf-panel').addClass('see-all-olf-panel-extended');
        this.updatePosition();
    }

    this.makeContractedPopup = function() {
        getPopupContainer().removeClass('see-all-olf-panel-extended').addClass('see-all-olf-panel');
        this.updatePosition();
    }

				this.init();

			}
			// end-of-class-definition

			return SeeAllOlfPopup;
		});