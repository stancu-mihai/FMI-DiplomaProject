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
        deleteConfirm: "Are you sure you want to delete the room?",
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
            { name: "name", type: "text", title: "Name"},
            { name: "location", type: "text", title: "Location"},
            { name: "capacity", type: "number", title: "Capacity"},
            { name: "projector", type: "checkbox", title: "Projector"},
            { name: "blackboard", type: "checkbox", title: "Blackboard"},
            { name: "smartboard", type: "checkbox", title: "Smartboard"},
            { name: "computers", type: "checkbox", title: "PCs"},
            { type: "control" }
        ]
    });
});