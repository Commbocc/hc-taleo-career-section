define(
		[ 'jquery', 'fs/URLBuilder', 'fs/VersionHolder',
				'fs/FacetedSearchSettings' ],
		function($, URLBuilder, VersionHolder, FacetedSearchSettings) {

			var addthis_config = {
				ui_508_compilant : true,
				data_use_cookies : false,
				services_exclude : "email",
				data_track_addressbar : false,
				data_track_clickback : false,
				services_compact : "linkedin, twitter, facebook, google, myspace, bebo, friendster, gmail, yahoomail, mailto, more"
			};

			function AddThisButtonDefinition(shareRes, commonJobDesc) {
				this.shareRes = shareRes;
				this.commonJobDesc = commonJobDesc;

				this.createAddThisButton = function(job) {
					if (typeof (addthis) != "undefined" && addthis != null) {
						var buttonId = '_cs_addthis_resultListPanel_'
								+ job.jobId;

						var a = $("<a>").attr('id', buttonId);
						a.addClass('addthis_button_compact');
						a
								.append('<img id="shareImg'
										+ job.jobId
										+ '" src='
										+ VersionHolder
												.getResourceUri("/images/ico-share-16.png")
										+ ' alt="" />');
						a.attr('addthis:url', unescape(URLBuilder
								.getURLToShare(job.contestNo)));
						a.attr('addthis:title', job.column[job.linkedColumn]);
						a.attr('addthis:description', commonJobDesc);
						a.attr('addthis:ui_language',
								FacetedSearchSettings.lang);
						a.attr('title', shareRes)

						var span = $('<span>').text(shareRes);
						a.append(span);

						return a;
					}
				}

			}
			// end-of-class-definition

			return AddThisButtonDefinition;

		});