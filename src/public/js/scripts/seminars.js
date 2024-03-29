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
                            pagerFormat: "Page: {first} {prev} {pages} {next} {last}    {pageIndex} of {pageCount}",
                            pagePrevText: "Prev",
                            pageNextText: "Next",
                            pageFirstText: "First",
                            pageLastText: "Last",
                            searchModeButtonTooltip: "Search mode", 
                            insertModeButtonTooltip: "Insert mode", 
                            editButtonTooltip: "Edit",                      
                            deleteButtonTooltip: "Remove",                  
                            searchButtonTooltip: "Search",                  
                            clearFilterButtonTooltip: "Delete filter",       
                            insertButtonTooltip: "Insert",                  
                            updateButtonTooltip: "Update",                  
                            cancelEditButtonTooltip: "Cancel edit", 
                            deleteConfirm: "Are you sure you want to delete the seminar?",
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
                                { name: "studentGroupId", type: "select", items: studentGroups, valueField: "_id", textField: "name", title: "Group" },
                                { name: "subjectId", type: "select", items: subjects, valueField: "_id", textField: "name", title: "Subject" },
                                { name: "semester", type: "number", title: "Semester" },
                                { name: "professorId", type: "select", items: professors, valueField: "_id", textField: "email", title: "Professor" },
                                { name: "weeklyHours", type: "number", title: "Hours/wk" },
                                { name: "projector", type: "checkbox", title: "Projector" },
                                { name: "blackboard", type: "checkbox", title: "Blackboard" },
                                { name: "smartboard", type: "checkbox", title: "Smartboard" },
                                { name: "computers", type: "checkbox", title: "PCs" },
                                { type: "control" }
                            ]
                        });
                    });
                });
            });
        });
    });
});