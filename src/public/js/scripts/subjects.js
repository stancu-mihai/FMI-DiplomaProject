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
        deleteConfirm: "Do you really want to delete subject?",
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
            { name: "name", type: "text", title: "Name"},
            { type: "control" }
        ]
    });
});