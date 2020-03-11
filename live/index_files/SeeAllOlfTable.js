define(
    [ 'jquery', 'fs/ResourcesHandler', 'fs/FacetedSearchSettings', 'fs/Utilities', 'jquery.dataTables'],
    function($, ResourcesHandler, FacetedSearchSettings, Utilities) {

        function SeeAllOlfTable(parent, searchHandler) {

            this.filter = parent.filter;
            this.olfDataTableDivId = parent.tableDivId;
            this.olfDataTableId = parent.tableId;
            this.destroyed = false; // TODO it is temporary solution
            this.addFilterEvent = parent.addFilterEvent;
            this.removeFilterEvent = parent.removeFilterEvent;
            this.selectionLimitEvent = parent.selectionLimitEvent;
            this.parent = parent;

            var self = this;
            this.queryText = null;
            this.minimumLengthForFiltering = 2;
            this.selectionList = new Array();

            this.filterWrapped = false;
            this.previousSearch = null;

            this.isInitHightlightStyles = false;
            this.evenBgColor = null;
            this.evenFontColor = null;
            this.oddBgColor = null;
            this.oddFontColor = null;

            this.ie7browser = navigator.appVersion.indexOf("MSIE 7.") != -1;

            this.summary = $('#' + parent.showingWhatId).text();

            this.init = function() {
                getTableContainer()
                    .html(
                        '<table summary = "'
                        + self.summary
                        + '" cellpadding="0" cellspacing="0" border="0" id="'
                        + self.olfDataTableId
                        + '"><thead class="subtitle"></thead></table>');
                this.populateTableWithData();
                this.on(self.addFilterEvent, self.removeFilterEvent,
                    self.selectionLimitEvent);
                destroyed = false;
            }

            this.on = function(addFilterEvent, removeFilterEvent,
                                 selectionLimitEvent) {
                $(document).on(addFilterEvent,
                    function(event, selection) {
                        addFilter(selection);
                    });
                $(document).on(removeFilterEvent,
                    function(event, selection) {
                        removeFilter(selection);
                    });
                $(document).on(selectionLimitEvent,
                    function(event, selection) {
                        removeFilter(selection);
                    });
            }

            this.off = function(addFilterEvent, removeFilterEvent,
                                   selectionLimitEvent) {
                $(document).off(addFilterEvent);
                $(document).off(removeFilterEvent);
                $(document).off(selectionLimitEvent);
            }

            function addFilter(selection) {
                self.selectionList.push(selection.itemId);
                getTableContainer().find('#' + selection.itemId).prop(
                    'checked', true);
                getTableContainer().find('#div' + selection.itemId)
                    .addClass("checkbox-checked");
            }

            function removeFilter(selection) {
                self.selectionList = $.grep(self.selectionList, function(
                    value) {
                    return value != selection.itemId;
                });

                getTableContainer().find('#' + selection.itemId).prop(
                    'checked', false);
                getTableContainer().find('#div' + selection.itemId)
                    .removeClass("checkbox-checked");
            }

            function getTableContainer() {
                return $('#' + self.olfDataTableDivId);
            }

            function getTableId() {
                return $('#' + self.olfDataTableId);
            }

            this.populateTableWithData = function() {
                $.ajax({
                    type : 'POST',
                    url : '/careersection/rest/olfsearch/getColumns?lang='
                        + FacetedSearchSettings.lang + '&portal=' + FacetedSearchSettings.portalNo,
                    data : JSON.stringify(self
                        .prepareOLFSubtreeRoot(self.filter)),
                    error : function() {
                        searchHandler
                            .displayUnAvailablePage();
                    },
                    success : function(columns) {
                        parent.hideProgress();
                        self.createTable(columns);
                    },
                    dataType : 'json',
                    contentType : 'application/json'

                });
            }

            this.overrideStyleClasses = function() {
                $.fn.dataTableExt.oStdClasses["sFilter"] = "dataTables_filter topSearchPanel";
                $.fn.dataTableExt.oStdClasses["sStripeOdd"] = "even";
                $.fn.dataTableExt.oStdClasses["sStripeEven"] = "odd";
            }

            function generateFilterLabel() {
                var searchLabel = '';
                switch (self.filter.id) {
                    case 'LOCATION':
                        searchLabel = ResourcesHandler.getResource("seeAllOlf.filterLocations");
                        break;
                    case 'JOB_FIELD':
                        searchLabel = ResourcesHandler.getResource("seeAllOlf.filterJobFields");
                        break;
                    case 'ORGANIZATION':
                        searchLabel = ResourcesHandler.getResource("seeAllOlf.filterOrganizations");
                        break;
                }

                var hiddenSpaceSeparator = $('<span>');
                hiddenSpaceSeparator.html('&nbsp;');
                hiddenSpaceSeparator.addClass('hidden-audible');

                var hiddenAudibleHint = $('<span>');
                hiddenAudibleHint.text(ResourcesHandler.getResource("seeAllOlf.filterOlfHint"));
                hiddenAudibleHint.addClass('hidden-audible');
                searchLabel += hiddenSpaceSeparator.prop('outerHTML') + hiddenAudibleHint.prop('outerHTML');

                return searchLabel;
            }

            this.createTable = function(columns) {
                self.overrideStyleClasses();
                getTableId()
                    .DataTable(
                        {
                            "processing": true,
                            "serverSide": true,
                            "destroy": true,
                            "language": {
                                "search": generateFilterLabel(),
                                "processing": ResourcesHandler
                                    .getResource("seeAllOlf.loading"),
                                "emptyTable": ResourcesHandler
                                    .getResource("seeAllOlf.emptyTable"),
                                "zeroRecords": ResourcesHandler
                                    .getResource("seeAllOlf.emptyFiltering")
                            },
                            "pageLength": 100,
                            "columns": self.prepareColumns(columns),
                            "order": [[1, "asc"]],
                            "columnDefs": [{
                                "orderable": false,
                                "width": "20px",
                                "targets": 0,
                                "render": function (data, type, full) {
                                    var checked = false;
                                    var value = null;
                                    for (i = full.length - 1; i > 0; i--) {
                                        if (full[i] != null) {
                                            value = full[i];
                                            break;
                                        }
                                    }
                                    var isSelected = $.inArray(String(data), self.selectionList) > -1
                                    return self.generateCheckbox(data, Utilities.getInstance().convertHTMLSpecialCharacters(value), isSelected, full);
                                },
                                "createdCell": function (cell) {
                                    cell.scope = 'row';
                                }
                            }],
                            "dom": '<"top"f>rtp',
                            "scrollCollapse": true,
                            "scrollY": 280,
                            "ajax": self.getRows,

                            "headerCallback": function (nHead,
                                                        aData, iStart, iEnd, aiDisplay) {
                                var headers = nHead
                                    .getElementsByTagName('th');
                                var headersLength = headers.length;
                                for (var i = 0; i < headersLength; i++) {
                                    headers[i].setAttribute(
                                        "scope", "col");
                                }
                                var checkboxHeader = headers[0];
                                checkboxHeader.setAttribute("aria-label", ResourcesHandler.getResource("seeAllOlf.selectElement"));
                                checkboxHeader.setAttribute("alt", ResourcesHandler.getResource("seeAllOlf.selectElement"));
                            },
                            "rowCallback": self.rowCallback,
                            "drawCallback": self.registerEventListener,
                            "initComplete": self.tableInitCompleteCallback
                        });
            };

            this.generateCheckbox = function(id, value, checked, rowData) {
                var checkbox = null;
                var headerForCheckbox = this.computeCheckboxHeaderFromRowData(rowData);
                if (checked) {
                    if (this.ie7browser) {
                        checkbox = '<input type="checkbox" id="' + id
                            + '" name="selCh' + id + '" value="'
                            + value + '" checked="checked" />';
                    } else {
                        checkbox = '<div class="label-wrapper"><label for="'
                            + id + '">';
                        checkbox += '<input type="checkbox" id="'
                            + id
                            + '" name="selCh'
                            + id
                            + '" value="'
                            + value
                            + '" checked="checked" class="filter-checkbox"/>';
                        checkbox += '<div id="div'
                            + id
                            + '" class="checkboxp checkbox-unchecked checkbox-checked" alt="'
                            + headerForCheckbox + '">&nbsp</div></label></div>';
                    }
                } else {
                    if (this.ie7browser) {
                        checkbox = '<input type="checkbox" id="' + id
                            + '"  name="selCh' + id + '" value="'
                            + value + '" />';
                    } else {
                        checkbox = '<div class="label-wrapper"><label for="'
                            + id + '">';
                        checkbox += '<input type="checkbox" id="' + id
                            + '"  name="selCh' + id + '" value="'
                            + value + '" class="filter-checkbox" />';
                        checkbox += '<div id="div'
                            + id
                            + '" class="checkboxp checkbox-unchecked" alt="'
                            + headerForCheckbox + '">&nbsp</div></label></div>';
                    }
                }
                return checkbox;
            }

            this.computeCheckboxHeaderFromRowData = function(rowData) {
                var checkboxRowHeader = "";
                var rowLength = rowData.length;
                for(var i = 1; i < rowLength; i++) {
                    if (rowData[i] != null) {
                        checkboxRowHeader += Utilities.getInstance().convertHTMLSpecialCharacters(rowData[i]) + "  ";
                    } else {
                        break;
                    }
                }
                return checkboxRowHeader.substring(0,checkboxRowHeader.length-2);
            }

            this.tableInitCompleteCallback = function() {
                var input = $("#" + self.olfDataTableId + "_filter input");
                self.registerFilterWrap(input);
                input.attr('maxlength', 50);
                self.bindFocusEventToCheckboxes();
                input.focus();
            }

            this.registerFilterWrap = function(input) {
                input.wrap('<span class="clearFilter"/>').after(
                    $('<span id="wrap"/>'));
            }

            this.bindFocusEventToCheckboxes= function() {
                $('.dataTables_scrollBody').on('focus', '.filter-checkbox', function(event){
                    var checkboxInFocus = $(document.activeElement);
                    var ariaLabel = checkboxInFocus.parent('label').find('.checkboxp').first().attr('alt');
                    checkboxInFocus.attr('aria-label', ariaLabel);
                });
            }

            this.wrapFilterInput = function() {
                $("#wrap").click(function() {
                    self.removeFilterWrap();
                });
                $("#wrap").removeClass();
                $("#wrap").addClass('showXButton');
                self.filterWrapped = true;
            }

            this.removeFilterWrap = function() {
                $("#wrap").off('click');
                $("#wrap").removeClass();
                $("#wrap").addClass('hideXButton');
                $("#" + self.olfDataTableId + "_filter input").val('')
                    .focus();
                getTableId().dataTable().fnFilter('');
                self.filterWrapped = false;
                self.previousSearch = null
            }

            this.registerEventListener = function() {
                self.initHightlightStyles();
                getTableId().find('input[name^=selCh]').each(
                    function() {
                        $(this).off('click').click(
                            function() {
                                var selection = {
                                    itemId : this.id,
                                    itemLabel : this.value
                                };
                                if ($(this).is(':checked')) {
                                    $(document).trigger(
                                        self.addFilterEvent,
                                        selection);
                                    return;
                                } else {
                                    $(document).trigger(
                                        self.removeFilterEvent,
                                        selection);
                                    return;
                                }
                            });
                    });
            }

            this.destroyTable = function() {
                if (this.destroyed == false) {
                    getTableId().dataTable().fnDestroy(true);
                    this.destroyed = true;
                }
            }

            this.prepareOLFSubtreeRoot = function(filter) {
                var olfSubtreeRoot = {
                    id : filter.criteriaId,
                    olfStructureType : filter.id,
                    showHiddenLevels : false
                };

                return olfSubtreeRoot;
            }

            this.rowCallback = function(nRow, aData, iDisplayIndex,
                                        iDisplayIndexFull) {
                if (self.queryText != null && self.queryText.length >= self.minimumLengthForFiltering
                    && aData.length > 1) {
                    var repl = self.prepareHighlightStyle(nRow);
                    for ( var i = 1; i < aData.length; i++) {
                        if (aData[i] != null) {
                            var rgxp = new RegExp(self
                                .escapeRegExp(self.queryText), 'gi');
                            var tmp = '' + aData[i];
                            $('td:eq(' + i + ')', nRow).html(
                                tmp.replace(rgxp, repl));
                        }
                    }
                }
            }

            this.escapeRegExp = function(string) {
                return string
                    .replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
            }

            this.initHightlightStyles = function() {
                if (!self.isInitHightlightStyles) {
                    evenRow = $('#dataTable tr.even:first')[0];
                    oddRow = $('#dataTable tr.odd:first')[0];

                    if (evenRow) {
                        self.evenBgColor = self.getBgColorOld(evenRow);
                        self.evenFontColor = $(evenRow).css('color');
                    }

                    if (oddRow) {
                        self.oddBgColor = self.getBgColorOld(oddRow);
                        self.oddFontColor = $(oddRow).css('color');
                    }

                    self.isInitHightlightStyles = true;
                }
            }

            this.prepareHighlightStyle = function(nRow) {
                var isEven = $(nRow).hasClass('even');

                var fontColorOld = null;
                var bgColorOld = null;

                if (isEven) {
                    bgColorOld = self.evenBgColor;
                    fontColorOld = self.evenFontColor;
                } else {
                    bgColorOld = self.oddBgColor;
                    fontColorOld = self.oddFontColor;
                }

                return '<span style="color: ' + bgColorOld
                    + '; background-color: ' + fontColorOld
                    + ';">\$&</span>';
            }

            this.getBgColorOld = function(nRow) {
                var bgColorOld = $(nRow).css('background-color');
                if (bgColorOld == 'transparent'
                    || bgColorOld == 'rgba(0, 0, 0, 0)') {
                    var row = $(nRow.tagName + '.' + nRow.className)[0];
                    $(row)
                        .parents()
                        .each(
                            function() {
                                if ($(this).css('background-color') != 'transparent'
                                    && $(this).css(
                                        'background-color') != 'rgba(0, 0, 0, 0)') {
                                    bgColorOld = $(this).css(
                                        'background-color');
                                    return false;
                                }
                            });
                }
                return bgColorOld;
            }

            this.getParameterKey = function(data, sKey) {
                for ( var i = 0, iLen = data.length; i < iLen; i++) {
                    if (data[i].name == sKey) {
                        return data[i].value;
                    }
                }
                return null;
            }

                this.getRows = function(data, callback, setting) {
                    var olfSearch = {
                        olfQueryParameters : self.buildQueryParameters (data),
                        olfSubtreeRoot : self
                            .prepareOLFSubtreeRoot(self.filter)

                    };
                    $.ajax({
                        type : 'POST',
                        url : '/careersection/rest/olfsearch/populate?lang='+ FacetedSearchSettings.lang + '&portal=' + FacetedSearchSettings.portalNo,
                        data : JSON.stringify(olfSearch),
                        error : function() {
                            searchHandler
                                .displayUnAvailablePage();
                        },
                        success : function(json) {
                            var dataTablesJson = {
                                data : json.jobsData,
                                recordsTotal : json.numberOfRows,
                                recordsFiltered : json.numberOfRows,
                                draw : json.sequenceNumber
                            };

                            setTimeout(function(){
                                callback(dataTablesJson);
                            }, 50);


                        },
                        dataType : 'json',
                        contentType : 'application/json'
                    });
                }

            this.buildQueryParameters = function(data) {
                var sEcho = data.draw;
                var iDisplayStart = data.start;
                var iDisplayLength = data.length;
                var sSearch = data.search.value;
                var iSortCol_0 = data.order[0].column;
                var sSortDir_0 = data.order[0].dir;
                self.queryText = sSearch;

                return {
                    offset : iDisplayStart,
                    pageSize : iDisplayLength,
                    sequenceNumber : sEcho,
                    queryText : sSearch,
                    sortingColumn : iSortCol_0,
                    sortingDirection : sSortDir_0
                }

            }

            this.prepareColumns = function(columns){
                var tableColumns = new Array();
                var columnCount = columns.length;
                for (var i = 0; i < columnCount; i++) {
                    var columnSize=100/(columnCount-1);
                    if (i != 0) {
                        tableColumns.push({ sTitle: columns[i].columnName, sWidth: columnSize + "%"});
                    }
                    else {
                        tableColumns.push({ sTitle: columns[i].columnName, sWidth: "5px"});
                    }
                }
                this.resizeContainerBasedOnColumnCount(columnCount);
                return tableColumns;
            };

            this.resizeContainerBasedOnColumnCount = function (columnCount) {
                if (columnCount > 4) {
                    parent.makeExpandedPopup();
                }
                else {
                    parent.makeContractedPopup();
                }
            }

            jQuery.fn.dataTableExt.oApi.setFilteringDelay = function(oSettings, iDelay) {
                var _that = this;

                if (iDelay === undefined) {
                    iDelay = 250;
                }

                this
                    .each(function(i) {
                        $.fn.dataTableExt.iApiIndex = i;
                        var $this = this, oTimerId = null, anControl = $(
                            'input',
                            _that.fnSettings().aanFeatures.f);

                        anControl
                            .off('keyup')
                            .on(
                                'keyup',
                                function() {
                                    var $$this = $this;

                                    var anControlVal = anControl
                                        .val();
                                    if (!self.filterWrapped
                                        && anControlVal.length > 0) {
                                        self.wrapFilterInput();
                                    } else if (self.filterWrapped
                                        && anControlVal.length == 0) {
                                        self.removeFilterWrap();
                                    }

                                    if ((anControlVal.length == 0 || anControlVal.length >= self.minimumLengthForFiltering)
                                        && (self.previousSearch === null || self.previousSearch != anControlVal)) {
                                        window
                                            .clearTimeout(oTimerId);
                                        self.previousSearch = anControlVal;
                                        oTimerId = window
                                            .setTimeout(
                                                function() {
                                                    $.fn.dataTableExt.iApiIndex = i;
                                                    _that
                                                        .fnFilter(anControlVal);
                                                },
                                                iDelay);
                                    }
                                });

                        return this;
                    });
                return this;
            };

            this.init();

        }
        // end-of-class-definition
        return SeeAllOlfTable;

    });
