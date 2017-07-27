$(document).ready(function() {
    var listo = [];
    
    var Task = function(task, id) {
        this.task = task;
        if(!id) {
            this.id = 'new';
        } else {
            this.id = id;
        }
    }

    var addTask = function(task) {
        if(task) {
            task = new Task(task);
            listo.push(task);

            $('#newItemInput').val('');
            $('#newList').append(
                '<a href="#finish" class="" id="item">' +
                '<li class="list-group-item">' +
                '<h3>' + task.task + '</h3>'+
                '<span class="arrow pull-right">' +
                '<i class="glyphicon glyphicon-arrow-right">' +
                '</span>' +
                '</li>' +
                '</a>'
            );
        }
        $('#newTaskForm').slideToggle('fast', 'linear');
        saveListState();
    };

    var resumeTask = function(taskObj) {
        if(taskObj) {
            //taskObj = {task:'something', id:'something'}
            //newList
            //currentList
            //archivedList
            listo.push(taskObj);

            var htmlToAppend = '<a href="#finish" class="" id="item">' +
                '<li class="list-group-item">' +
                '<h3>' + taskObj.task + '</h3>'+
                '<span class="arrow pull-right">' +
                '<i class="glyphicon glyphicon-arrow-right">' +
                '</span>' +
                '</li>' +
                '</a>'

            if (taskObj.id === 'new') {
                $('#newList').append(htmlToAppend);
            } else if (taskObj.id === 'inProgress') {
                $('#currentList').append(htmlToAppend);
            } else if (taskObj.id === 'archived'){
                $('#archivedList').append(htmlToAppend);
            }
            
        }
        // $('#newTaskForm').slideToggle('fast', 'linear');
        saveListState();
    };

    var advanceTask = function(task) {
        var modified = task.innerText.trim().toLowerCase();
        for (let i = 0; i < listo.length; i++) {
            if(listo[i].task.toLowerCase() === modified) {
                if (listo[i].id === 'new') {
                    listo[i].id = 'inProgress';
                } else if (listo[i].id === 'inProgress') {
                    listo[i].id = 'archived';
                } else {
                    listo.splice(i, 1);
                }
                saveListState();
                break;
            }
        }
        task.remove();
        
    }

    function supportsLocalStorage() {
        return ('localStorage' in window) && window['localStorage'] !== null;
    }

    function saveListState() {
        if (!supportsLocalStorage()) { return false; }
        var allTasks = '';
        for (let i = 0; i < listo.length; i++) {
            var taskStoring = listo[i].task + '%**%' + listo[i].id + '%%%***%%%';
            allTasks += taskStoring;
        }
        
        localStorage["allTasks"] = allTasks;
        //
        console.log(localStorage["allTasks"]);
        return true;
    }
    
    function resumeListState() {
        if (!supportsLocalStorage()) { return false; }
        var allTaskObjects = localStorage["allTasks"].split('%%%***%%%');
        var taskObjArray = restoreTaskObjs(allTaskObjects);
        for (let i = 0; i < taskObjArray.length; i++) {
            resumeTask(taskObjArray[i]);
        }
    }

    function restoreTaskObjs(arr) {
        var objArray = [];
        for (let i = 0; i < arr.length; i++) {
            if (arr[i]) {
                objArray.push(new Task(arr[i].split('%**%')[0], arr[i].split('%**%')[1]));
            }
        }
        return objArray;
    }

    //================================================

    

    $('#newTaskForm').hide();

    resumeListState();

    $('#saveNewItem').on('click', function(e) {
        e.preventDefault();
        var task = $('#newItemInput').val().trim();
        addTask(task);
    });

    $('#add-todo').on('click', function() {
        $('#newTaskForm').fadeToggle('fast', 'linear');
    });

    $('#cancel').on('click', function(e) {
        e.preventDefault();
        $('#newTaskForm').fadeToggle('fast', 'linear');
    });

    $(document).on('click', '#item', function(e) {
        e.preventDefault();
        var task = this;
        advanceTask(task);
        this.id = 'inProgress';
        $('#currentList').append(this.outerHTML);
    });

    $(document).on('click', '#inProgress', function(e) {
        e.preventDefault();
        var task = this;
        task.id = 'archived';
        var changeIcon = task.outerHTML.replace('glyphicon-arrow-right', 'glyphicon-remove');
        advanceTask(task);
        $('#archivedList').append(changeIcon);
    });

    $(document).on('click', '#archived', function(e) {
        e.preventDefault();
        var task = this;
        advanceTask(task);
    });

    

    // $('header').on('click', function() {
    //     resumeListState();
    // });



});