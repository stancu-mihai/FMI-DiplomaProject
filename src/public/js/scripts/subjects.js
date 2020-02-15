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
            { name: "credits", type: "number", title: "Credits"},
            { name: "timeDuration", type: "number", title: "Duration"},
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