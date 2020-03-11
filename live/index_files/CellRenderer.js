define(
    [ 'jquery', 'fs/list/LocationsCellRenderer', 'fs/URLBuilder', 'fs/FacetedSearchSettings' ],
    function($, LocationsCellRenderer, URLBuilder, FacetedSearchSettings) {

        function CellRenderer() {
            this.locationsCellRenderer = new LocationsCellRenderer();
            this.renderCell = function(idx , listItem) {
                var text = listItem.column[idx];

                if (idx == listItem.linkedColumn) {
                    return generateLink(idx, listItem);
                } else if (isLocationsColumn(idx, listItem)) {
                    return this.locationsCellRenderer.renderLocationsCell(
                        JSON.parse(text));
                } else {
                    return $('<span>').text(text);
                }
            }

            function isLocationsColumn(idx, listItem) {
                var locationsColumn = listItem.locationsColumns;
                for ( var i = 0; i < locationsColumn.length; i++) {
                    if (idx == locationsColumn[i]) {
                        return true;
                    }
                }
                return false;
            }
        }

        function generateHref(listItem) {
            var href;
            if (FacetedSearchSettings.requisitionDescriptionPageDisplayed)
            {
                href = URLBuilder.getJobDetailURL(listItem.contestNo);
            }
            else
            {
                if (FacetedSearchSettings.agencyPortal)
                {
                    href = URLBuilder.getReferCandidateButtonURL(listItem.jobId);
                }
                else
                {
                    href = URLBuilder.getApplyButtonURL(listItem.jobId);
                }
            }
            return href;
        }

        function generateLink(idx, listItem) {
            var text = listItem.column[idx];
            var href = generateHref(listItem);
            return $('<span>').append(
                $('<a>')
                    .attr('href', href)
                    .attr('title', text)
                    .text(text));
        }
        // end-of-class-definition

        return CellRenderer;

    });
