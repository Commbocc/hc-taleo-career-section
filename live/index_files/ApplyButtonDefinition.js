define([ 'jquery', 'fs/URLBuilder' ], function($, URLBuilder) {

	function ApplyButtonDefinition(applyText, finishDraftSubmissionText,
			viewEditSubmissionText, reApplyText, className) {
		this.applyText = applyText;
		this.finishDraftSubmissionText = finishDraftSubmissionText;
		this.viewEditSubmission = viewEditSubmissionText;
		this.reApplyText = reApplyText;
		this.className = className;

		this.getHref = function(jobRow) {
			var resultHref;
			if (jobRow.toReApply) {
				resultHref = URLBuilder
						.getReApplyButtonURL(jobRow.jobId);
			} else {
				resultHref = URLBuilder
						.getApplyButtonURL(jobRow.jobId);
			}
			return resultHref;
		};

		this.createApplyButton = function(isUserLoggedIn, job) {
			var href = this.getHref(job);
			var applyButton = $('<a>').addClass('result-list-button').attr(
					'href', href).attr('role', 'button');

			applyButton.keypress(function(event) {
				var evt = event || window.event;
				var code = evt.which || evt.keyCode;

				if (code == 32 || code == 13) {
					evt.preventDefault();
					window.location.href = href;
				}
			});

			if (isUserLoggedIn && job.toReApply) {
				applyButton.text(this.reApplyText);
			} else if (isUserLoggedIn && job.draft) {
				applyButton.text(this.finishDraftSubmissionText);
			} else if (isUserLoggedIn && job.alreadyAppliedOn) {
				applyButton.text(this.viewEditSubmission);
			} else {
				applyButton.text(this.applyText);
			}

			return applyButton;
		}
	}
	// end-of-class-definition

	return ApplyButtonDefinition;

});