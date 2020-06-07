$(function() {
    $("#subjects").jsGrid({
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
        deleteConfirm: "Chiar doriți ștergerea materiei?",
        controller: {
          loadData: function(filter) {
            return $.ajax({
              url: "/api/subject",
              dataType: "json",
              data: filter
            });
          },
          insertItem: function(item) {
            return $.ajax({
              type: "POST",
              url: "/api/subject",
              data: item
            });
          },
          updateItem: function(item) {
            return $.ajax({
              type: "PUT",
              url: "/api/subject",
              data: item
            });
          },
          deleteItem: function(item) {
            return $.ajax({
              type: "DELETE",
              url: "/api/subject",
              data: item
            });
          }
        },
        fields: [
            { name: "name", type: "text", title: "Nume"},
            { type: "control" }
        ]
    });
});