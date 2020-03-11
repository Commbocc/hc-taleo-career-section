define([ 'jquery', 'fs/URLBuilder', 
		'fs/list/IconsCellRenderer' , 'fs/FacetedSearchSettings','fs/PopupManager'], function($, URLBuilder,
		 IconsCellRenderer, FacetedSearchSettings, PopupManager) {

	function AddToJobCartButtonDefinition(text, className) {
		this.text = text;
		this.className = className;
		
		this.addClickHandler = function(actionsCellRenderer, job,
				isUserLoggedIn) {
			if (isUserLoggedIn) {
				$.ajax({
					type : 'POST',
					url : '/careersection/rest/jobboard/addToJobCart?portal='
							+ FacetedSearchSettings.portalNo,
					data : job.jobId,
					dataType : 'json',
					contentType : 'application/json',
					success : function(data) {
						if (data.error) {
							PopupManager.openPopup(
									$('#addToJobCartError'), $('#job'
											+ job.jobId));
						} else {
                        $('#jobcart-count').text(data.jobCartItemsCount);
							setAddedToJobCartTrue(job);
							new IconsCellRenderer().refreshIconsCell(job);
							actionsCellRenderer.disableAddToJobCartLink(job);
						}
					},
					error : function(a, b, c) {
					}
				});
			} else {
				window.location.replace(URLBuilder
						.getSignInURL());
			}
		};

		this.createAddToJobCartLink = function(actionsCellRenderer,
				isUserLoggedIn, job) {
			var thisButtonDefinition = this;
			var link = $('<a>').attr('id', 'add-to-jobcart' + job.jobId).attr(
					'href', '#').attr("title", text).click(
					function(event) {
						thisButtonDefinition.addClickHandler(
								actionsCellRenderer, job, isUserLoggedIn);
					}).text(text);
			if (job.addedToJobCart || job.draft || job.alreadyAppliedOn) {
				link.addClass('hidden-element');
			}
			return link;
		}

		this.createAddToJobCartDisabledLink = function(isUserLoggedIn, job) {
			var disabledLink = $('<span>').attr('id',
					'add-to-jobcart-disabled' + job.jobId).attr('tabindex', 0)
					.attr('aria-disabled', 'true').html(text);

			if (!job.addedToJobCart && !job.draft && !job.alreadyAppliedOn) {
				disabledLink.addClass('hidden-element');
			}
			return disabledLink;
		}

		function setAddedToJobCartTrue(job) {
			job.addedToJobCart = true;
		}
	}
	// end-of-class-definition

	return AddToJobCartButtonDefinition;

});