
$("#series").jsGrid({
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
    pageNextText: "Următoarea",
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
    
    deleteConfirm: "Chiar doriți ștergerea seriei?",
    controller: {
        loadData: function (filter) {
            return $.ajax({
                url: "/api/series",
                dataType: "json",
                data: filter
            });
        },
        insertItem: function (item) {
            return $.ajax({
                type: "POST",
                url: "/api/series",
                data: item
            });
        },
        updateItem: function (item) {
            return $.ajax({
                type: "PUT",
                url: "/api/series",
                data: item
            });
        },
        deleteItem: function (item) {
            return $.ajax({
                type: "DELETE",
                url: "/api/series",
                data: item
            });
        }
    },
    fields: [
        { name: "name", type: "text", title: "Nume" },
        { type: "control" }
    ]
});