$(function () {
    $.ajax({
        type: "GET",
        url: "/api/user?role=2"
    }).done(function (professors) {
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
                        $("#seminars").jsGrid({
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
                                        url: "/api/seminar",
                                        dataType: "json",
                                        data: filter
                                    });
                                },
                                insertItem: function (item) {
                                    return $.ajax({
                                        type: "POST",
                                        url: "/api/seminar",
                                        data: item
                                    });
                                },
                                updateItem: function (item) {
                                    return $.ajax({
                                        type: "PUT",
                                        url: "/api/seminar",
                                        data: item
                                    });
                                },
                                deleteItem: function (item) {
                                    return $.ajax({
                                        type: "DELETE",
                                        url: "/api/seminar",
                                        data: item
                                    });
                                }
                            },
                            fields: [
                                { name: "studentGroupId", type: "select", items: studentGroups, valueField: "_id", textField: "name", title: "Student group" },
                                { name: "subjectId", type: "select", items: subjects, valueField: "_id", textField: "name", title: "Subject" },
                                { name: "semester", type: "number", title: "Semester" },
                                { name: "professorId", type: "select", items: professors, valueField: "_id", textField: "email", title: "Professor" },
                                { name: "weeklyHours", type: "number", title: "Hours/wk" },
                                { name: "projector", type: "checkbox", title: "Projector" },
                                { name: "blackboard", type: "checkbox", title: "Blackboard" },
                                { name: "smartboard", type: "checkbox", title: "Smartboard" },
                                { name: "computers", type: "checkbox", title: "Computers" },
                                { type: "control" }
                            ]
                        });
                    });
                });
            });
        });
    });
});