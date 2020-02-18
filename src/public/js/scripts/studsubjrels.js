$(function () {
    $.ajax({
        type: "GET",
        url: "/api/subject"
    }).done(function (subjects) {
        $(function () {
            $.ajax({
                type: "GET",
                url: "/api/studentgroup"
            }).done(function (studentGroups) {
                $("#studsubjrels").jsGrid({
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
                    deleteConfirm: "Do you really want to delete student group subject relation?",
                    controller: {
                        loadData: function (filter) {
                            return $.ajax({
                                url: "/api/studsubjrel",
                                dataType: "json",
                                data: filter
                            });
                        },
                        insertItem: function (item) {
                            return $.ajax({
                                type: "POST",
                                url: "/api/studsubjrel",
                                data: item
                            });
                        },
                        updateItem: function (item) {
                            return $.ajax({
                                type: "PUT",
                                url: "/api/studsubjrel",
                                data: item
                            });
                        },
                        deleteItem: function (item) {
                            return $.ajax({
                                type: "DELETE",
                                url: "/api/studsubjrel",
                                data: item
                            });
                        }
                    },
                    fields: [
                        { name: "studentGroupId", type: "select", items: studentGroups, valueField: "_id", textField: "name", title: "Student group" },
                        { name: "subjectId", type: "select", items: subjects, valueField: "_id", textField: "name", title: "Subject" },
                        { name: "semester", type: "number", title: "Semester"},
                        { type: "control" }
                    ]
                });
            });
        });
    });
});