$(function () {
    $.ajax({
        type: "GET",
        url: "/api/user?role=2"
    }).done(function (professors) {
        $("#prefhours").jsGrid({
            width: null,
            shrinkToFit: false,
            filtering: false,
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
            deleteConfirm: "Chiar doriți ștergerea orei preferate?",
            controller: {
                loadData: function (filter) {
                    return $.ajax({
                        url: "/api/prefhour",
                        dataType: "json",
                        data: filter
                    });
                },
                insertItem: function (item) {
                    return $.ajax({
                        type: "POST",
                        url: "/api/prefhour",
                        data: item
                    });
                },
                updateItem: function (item) {
                    return $.ajax({
                        type: "PUT",
                        url: "/api/prefhour",
                        data: item
                    });
                },
                deleteItem: function (item) {
                    return $.ajax({
                        type: "DELETE",
                        url: "/api/prefhour",
                        data: item
                    });
                }
            },
            fields: [
                { name: "professorId", type: "select", items: professors, valueField: "_id", textField: "email", title: "Profesor" },
                {
                    name: "weekDay",
                    type: "select",
                    items: [
                        { Name: "Luni", Id: "0" },
                        { Name: "Marți", Id: "1" },
                        { Name: "Miercuri", Id: "2" },
                        { Name: "Joi", Id: "3" },
                        { Name: "Vineri", Id: "4" },
                        { Name: "Sâmbătă", Id: "5" },
                        { Name: "Duminică", Id: "6" }
                    ],
                    valueField: "Id",
                    textField: "Name",
                    title: "Ziua"
                },
                { name: "startHour", type: "number", title: "Oră început" },
                { name: "endHour", type: "number", title: "Oră sfârșit" },
                { type: "control" }
            ]
        });
    });
});