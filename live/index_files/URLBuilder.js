define(['fs/FacetedSearchSettings','fs/DateUtils'], function(FacetedSearchSettings, DateUtils){

	console.log('creating URLBuilder');
	
	function URLBuilder() {
		QUESTION_MARK = '?';
		AMPERSAND = '&';
		EQUALS = '=';
		SLASH = '/';
		CS_BEGIN_PATH = '/careersection/';
	
		this.getSavedSearchesURL = function() {
			return getUrlToFtlPage('mysearches.ftl') + getSource(QUESTION_MARK);
		}
	
		this.getReferralsURL = function() {
			return getUrlToFtlPage('myreferrals.ftl') + getSource(QUESTION_MARK);
		}
	
		this.getJobCartURL = function() {
			return getUrlToFtlPage('mycart.ftl') + getSource(QUESTION_MARK);
		}
	
		this.getJobSearchURL = function() {
			return getUrlToFtlPage('jobsearch.ftl') + getSource(QUESTION_MARK);
		}
		
		this.getJobSearchURLWithoutParam = function() {
			return getUrlToFtlPage('jobsearch.ftl');
		}
	
		this.getJobPageURL = function() {
			return getUrlToFtlPage('mysubmissions.ftl') + getSource(QUESTION_MARK);
		}
		
		this.getMatchedJobsURL = function() {
			return getUrlToFtlPage('myjobs.ftl') + getSource(QUESTION_MARK);
		}
		
		this.getJobDetailURL = function(contestNo) {
			return jobDetailURL(getUrlToFtlPage('jobdetail.ftl'), contestNo);
		}
	
		this.getProcessesURL = function() {
			return addCSBeginPath('myprocesses.ftl') + QUESTION_MARK
					+ getPortalParam() + getSource(AMPERSAND);
		}
	
		this.getOffersURL = function() {
			return addCSBeginPath('careersection/offers/myOfferListView.jsf')
					+ QUESTION_MARK + getPortalParam() + getSource(AMPERSAND);
		}
		
		this.getAccountURL = function() {
			return addCSBeginPath('careersection/candidateportal/myaccount/myAccountView.jsf')
					+ QUESTION_MARK + getPortalParam() + getSource(AMPERSAND);
		}
		
		this.getMessagesURL = function() {
			return addCSBeginPath('messages.jss') + QUESTION_MARK + getPortalParam() + getSource(AMPERSAND);
		}
	
		this.getSignOutURL = function() {
			return FacetedSearchSettings.logoutServletURL + AMPERSAND + getIsOnLogoutPageParam();
		}
	
		this.getSignInURL = function() {
			return getFacetedJobSearchURL() + QUESTION_MARK
					+ getParameterForcingLogin() + getSource(AMPERSAND) ;
		}
	
		this.getSignInURLWithRestoreParam = function() {
			return this.getSignInURL() + AMPERSAND + getRestoreParam();
		}
	
		this.getApplyButtonURL = function(reqNoValue) {
			return getApplicationURL() + QUESTION_MARK
					+ getTypeParam(1) + AMPERSAND + getLangParam(FacetedSearchSettings.lang) + AMPERSAND
					+ getPortalParam() + AMPERSAND + getReqNoParam(reqNoValue) + getSource(AMPERSAND);
		}
	
		this.getReApplyButtonURL = function(reqNoValue) {
			return getApplicationURL() + QUESTION_MARK
					+ getTypeParam(1) + AMPERSAND + getLangParam(FacetedSearchSettings.lang) + AMPERSAND
					+ getPortalParam() + AMPERSAND + getReqNoParam(reqNoValue) 
					+ AMPERSAND + getActionParam('reapply')+ getSource(AMPERSAND);
		}
		
		this.getReferCandidateButtonURL = function(reqNoValue) {
			return getApplicationURL() + QUESTION_MARK
					+ getTypeParam(3) + AMPERSAND + getLangParam(FacetedSearchSettings.lang) + AMPERSAND
					+ getPortalParam() + AMPERSAND + getReqNoParam(reqNoValue)+ getSource(AMPERSAND);
		}
	
		this.getURLToShare = function(contestNo) {
			return FacetedSearchSettings.urlOrigin
				+ getJobDetailURLNoPortalCode(contestNo)
				+ AMPERSAND + getLangParam(FacetedSearchSettings.lang);
		}
		
		this.getUserProfileURL = function() {
			return getProfileURL(1);
		}
		
		this.getReferFriendProfileURL = function() {
			return getProfileURL(2);
		}
		
		this.getReferCandidateProfileURL = function() {
			return getProfileURL(3);
		}
		
		this.getAdvancedSearch	= function() {
			return getUrlToFtlPage('moresearch.ftl') + getSource(QUESTION_MARK);
		}
		
		this.getSaveSearch = function() {
			return getUrlToFtlPage('mysearches.ftl') + getSource(QUESTION_MARK);
		}
		
		this.getReqSource = function() {
			return getSource(AMPERSAND);
		}
		
		function getFacetedJobSearchURL() {
			return getUrlToFtlPage('jobsearch.ftl');
		}
			
		function getProfileURL(type) {
			return addCSBeginPath('profile.jss') + QUESTION_MARK
					+ getTypeParam(type) + AMPERSAND + getPortalParam()+ getSource(AMPERSAND);
		}

		function jobDetailURL(path, contestNo) {
			return path + QUESTION_MARK
				+ getJobParam(contestNo) + getSource(AMPERSAND)
				+ getTimeZone(AMPERSAND)
				+getTimeZoneName(AMPERSAND);
		}

		function getTimeZone(separator) {
			return separator + 'tz' + EQUALS + encodeURIComponent(new DateUtils().getTimeZone());
		}

        function getTimeZoneName(separator) {
            return separator + 'tzname' + EQUALS + encodeURIComponent(new DateUtils().getTimeZoneName());
        }

		function getJobDetailURLNoPortalCode (contestNo) {
			return jobDetailURL(getUrlToFtlPageWithoutPortalCode('jobdetail.ftl'), contestNo);
		}
	
		function getUrlToFtlPage(page) {
			return addCSBeginPath(FacetedSearchSettings.urlCode + SLASH + page);
		}
	
		function getUrlToFtlPageWithoutPortalCode(page) {
			return addCSBeginPath(page);
		}
	
		function getApplicationURL() {
			return addCSBeginPath('application.jss');
		}
		
		function addCSBeginPath(url) {
			return CS_BEGIN_PATH + url; 
		}
			
		function getJobParam(jobValue) {
			return getNameAndValuePair('job', jobValue);
		}
	
		function getTypeParam(typeValue) {
			return getNameAndValuePair('type', typeValue);
		}
	
		function getActionParam(actionValue) {
			return getNameAndValuePair('action', actionValue);
		}
	
		function getLangParam(langValue) {
			return getNameAndValuePair('lang', langValue);
		}
	
		function getReqNoParam(jobId) {
			return getNameAndValuePair('reqNo', jobId);
		}
	
		function getPortalParam() {
			return getNameAndValuePair('portal', FacetedSearchSettings.portalNo);
		}

		function getIsOnLogoutPageParam() {
			return getNameAndValuePair('isOnLogoutPage', true);
		}
		
		function getSource(separator) {
			var src = FacetedSearchSettings.src;
			if (src) {
				return separator + src;
			}
			return "";
		}
		
		function getParameterForcingLogin() {
			return getNameAndValuePair('ftlcompclass', 'LoginComponent');
		}
	
		function getRestoreParam() {
			return getNameAndValuePair('restore', 'true');
		}
	
		function getNameAndValuePair(name, value) {
			return name + EQUALS + value;
		}
	}
	//end-of-class-definition
	
	return new URLBuilder();
	
});
