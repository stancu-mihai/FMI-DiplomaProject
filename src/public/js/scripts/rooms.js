$(function() {
    $("#rooms").jsGrid({
        height: "auto",
        shrinkToFit : false,
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
            { name: "name", type: "text", width: 75, title: "Name"},
            { name: "location", type: "text", width: 75, title: "Location"},
            { name: "capacity", type: "number", width: 50, title: "Capacity"},
            { name: "projector", type: "checkbox", width: 50, title: "Projector"},
            { name: "blackboard", type: "checkbox", width: 50, title: "Blackboard"},
            { name: "smartboard", type: "checkbox", width: 50, title: "Smartboard"},
            { name: "videoSurveillance", type: "checkbox", width: 50, title: "VideoSurveillance"},
            { name: "physicsLab", type: "checkbox", width: 50, title: "PhysicsLab"},
            { name: "chemistryLab", type: "checkbox", width: 50, title: "ChemistryLab"},
            { name: "CSLab", type: "checkbox", width: 50, title: "CSLab"},
            { name: "biologyLab", type: "checkbox", width: 50, title: "BiologyLab"},
            { name: "basketball", type: "checkbox", width: 50, title: "Basketball"},
            { name: "football", type: "checkbox", width: 50, title: "Football"},
            { type: "control" }
        ]
    });
});