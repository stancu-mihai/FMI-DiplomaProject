
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
    pagerFormat: "Page: {first} {prev} {pages} {next} {last}    {pageIndex} of {pageCount}",
    pagePrevText: "Prev",
    pageNextText: "Next",
    pageFirstText: "First",
    pageLastText: "Last",
    searchModeButtonTooltip: "Search mode", 
    insertModeButtonTooltip: "Insert mode", 
    editButtonTooltip: "Edit",                      
    deleteButtonTooltip: "Remove",                  
    searchButtonTooltip: "Search",                  
    clearFilterButtonTooltip: "Delete filter",       
    insertButtonTooltip: "Insert",                  
    updateButtonTooltip: "Update",                  
    cancelEditButtonTooltip: "Cancel edit", 
    deleteConfirm: "Are you sure you want to delete the series?",
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
        { name: "name", type: "text", title: "Name" },
        { type: "control" }
    ]
});