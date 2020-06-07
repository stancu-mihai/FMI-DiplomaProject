$(function() {
    $("#rooms").jsGrid({
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
        deleteConfirm: "Chiar doriți ștergerea sălii?",
        controller: {
          loadData: function(filter) {
            return $.ajax({
              url: "/api/room",
              dataType: "json",
              data: filter
            });
          },
          insertItem: function(item) {
            return $.ajax({
              type: "POST",
              url: "/api/room",
              data: item
            });
          },
          updateItem: function(item) {
            return $.ajax({
              type: "PUT",
              url: "/api/room",
              data: item
            });
          },
          deleteItem: function(item) {
            return $.ajax({
              type: "DELETE",
              url: "/api/room",
              data: item
            });
          }
        },
        fields: [
            { name: "name", type: "text", title: "Nume"},
            { name: "location", type: "text", title: "Locație"},
            { name: "capacity", type: "number", title: "Capacitate"},
            { name: "projector", type: "checkbox", title: "Proiector"},
            { name: "blackboard", type: "checkbox", title: "Tablă"},
            { name: "smartboard", type: "checkbox", title: "Tablă smart"},
            { name: "computers", type: "checkbox", title: "PC-uri"},
            { type: "control" }
        ]
    });
});