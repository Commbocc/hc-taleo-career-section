define([ 'jquery', 'fs/URLBuilder', 'fs/DropdownMenuUtils',
		'fs/DropDownMenuKeyboardUtils' ], function($, URLBuilder,
		DropdownMenuUtils, DropDownMenuKeyboardUtils) {

	function HeaderPanel(htmlId, isUserSignedIn, initialJobCartItemsCount,
			firstPageOnJobPageTab) {
		this.htmlId = htmlId;
		this.isUserSignedIn;
		this.initialJobCartItemsCount = initialJobCartItemsCount;

		this.init = function() {
			var headerPanel = this;
			headerPanel.setURLs();
			headerPanel.setInitialJobCartItemsCount();
			headerPanel.addDropdownMenu();
		}

		this.setURLs = function() {
			
			$('#' + htmlId).find('#account-link').attr('href',
					URLBuilder.getAccountURL());
			$('#' + htmlId).find('#profile-link').attr('href',
					URLBuilder.getUserProfileURL());
			$('#' + htmlId).find('#searches-link').attr('href',
					URLBuilder.getSavedSearchesURL());
			$('#' + htmlId).find('#referrals-link').attr('href',
					URLBuilder.getReferralsURL());
			$('#' + htmlId).find('#matched-jobs-link').attr('href',
					URLBuilder.getMatchedJobsURL());
			$('#' + htmlId).find('#jobcart-link').attr('href',
					URLBuilder.getJobCartURL());
			$('#' + htmlId).find('#signout-link').attr('href',
					URLBuilder.getSignOutURL());
			$('#' + htmlId).find('#signin-link').attr('href',
					URLBuilder.getSignInURL());
			$('#' + htmlId).find('#jobsearch-link').attr('href',
					URLBuilder.getJobSearchURL());
			$('#' + htmlId).find('#processes-link').attr('href',
					URLBuilder.getProcessesURL());
			$('#' + htmlId).find('#offers-link').attr('href',
					URLBuilder.getOffersURL());
			$('#' + htmlId).find('#messages-link').attr('href',
					URLBuilder.getMessagesURL());
			$('#' + htmlId).find('#jobpage-link').attr('href',
					URLBuilder.getJobPageURL());
		}

		this.setInitialJobCartItemsCount = function() {
        $('#' + htmlId).find('#jobcart-count').text(initialJobCartItemsCount);
		}

		this.addDropdownMenu = function() {
			var dropdownMenuUtils = new DropdownMenuUtils(
					'toggle-button-header', 'dropdown-list-header');
			dropdownMenuUtils.addClickOnToggleButtonAndDroplistHandlers();
			dropdownMenuUtils.registerCloseMenuHandlers();

			var dropdownKeyboardActions = new DropDownMenuKeyboardUtils(
					'dropdown-list-header');
			dropdownKeyboardActions.registerKeyboardNavigationActions();
		}
	}
	// end-of-class-definition

	return HeaderPanel;

});
