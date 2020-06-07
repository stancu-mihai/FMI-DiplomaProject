$(function () {
    $.ajax({
        type: "GET",
        url: "/api/series"
    }).done(function (series) {
        $(function () {
            $.ajax({
                type: "GET",
                url: "/api/user?role=1"
            }).done(function (studentReps) {
                $(function () {
                    $("#studentgroups").jsGrid({
                        width: null,
                        shrinkToFit: false,
                        filtering: true,
                        inserting: true,
                        editing: true,
                        sorting: true,
                        paging: true,
                        autoload: true,
                        pageSize: 10,
                        pageButtonCount: 5,
                        pagerFormat: "Pagini: {first} {prev} {pages} {next} {last}    {pageIndex} din {pageCount}",
                        pagePrevText: "Anterioara",
                        pageNextText: "Urmatoarea",
                        pageFirstText: "Prima",
                        pageLastText: "Ultima",
                        searchModeButtonTooltip: "Comută la căutare", 
                        insertModeButtonTooltip: "Comută la inserare", 
                        editButtonTooltip: "Modifică",                      
                        deleteButtonTooltip: "Sterge",                  
                        searchButtonTooltip: "Caută",                  
                        clearFilterButtonTooltip: "Sterge filtru",       
                        insertButtonTooltip: "Inserează",                  
                        updateButtonTooltip: "Actualizează",                  
                        cancelEditButtonTooltip: "Anulează modificare", 
                        deleteConfirm: "Chiar doriți ștergerea grupei?",
                        controller: {
                            loadData: function (filter) {
                                return $.ajax({
                                    url: "/api/studentgroup",
                                    dataType: "json",
                                    data: filter
                                });
                            },
                            insertItem: function (item) {
                                return $.ajax({
                                    type: "POST",
                                    url: "/api/studentgroup",
                                    data: item
                                });
                            },
                            updateItem: function (item) {
                                return $.ajax({
                                    type: "PUT",
                                    url: "/api/studentgroup",
                                    data: item
                                });
                            },
                            deleteItem: function (item) {
                                return $.ajax({
                                    type: "DELETE",
                                    url: "/api/studentgroup",
                                    data: item
                                });
                            }
                        },
                        fields: [
                            { name: "name", type: "text", title: "Nume" },
                            { name: "seriesId", type: "select", items: series, valueField: "_id", textField: "name", title: "Serie" },
                            { name: "count", type: "number", title: "Persoane" },
                            { type: "control" }
                        ]
                    });
                });
            });
        });
    });
});