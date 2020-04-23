
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
    deleteConfirm: "Do you really want to delete series?",
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