$(function() {
    $("#rooms").jsGrid({
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
            { name: "blackboard", type: "checkbox", title: "Black\nboard"},
            { name: "smartboard", type: "checkbox", title: "Smart\nboard"},
            { name: "videoSurveillance", type: "checkbox", title: "Video\nSurveillance"},
            { name: "physicsLab", type: "checkbox", title: "Physics\nLab"},
            { name: "chemistryLab", type: "checkbox", title: "Chemistry\nLab"},
            { name: "CSLab", type: "checkbox", title: "CS\nLab"},
            { name: "biologyLab", type: "checkbox", title: "Biology\nLab"},
            { name: "basketball", type: "checkbox", title: "Basketball"},
            { name: "football", type: "checkbox", title: "Football"},
            { type: "control" }
        ]
    });
});