(function ($) {

    var controller = {

        table: undefined,
        container: undefined,
        headers: undefined,
        hide: [],
        data: [],
        addDatabase: function (data) {
            console.log('write add database function, data = ');
            console.log(data);
        },
        updateDatabase: function (data) {
            console.log('write update database function, data = ');
            console.log(data);
        },
        deleteDatabase: function (data) {
            console.log('write delete database function, data = ');
            console.log(data);
        },
        readDatabase: function () {
            return null;
        },
        spacer: function (str) {
            var n = str.search(/([a-z][A-Z])/);
            var txt = str.replace(str.substring(0, n + 1), str.substring(0, n + 1) + " ");
            return txt;
        },
        nameValue: function (data) {
            r = {};
            data.forEach(element => {
                r[element.name] = element.value;
            });
            return r;
        },
        _loadData: function () {

            var Headers = [];

            for (key in this.data[0]) {
                var a = controller.hide.find(function (element) {
                    return (element === key);
                })

                if (!a) {
                    Headers.push(key);
                }
            }
            this.headers = Headers;
            var i = 0;

            this.container.find('thead tr th').each(
                function () {
                    $(this).text(controller.spacer(controller.headers[i++]));
                }
            );

            this.data.forEach(row => {
                var r = [];

                controller.headers.forEach(element => {
                    r.push(row[element]);
                });

                this.table.row.add(r).draw(false);

            });
        },
        view: function () {

            this.container.find('tbody').on('click', 'tr', function () {
                if ($(this).hasClass('selected')) {
                    $(this).removeClass('selected');
                } else {
                    controller.table.$('tr.selected').removeClass('selected');
                    $(this).addClass('selected');
                    //console.log($(this).children('td:nth-child(3)').text());
                    var form = "";
                    var i = 1;
                    $(this).children().each(function () {
                        var name = controller.headers[i - 1];
                        var rbc = $('#example thead tr').children('th:nth-child(' + i++ + ')').attr('rbc');
                        var value = $(this).text();
                        form += '<div class="form-group row">' +
                            '<div class="col-3"><label for="' + name + '" class="col-form-label">' + name + '</label></div>' +
                            '<div class="col-9"><input ' + rbc + ' class="form-control" id="' + name + '" value="' + value + '" name="' + name + '" required/></div>' +
                            '</div>';

                    })
                    var a = false;
                    $.sweetModal({
                        title: 'Crud Table Form<h6>You can Create Delete Update your data<h6>',
                        blocking: true,
                        content: '<form id="form1">' +
                            form +
                            '</form>',
                        onOpen: function () {

                            $('#form1 input').attr('readonly', true);
                            $('.btnUpdate').hide();

                        },
                        buttons: {
                            add: {
                                label: 'Create',
                                classes: 'greenB btnAdd',
                                type: 'button',
                                blocking: true,
                                action: function () {
                                    $('.btnUpdate').show();
                                    $('.btnEdit').hide();
                                    $('.btnAdd').hide();
                                    $('.btnDelete').hide();
                                    $('#form1 input').removeAttr('readonly');
                                    $('#form1 input').removeAttr('readonly');
                                    $('#form1 input').attr('value', "");
                                    a = true;
                                    return false;

                                }
                            },
                            saveChanage: {
                                label: 'Save Chanage',
                                classes: 'btnUpdate',
                                type: 'button',
                                blocking: true,
                                action: function () {
                                    var d = controller.nameValue($('#form1').serializeArray());

                                    if ($('#form1').valid()) {
                                        if (a) {
                                            controller.addDatabase(d);
                                            controller.container.refreshTable();

                                        } else {
                                            controller.updateDatabase(d);
                                            controller.container.refreshTable();
                                        }
                                        return true;
                                    }
                                    return false;
                                }
                            },
                            edit: {
                                label: 'edit',
                                classes: 'btnEdit',
                                type: 'button',
                                blocking: true,
                                action: function () {
                                    $('.btnUpdate').show();
                                    $('.btnEdit').hide();
                                    $('.btnAdd').hide();
                                    $('.btnDelete').hide();
                                    $('#form1 input').removeAttr('readonly');


                                    return false;
                                }
                            },
                            delete: {
                                label: 'Delete',
                                classes: 'redB btnDelete',
                                type: 'button',
                                blocking: true,
                                action: function () {
                                    var d = controller.nameValue($('#form1').serializeArray());
                                    swal({
                                        title: "Are you sure?",
                                        text: "You will not be able to recover this delete!",
                                        icon: "warning",
                                        buttons: [
                                            'No, cancel it!',
                                            'Yes, I am sure!'
                                        ],
                                        dangerMode: true,
                                    }).then(function (isConfirm) {
                                        if (isConfirm) {
                                            controller.deleteDatabase(d);
                                            controller.refreshTable();

                                        } else {

                                        }
                                    })


                                    return true;
                                }
                            },

                        }
                    });
                }
            });

        }


    }

    //publish
    $.fn.setData = function (data) {
        controller.data = data;
    }



    $.fn.refreshTable = function () {
        
            this.setData(controller.readDatabase())
        
        controller._loadData(this);

    }

    $.fn.addData = function (data) {

        data.forEach(row => {
            var r = [];
            controller.headers.forEach(element => {
                r.push(row[element]);
            });

            controller.data.push(row);
            controller.addDatabase(row);
            controller.table.row.add(r).draw(false);

        });

    }

    $.fn.getData = function () {

        return controller.data;

    }

    $.fn.removeData = function () {

    }


    $.fn.crudTable = function (option = {}) {

        option.table = this.DataTable();
        option.container = this;
        this.setOption(option);
        controller.view();
        return this;

    }

    $.fn.setOption = function (option) {

        if (option.table !== undefined) {
            controller.table = option.table;
        }
        if (option.container !== undefined) {
            controller.container = option.container;
        }
        if (option.hide !== undefined) {
            controller.hide = option.hide;
        }
        if (option.data !== undefined) {
            this.setData(option.data);
            this.refreshTable();
        }
        if (option.addDatabase !== undefined) {
            controller.addDatabase = option.addDatabase;
        }
        if (option.updateDatabase !== undefined) {
            controller.updateDatabase = option.updateDatabase;
        }
        if (option.deleteDatabase !== undefined) {
            controller.deleteDatabase = option.deleteDatabase;
        }
        if (option.readDatabase !== undefined) {
            controller.readDatabase = option.readDatabase;
            this.setData(controller.readDatabase());
            this.refreshTable();
        }
    }

}(jQuery));