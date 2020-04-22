$(function () {
    $.ajax({
        type: "GET",
        url: "/api/user?role=2"
    }).done(function (professors) {
        $("#prefhours").jsGrid({
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
            deleteConfirm: "Do you really want to delete preferred hour?",
            controller: {
                loadData: function (filter) {
                    return $.ajax({
                        url: "/api/prefhour",
                        dataType: "json",
                        data: filter
                    });
                },
                insertItem: function (item) {
                    return $.ajax({
                        type: "POST",
                        url: "/api/prefhour",
                        data: item
                    });
                },
                updateItem: function (item) {
                    return $.ajax({
                        type: "PUT",
                        url: "/api/prefhour",
                        data: item
                    });
                },
                deleteItem: function (item) {
                    return $.ajax({
                        type: "DELETE",
                        url: "/api/prefhour",
                        data: item
                    });
                }
            },
            fields: [
                { name: "professorId", type: "select", items: professors, valueField: "_id", textField: "email", title: "Professor" },
                {
                    name: "weekDay",
                    type: "select",
                    items: [
                        { Name: "Mon", Id: "0" },
                        { Name: "Tue", Id: "1" },
                        { Name: "Wed", Id: "2" },
                        { Name: "Thu", Id: "3" },
                        { Name: "Fri", Id: "4" },
                        { Name: "Sat", Id: "5" },
                        { Name: "Sun", Id: "6" }
                    ],
                    valueField: "Id",
                    textField: "Name",
                    title: "Weekday"
                },
                { name: "startHour", type: "number", title: "Start time" },
                { name: "endHour", type: "number", title: "End time" },
                { type: "control" }
            ]
        });
    });
});