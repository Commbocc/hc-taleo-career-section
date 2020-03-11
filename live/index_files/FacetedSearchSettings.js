define(
		[ 'module' ],
		function(module) {

			console.log('creating FacetedSearchSettings');

			function FacetedSearchSettings(config) {
				this.addToJobCartEnabled = config.addToJobCartLinkDisplayed;
				this.addThisEnabled = config.addThisEnabled;
				this.jobCartItemCount = config.jobCartItemCount;
				this.urgentJobDisplayed = config.urgentJobDisplayed;

				this.queryString = config.queryString;
				this.resourcesMapAsJSON = config.resourcesMapAsJSON;
				this.versionNumber = config.versionNumber;
				this.lang = config.lang;
				this.portalNo = config.portalNo;
				this.urlOrigin = config.urlOrigin;
				this.urlCode = config.urlCode;
				this.src = config.src;

				this.agencyPortal = config.agencyPortal;
				this.applicationFlowSet = config.applicationFlowSet;
				this.userSignedIn = config.userSignedIn;
				this.multilineLayoutAsJSONArray = config.multilineLayoutAsJSONArray;
				this.defaultOrder = config.defaultOrder;
				this.defaultSortingField = config.defaultSortingField;
				this.filterPanelOffLayout = config.filterPanelOffLayout;
				this.searchOnMultilingualRequisition = config.searchOnMultilingualRequisition;
				this.saveSearchPanelDisplayed = config.saveSearchPanelDisplayed;

				this.sessionCSRFTokenName = config.sessionCSRFTokenName;
				this.sessionCSRFToken = config.sessionCSRFToken;
				this.timeoutInterval = config.timeoutInterval;
				this.warningInterval = config.warningInterval;
				
				this.criteriaFieldsToRegister = config.criteriaFieldsToRegister;

                this.requisitionDescriptionPageDisplayed = config.requisitionDescriptionPageDisplayed;

                this.logoutServletURL = config.logoutServletURL;

				this.multilineViewSetAsDefault = config.multilineViewSetAsDefault;
			}
			// end-of-class-definition

			return new FacetedSearchSettings(module.config());
		});