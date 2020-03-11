define(
		[ 'jquery','fs/PopupManager'],
		function($, PopupManager) {

			function SessionManager(warninig, warnID, warnBtnID, timeout,
					timeoutID, timeoutBtnID, sessionCSRFTokenName,
					sessionCSRFToken, isSignedIn) {

				this.warningInterval = timeout - warninig;
				this.warningID = warnID;
				this.warningBtnID = warnBtnID;
				this.timeoutInterval = timeout;
				this.timeoutID = timeoutID;
				this.timeoutBtnID = timeoutBtnID;
				this.sessionCSRFTokenName = sessionCSRFTokenName;
				this.sessionCSRFToken = sessionCSRFToken;
				this.isSignedIn = isSignedIn;
				this.lastRefreshTime;
				this.isWarningVisable;
				this.checkerID = -1;
				var self = this;

				this.init = function() {
					if (this.isSignedIn) {
						this.resetLastRefresh();
						this.setCheckingTimer();
						this.isWarningVisable = false;

						var sessionManager = this;

						$('#' + this.warningBtnID).click(function(event) {
							event.stopPropagation();
							sessionManager.onReset();
						});

						$('#' + this.timeoutBtnID).click(function() {
							sessionManager.onTimeoutOK();
						});
					}
				}

				this.onReset = function() {
					this.hideWarning();
					this.resetLastRefresh();
				}

				this.onTimeoutOK = function() {
					window.location.reload();
				}

				this.signOut = function() {

					var signoutUrl = "/careersection/UIMessageReceiver.jss?msg=invalidateSession&"
							+ this.sessionCSRFTokenName
							+ "="
							+ encodeURIComponent(this.sessionCSRFToken);

					$.ajax({
						url : signoutUrl
					});
				}

				this.setCheckingTimer = function() {
					if (this.checkerID != -1) {
						window.clearTimeout(this.checkerID);
					}
					this.checkerID = setTimeout(function() {
						self.checkExpireTime();
					}, 5000);
				}

				this.checkExpireTime = function() {
					if (sessionExpired()) {
						this.hideWarning();
						this.signOut();
						this.displayTimeout();
						return;
					}
					if (shouldDisplayWarning()) {
						this.displayWarning();
					}
					this.setCheckingTimer();
				}

				function sessionExpired() {
					return self.lastRefreshTime + self.timeoutInterval < new Date()
							.getTime();
				}

				function shouldDisplayWarning() {
					if (self.isWarningVisable) {
						return false;
					}

					if (self.warningInterval <= 0) {
						return false;
					}

					return self.lastRefreshTime + self.warningInterval < new Date()
							.getTime();
				}

				this.resetLastRefresh = function() {
					this.lastRefreshTime = new Date().getTime();
				}

				this.displayTimeout = function() {
					PopupManager.openPopup($('#'
							+ this.timeoutID));
				}

				this.displayWarning = function() {
					PopupManager.openPopup($('#'
							+ this.warningID));
					this.isWarningVisable = true;
				}

				this.hideWarning = function() {
					PopupManager.closePopup($('#'
							+ this.warningID));
					this.isWarningVisable = false;
				}

			}
			// end-of-class-definition

			return SessionManager;

		});
