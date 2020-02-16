$(function () {
    $.ajax({
        type: "GET",
        url: "/api/subject"
    }).done(function (subjects) {
        $(function () {
            $.ajax({
                type: "GET",
                url: "/api/user?role=2"
            }).done(function (professors) {
                $("#profsubjrels").jsGrid({
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
                    deleteConfirm: "Do you really want to delete professor subject relation?",
                    controller: {
                        loadData: function (filter) {
                            return $.ajax({
                                url: "/api/profsubjrel",
                                dataType: "json",
                                data: filter
                            });
                        },
                        insertItem: function (item) {
                            return $.ajax({
                                type: "POST",
                                url: "/api/profsubjrel",
                                data: item
                            });
                        },
                        updateItem: function (item) {
                            return $.ajax({
                                type: "PUT",
                                url: "/api/profsubjrel",
                                data: item
                            });
                        },
                        deleteItem: function (item) {
                            return $.ajax({
                                type: "DELETE",
                                url: "/api/profsubjrel",
                                data: item
                            });
                        }
                    },
                    fields: [
                        { name: "professorId", type: "select", items: professors, valueField: "_id", textField: "email", title: "Professor" },
                        { name: "subjectId", type: "select", items: subjects, valueField: "_id", textField: "name", title: "Subject" },
                        { type: "control" }
                    ]
                });
            });
        });
    });
});