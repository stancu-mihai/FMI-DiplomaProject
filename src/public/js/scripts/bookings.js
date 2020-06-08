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
                                    pagerFormat: "Pagini: {first} {prev} {pages} {next} {last}    {pageIndex} din {pageCount}",
                                    pagePrevText: "Anterioara",
                                    pageNextText: "Următoarea",
                                    pageFirstText: "Prima",
                                    pageLastText: "Ultima",
                                    searchModeButtonTooltip: "Comută la căutare", 
                                    insertModeButtonTooltip: "Comută la inserare", 
                                    editButtonTooltip: "Modifică",                      
                                    deleteButtonTooltip: "Sterge",                  
                                    searchButtonTooltip: "Caută",                  
                                    clearFilterButtonTooltip: "Sterge filtru",       
                                    insertButtonTooltip: "Inserează",                  
                                    updateButtonTooltip: "Actualizează",                  
                                    cancelEditButtonTooltip: "Anulează modificare", 
                                    deleteConfirm: "Chiar doriți ștergerea rezervării?",
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
                                        { name: "semester", type: "number", title: "Semestru" },
                                        { name: "studentGroupId", type: "select", items: studentGroups, valueField: "_id", textField: "name", title: "Grupă" },
                                        { name: "subjectId", type: "select", items: subjects, valueField: "_id", textField: "name", title: "Materie" },
                                        { name: "professorId", type: "select", items: professors, valueField: "_id", textField: "email", title: "Profesor" },
                                        { name: "roomId", type: "select", items: rooms, valueField: "_id", textField: "name", title: "Sală" },
                                        {
                                            name: "weekDay",
                                            type: "select",
                                            items: [
                                                { Name: "Luni", Id: "0" },
                                                { Name: "Marți", Id: "1" },
                                                { Name: "Miercuri", Id: "2" },
                                                { Name: "Joi", Id: "3" },
                                                { Name: "Vineri", Id: "4" },
                                                { Name: "Sâmbătă", Id: "5" },
                                                { Name: "Duminică", Id: "6" }
                                            ],
                                            valueField: "Id",
                                            textField: "Name",
                                            title: "Ziua"
                                        },
                                        { name: "startHour", type: "number", title: "Oră" },
                                        { name: "duration", type: "number", title: "Durată" },
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