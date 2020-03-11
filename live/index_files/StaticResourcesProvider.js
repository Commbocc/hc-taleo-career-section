define(['fs/ResourcesHandler'], function(ResourcesHandler) {
	
	console.log('creating STATIC_RESOURCES');

	return {
		noMatchFound : ResourcesHandler.getResource("searchPanel.noMatchFound"),
		showMore : ResourcesHandler.getResource("searchPanel.showMore"),
		showLess : ResourcesHandler.getResource("searchPanel.showLess"),
		commonJobDesc : ResourcesHandler.getResource("resultListPanel.messageLinkJobDescription"),
		shareRes : ResourcesHandler.getResource("resultListPanel.share"),
		of : ResourcesHandler.getResource("infoPanel.of"),
		singleLine : ResourcesHandler.getResource("resultListPanel.singleLineView"),
        singleLineViewLinkAudibleDescription : ResourcesHandler.getResource("resultListPanel.singleLineViewLinkAudibleDescription"),
		multiLine : ResourcesHandler.getResource("resultListPanel.multiLineView"),
        multiLineViewLinkAudibleDescription : ResourcesHandler.getResource("resultListPanel.multiLineViewLinkAudibleDescription"),
		showMoreLocations : ResourcesHandler.getResource("resultListPanel.showMoreLocations"),
		advancedSearchLink : ResourcesHandler.getResource("headerPanel.advancedSearch"),
		basicSearchLink : ResourcesHandler.getResource("advancedSearchPanel.basicSearch"),
		jobListReloaded : ResourcesHandler.getResource('resultListPanel.jobListReloaded')
		}
	}
);	