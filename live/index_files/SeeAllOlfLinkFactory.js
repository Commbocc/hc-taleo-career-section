define([ 'jquery', 'fs/SeeAllOlfPopup', 'fs/ResourcesHandler',
		'fs/PopupManager' ], function($, SeeAllOlfPopup, ResourcesHandler,
		PopupManager) {

	function SeeAllOlfLinkFactory(searchHandler) {

		this.getSeeAllOlfLink = function(filter) {
			var filter = filter;
			var seeAllOlfID = filter.id + "-seeallolf";

			var link = $("<a>").attr("href", "javascript:void(0);").attr("id",
					seeAllOlfID).addClass("filter-link-anchor");
			link.html(getLinkLabel(filter));
			link.click(function() {
				(new SeeAllOlfPopup(filter, searchHandler, PopupManager))
						.openPopup();
			});
			var box = $("<div>").addClass("filter-link filter-link-see-all").append(link);

			return box;
		}

		function getLinkLabel(filter) {
			var label = null;
			switch (filter.id) {
			case 'LOCATION':
				if (filter.criteriaId != null) {
					label = ResourcesHandler.getResource(
							"seeAllOlf.seeLocationsIn", filter.criteriaLabel);
				} else {
					label = ResourcesHandler
							.getResource("seeAllOlf.seeLocations");
				}
				break;
			case 'JOB_FIELD':
				if (filter.criteriaId != null) {
					label = ResourcesHandler.getResource(
							"seeAllOlf.seeJobFieldsIn", filter.criteriaLabel);
				} else {
					label = ResourcesHandler
							.getResource("seeAllOlf.seeJobFields");
				}
				break;
			case 'ORGANIZATION':
				if (filter.criteriaId != null) {
					label = ResourcesHandler.getResource(
							"seeAllOlf.seeOrganizationsIn",
							filter.criteriaLabel);
				} else {
					label = ResourcesHandler
							.getResource("seeAllOlf.seeOrganizations");
				}
				break;
			}
			return label;
		}

	}
	// end-of-class-definition

	return SeeAllOlfLinkFactory;

});