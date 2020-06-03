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
                        url: "/api/series"
                    }).done(function (series) {
                        $("#courses").jsGrid({
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
                                        url: "/api/course",
                                        dataType: "json",
                                        data: filter
                                    });
                                },
                                insertItem: function (item) {
                                    return $.ajax({
                                        type: "POST",
                                        url: "/api/course",
                                        data: item
                                    });
                                },
                                updateItem: function (item) {
                                    return $.ajax({
                                        type: "PUT",
                                        url: "/api/course",
                                        data: item
                                    });
                                },
                                deleteItem: function (item) {
                                    return $.ajax({
                                        type: "DELETE",
                                        url: "/api/course",
                                        data: item
                                    });
                                }
                            },
                            fields: [
                                { name: "seriesId", type: "select", items: series, valueField: "_id", textField: "name", title: "Series" },
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