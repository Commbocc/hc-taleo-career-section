define([ 'jquery', 'fs/URLBuilder','fs/PopupManager'],
		function($, URLBuilder, PopupManager) {

			function HelpManager(htmlId, listContainerId, listTopPanelId) {

				var PROFILE_URL = URLBuilder
						.getUserProfileURL();
				var REFER_FRIEND_URL = URLBuilder
						.getReferFriendProfileURL();
				var REFER_CANDIDATE_URL = URLBuilder
						.getReferCandidateProfileURL();
				this.opened = false;

				var self = this;

				this.init = function() {

					$('#' + listTopPanelId).find("#help").click(function() {
						self.openHelpPanel();
					});

					$('#' + htmlId).find("#closeHelp").click(function() {
						self.closeHelpPanel();
					});

					setURLs();
				}

				this.positionPanel = function() {
					var helpPanel = $("#" + htmlId);
					var listTopPanel = $("#" + listTopPanelId);

					var offset = listTopPanel.offset();
					helpPanel.css("top", offset.top);
					helpPanel.css("left", offset.left
							+ listTopPanel.outerWidth()
							- helpPanel.outerWidth());

				}

				this.openHelpPanel = function() {
					var dialog = $("#" + htmlId);
					PopupManager.setLastActiveElement(
							dialog, $(':focus'));
					PopupManager.openFixedPositionedPopup(
							dialog, true, true);

					this.positionPanel();
					this.opened = true;
				}

				this.closeHelpPanel = function() {
					PopupManager
							.closePopup($("#" + htmlId));
					this.opened = false;

				}

				setURLs = function() {
					$('#' + htmlId).find('#profile-link').attr('href',
							PROFILE_URL);
					$('#' + htmlId).find('#refer-friend-link').attr('href',
							REFER_FRIEND_URL);
					$('#' + htmlId).find('#refer-candidate-link').attr('href',
							REFER_CANDIDATE_URL);
				}
			}
			// end-of-class-definition

			return HelpManager;

		});