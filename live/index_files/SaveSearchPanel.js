define([ 'jquery', 'fs/QueryStringParser', 'fs/URLBuilder', 'fs/FacetedSearchSettings' ,'fs/PopupManager'], function($, QueryStringParser,
		URLBuilder, FacetedSearchSettings, PopupManager) {

	function SaveSearchPanel(htmlId, showButtonHtmlId, isUserSignedIn, searchHandler) {
		this.htmlId = htmlId;
		this.showButtonHtmlId = showButtonHtmlId;
		this.confirmed = false;
		this.queryStringParser = new QueryStringParser();
		this.paramName = 'sasNo';
		this.isUserSignedIn = isUserSignedIn;
		this.MAX_SEARCH_NAME_LENGTH = 200;

		this.init = function(queryString) {
			var saveSearchPanel = this;

			if (this.isUserSignedIn) {
				$('#' + this.showButtonHtmlId).click(function() {
					saveSearchPanel.showPanel();
				});
			}

			var panel = $('#' + this.htmlId);

			panel.find('#closeButton, #saveSearchCancel').click(function() {
				saveSearchPanel.hidePanel();
			});

			panel.find('#saveSearchSave').click(function() {
				if (!saveSearchPanel.validateFilterName()) {
					saveSearchPanel.handleNoNameError();
					return;
				}

				if (saveSearchPanel.isUserSignedIn) {
					saveSearchPanel.saveSearch();
				}
			});

			panel.find('#confirmSaveSearch').click(function() {
				saveSearchPanel.confirm();
			});

			panel.find('#cancelSaveSearch').click(function() {
				saveSearchPanel.cancelConfirmation();
			});

			panel.find('#saveSearchErrorOk').click(function() {
				saveSearchPanel.closePopup('saveSearchError');
			});

			panel.find('#saveSearchNoNameErrorOk').click(function() {
				saveSearchPanel.closePopup('saveSearchNoNameError');
			});

			panel.find('#saveSearchLengthErrorOk').click(function() {
				saveSearchPanel.closePopup('saveSearchLengthError');
			});

			var params = saveSearchPanel.queryStringParser.parse(queryString);
			if (params[saveSearchPanel.paramName]) {
				saveSearchPanel.showPanel();
				saveSearchPanel
						.getSavedSearchName(params[saveSearchPanel.paramName]);
			} else {
				saveSearchPanel.hidePanel();
			}
		}

		this.refresh = function(event) {
			if (!this.isUserSignedIn) {
				$('#' + this.showButtonHtmlId).attr(
						'href',
						URLBuilder
								.getSignInURLWithRestoreParam());
			}
		}

		this.showPanel = function() {
			$('#showSaveSearch').attr("aria-expanded", "true");
			$('#' + this.htmlId).show(100,'', function(){
				$("#saveSearchTitle").focus();
			});

		}

		this.hidePanel = function() {
			$('#showSaveSearch').attr("aria-expanded", "false");
			$('#' + this.htmlId).hide(100);
		}

		this.saveSearchCallback = function(data) {
			this.confirmed = false;

			if (data.saveSearchResult == 'SUCCESS') {
				this.handleSuccess();
			} else if (data.saveSearchResult == 'CONFIRM') {
				this.handleConfirm();
			} else if (data.saveSearchResult == 'ERROR') {
				this.handleError();
			} else if (data.saveSearchResult == 'NO_NAME_ERROR') {
				this.handleNoNameError();
			} else if (data.saveSearchResult == 'LENGTH_ERROR') {
				this.handleLengthError();
			}
		}

		this.savedSearchNameCallback = function(data) {
			$('#' + this.htmlId).find('#saveSearchTitle').val(data);
		}

		this.handleSuccess = function() {
			this.hidePanel();
		}

		this.handleConfirm = function() {
			this.openPopup('overwriteSearchConfirmation');
		}

		this.handleError = function() {
			this.openPopup('saveSearchError');
		}

		this.handleNoNameError = function() {
			this.openPopup('saveSearchNoNameError');
		}

		this.handleLengthError = function() {
			this.openPopup('saveSearchLengthError');
		}

		this.confirm = function() {
			this.confirmed = true;
			this.closePopup('overwriteSearchConfirmation', false);
			this.saveSearch();
		}

		this.cancelConfirmation = function() {
			this.confirmed = false;
			this.closePopup('overwriteSearchConfirmation');
		}

		this.openPopup = function(popupId) {
			PopupManager.openPopup($('#' + this.htmlId)
					.find('#' + popupId), $('#' + this.htmlId).find(
					('#saveSearchSave')));
		}

		this.closePopup = function(popupId, restoreFocus) {
			PopupManager.closePopup($('#' + this.htmlId)
					.find('#' + popupId), restoreFocus);
		}

		this.saveSearch = function() {
			var currentInstance = this;
			var name = this.getSaveSearchName();

			searchHandler.saveSearch(name,
					this.confirmed, function(data) {
						currentInstance.saveSearchCallback(data);
					});

		}

		this.validateFilterName = function() {
			if (this.getSaveSearchName() === "") {
				return false;
			}
			return true;
		}

		this.getSaveSearchName = function() {
			return $('#' + this.htmlId).find('#saveSearchTitle').val();
		}

		this.getSavedSearchName = function(id) {
			var currentInstance = this;
			$.ajax({
				type : 'POST',
				url : '/careersection/rest/savesearch/sasname?portal='
						+ FacetedSearchSettings.portalNo,
				data : id,
				dataType : 'json',
				contentType : 'application/json',
				success : function(data) {
					currentInstance.savedSearchNameCallback(data.name);
				},
				error : function(a, b, c) {
					searchHandler
							.displayUnAvailablePage();
				}
			});
		}

		this.setUrls = function() {
			$('#' + this.htmlId).find('.acccess-save-searches').attr('href',
					URLBuilder.getSaveSearch());
		}
	}
	// end-of-class-definition

	return SaveSearchPanel;

});
