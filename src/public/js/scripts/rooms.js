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
        deleteConfirm: "Do you really want to delete room?",
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
            { name: "computers", type: "checkbox", title: "Computers"},
            { type: "control" }
        ]
    });
});