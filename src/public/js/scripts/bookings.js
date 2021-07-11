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
                        url: "/api/room"
                    }).done(function (rooms) {
                        $(function () {
                            $.ajax({
                                type: "GET",
                                url: "/api/studentgroup"
                            }).done(function (studentGroups) {
                                $("#bookings").jsGrid({
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
                                    deleteConfirm: "Are you sure you want to delete the booking?",
                                    controller: {
                                        loadData: function (filter) {
                                            return $.ajax({
                                                url: "/api/booking",
                                                dataType: "json",
                                                data: filter
                                            });
                                        },
                                        insertItem: function (item) {
                                            return $.ajax({
                                                type: "POST",
                                                url: "/api/booking",
                                                data: item
                                            });
                                        },
                                        updateItem: function (item) {
                                            return $.ajax({
                                                type: "PUT",
                                                url: "/api/booking",
                                                data: item
                                            });
                                        },
                                        deleteItem: function (item) {
                                            return $.ajax({
                                                type: "DELETE",
                                                url: "/api/booking",
                                                data: item
                                            });
                                        }
                                    },
                                    fields: [
                                        { name: "semester", type: "number", title: "Semester" },
                                        { name: "studentGroupId", type: "select", items: studentGroups, valueField: "_id", textField: "name", title: "Group" },
                                        { name: "subjectId", type: "select", items: subjects, valueField: "_id", textField: "name", title: "Subject" },
                                        { name: "professorId", type: "select", items: professors, valueField: "_id", textField: "email", title: "Professor" },
                                        { name: "roomId", type: "select", items: rooms, valueField: "_id", textField: "name", title: "Room" },
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
                                            title: "Day"
                                        },
                                        { name: "startHour", type: "number", title: "Starts" },
                                        { name: "duration", type: "number", title: "Duration" },
                                        { type: "control" }
                                    ]
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}); 