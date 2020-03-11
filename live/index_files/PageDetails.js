define(
    [ 'fs/ResourcesHandler', 'fs/StaticResourcesProvider'],
    function(ResourcesHandler, StaticResourcesProvider) {
        function PageDetails(pPagingData){

            var PAGES_DISPLAYED = 10;
            this.pagingData =pPagingData;

            this.getPageStart = function() {
                return ((this.pagingData.currentPageNo - 1) * this.pagingData.pageSize) + 1;
            }

            this.getPageEnd = function() {
                return Math.min(this.pagingData.pageSize
                    * this.pagingData.currentPageNo, this.pagingData.totalCount);
            }

            this.getPageCount = function(){
                return Math.ceil(this.pagingData.totalCount
                    / this.pagingData.pageSize);
            }

            this.jobOpeningDetailsInfo = function() {
                return this.getPageStart() + ' - ' + this.getPageEnd() + ' '
                    + StaticResourcesProvider.of + ' '
                    + this.pagingData.totalCount;
            }

            this.accessibilityJobListReload = function(pCurrentDisplayedPageNo) {
                // The list of jobs has reloaded. {0} - {1} of {2}. Page {3}
                return ResourcesHandler.getResource('accessibility.jobListReloaded').
                    replace("{0}", this.getPageStart()).
                    replace("{1}", this.getPageEnd()).
                    replace("{2}", this.pagingData.totalCount).
                    replace("{3}", pCurrentDisplayedPageNo);
            }

             this.getFirstPage = function(pageNo) {
                var firstPageForFirstPages = Math.max(1, pageNo
                    - (PAGES_DISPLAYED / 2));
                var firstPageForLastPages = Math.max(1, this.getPageCount()
                    - PAGES_DISPLAYED);
                return Math.min(firstPageForFirstPages,
                    firstPageForLastPages);
            }

            this.getLastPage = function(pageNo) {
                var lastPageForFirstPages = Math.max(PAGES_DISPLAYED,
                        pageNo + (PAGES_DISPLAYED / 2));
                return Math.min(this.getPageCount(), lastPageForFirstPages);
            }
        }
        // end-of-class-definition
        return PageDetails;
    });
