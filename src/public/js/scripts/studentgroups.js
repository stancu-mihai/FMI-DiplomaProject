$(function () {
    $.ajax({
        type: "GET",
        url: "/api/user?role=1"
    }).done(function (studentReps) {
        $(function () {
            $("#studentgroups").jsGrid({
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
                deleteConfirm: "Do you really want to delete student group?",
                controller: {
                    loadData: function (filter) {
                        return $.ajax({
                            url: "/api/studentgroup",
                            dataType: "json",
                            data: filter
                        });
                    },
                    insertItem: function (item) {
                        return $.ajax({
                            type: "POST",
                            url: "/api/studentgroup",
                            data: item
                        });
                    },
                    updateItem: function (item) {
                        return $.ajax({
                            type: "PUT",
                            url: "/api/studentgroup",
                            data: item
                        });
                    },
                    deleteItem: function (item) {
                        return $.ajax({
                            type: "DELETE",
                            url: "/api/studentgroup",
                            data: item
                        });
                    }
                },
                fields: [
                    { name: "name", type: "text", title: "Name" },
                    { name: "count", type: "number", title: "Count" },
                    { name: "semesters", type: "number", title: "Semesters" },
                    { name: "weekendOnly", type: "checkbox", title: "Only Weekend" },
                    { name: "studentRep", type: "select", items: studentReps, valueField: "_id", textField: "email", title: "Student rep." },
                    { type: "control" }
                ]
            });
        });
    });
});