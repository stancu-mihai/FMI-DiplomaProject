$(function () {
    $.ajax({
        type: "GET",
        url: "/api/user?role=2"
    }).done(function (professors) {
        $(function () {
            $.ajax({
                type: "GET",
                url: "/api/subject"
            }).done(function (subjects) {
                $(function () {
                    $.ajax({
                        type: "GET",
                        url: "/api/series"
                    }).done(function (series) {
                        $("#courses").jsGrid({
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
                            deleteConfirm: "Chiar doriți ștergerea cursului?",
                            controller: {
                                loadData: function (filter) {
                                    return $.ajax({
                                        url: "/api/course",
                                        dataType: "json",
                                        data: filter
                                    });
                                },
                                insertItem: function (item) {
                                    return $.ajax({
                                        type: "POST",
                                        url: "/api/course",
                                        data: item
                                    });
                                },
                                updateItem: function (item) {
                                    return $.ajax({
                                        type: "PUT",
                                        url: "/api/course",
                                        data: item
                                    });
                                },
                                deleteItem: function (item) {
                                    return $.ajax({
                                        type: "DELETE",
                                        url: "/api/course",
                                        data: item
                                    });
                                }
                            },
                            fields: [
                                { name: "seriesId", type: "select", items: series, valueField: "_id", textField: "name", title: "Serie" },
                                { name: "subjectId", type: "select", items: subjects, valueField: "_id", textField: "name", title: "Materie" },
                                { name: "semester", type: "number", title: "Semestru" },
                                { name: "professorId", type: "select", items: professors, valueField: "_id", textField: "email", title: "Profesor" },
                                { name: "weeklyHours", type: "number", title: "Ore/săpt" },
                                { name: "projector", type: "checkbox", title: "Proiector" },
                                { name: "blackboard", type: "checkbox", title: "Tabla" },
                                { name: "smartboard", type: "checkbox", title: "Tabla smart" },
                                { name: "computers", type: "checkbox", title: "PC-uri" },
                                { type: "control" }
                            ]
                        });
                    });
                });
            });
        });
    });
});