var Mustache, $, Parse;

var app = app || {};

(function($, Mustache, app, Parse) {

    Parse.initialize("nvyc2KK1flRJhYXtZPdwbRDR5phQUxTeeQpCJvIz", "yOdYeo2OC6DbRAB7FLdhsK7GbfKmjAgl0QfBlYn9");

    var TodoService = Parse.Object.extend("TodoService", {
        getId: function() {
            return this.get("uniqueId");
        },
        getMessage: function() {
            return this.get("message");
        },
        getIsCompleted: function() {
            return this.get("isCompleted");
        },
        getDueDate: function() {
            return this.get("dueDate");
        },
        getIsEditable: function() {
            return this.get("isEditable");
        },
        getTags: function() {
            return this.get("tags");
        },

        createObject: function(uniqueId, message, completed, date, tags, isEditable, doSave, render) {
            this.set("uniqueId", uniqueId);
            this.set("message", message);
            this.set("isCompleted", completed);
            this.set("dueDate", date);
            this.set("isEditable", isEditable);
            this.set("tags", tags);

            if( doSave ){ this.saveObject(render); }
            return this;
        },

        saveObject: function(callback) {
            this.save(null, {
                success: function() {
                    callback();
                },
                error: function(error) {
                    $('.error span').text('Failed to createObject new object, with error code: ' + error.message);
                }
            });
        },

        updateObjectByValueParams: function(message, date, tags, isEditable, callback) {
            this.set("message", message);
            this.set("dueDate", date);
            this.set("isEditable", isEditable);
            this.set("tags", tags);

            this.save(null, {
                success: function() {
                //    callback();
                },
                error: function(object, error) {
                    $('.error span').text("Error: " + error.message);
                }
            });
        },

        updateObjectByKeyValue: function(key, value, callback) {
            this.set(key, value);
            this.save(null, {
                success: function() {
                //    callback();
                },
                error: function(object, error) {
                    $('.error span').text("Error: " + error.message);
                }
            });
        },
        deleteObject: function(callback) {
            this.destroy({
                success: function() {
                    callback();
                },
                error: function(object, error) {
                 $('.error span').text("Error: " + error.message);
                }
            });
        },
        fetchAllObjects: function(callback) {
            new Parse.Query(Parse.Object.extend("TodoService")).find({
                success:function(results) {
                    callback(results);
                },
                error: function(error){
                    $('.error span').text("Error: " + error.message);         
                }
            });
        },
    });


    var TodoCollectionModel = {
        todoCollectionList: [],
        syncLocalStorageWithCloud: function(renderPage) {
            (new TodoService()).fetchAllObjects(renderPage);
        },
        updateLocalFromCloud: function(results) {
            this.todoCollectionList = results;
            TodoCollectionModel.setterLocalStorage();
        },
        setterLocalStorage: function() {
            localStorage.setItem("todos", JSON.stringify(this.todoCollectionList));
        },
        getterLocalStorage: function(renderPage) {
            if(localStorage.getItem('todos')) {
                this.todoCollectionList = [];
                var localCollection = JSON.parse(localStorage.getItem("todos"));
                for( var i=0; i < localCollection.length; i++ ) {
                   this.todoCollectionList.push(new TodoService().createObject(localCollection[i].uniqueId, localCollection[i].message, localCollection[i].isCompleted, localCollection[i].dueDate, localCollection[i].tags, localCollection[i].isEditable, false));
                }
            }
            renderPage();
        },
        getTodosLength: function() {
            return this.todoCollectionList.length;
        },
        add: function(message, dueDate, tags, renderFunction) {
            var uniqueId = "todo-" + Date.now();
            this.todoCollectionList.push(new TodoService().createObject(uniqueId, message, false, dueDate, tags, false, true, renderFunction));
            TodoCollectionModel.setterLocalStorage();
        //    renderFunction();
        },
        getIndexBy: function (value) {
            for (var i = 0; i < this.todoCollectionList.length; i++) {
                if (this.todoCollectionList[i].getId() == value) {
                    return i;
                }
            }
        },
        getIndex: function(mid) {
            return this.getIndexBy(mid);
        },
        toggle: function(index, renderFunction) {
            if (index > -1) {
                this.todoCollectionList[index].updateObjectByKeyValue("isCompleted", !this.todoCollectionList[index].getIsCompleted(), renderFunction);
                TodoCollectionModel.setterLocalStorage();
                renderFunction();
            }
        },
        delete: function(index, renderFunction) {
            if (index > -1) {
                this.todoCollectionList[index].deleteObject(renderFunction);
                this.todoCollectionList.splice(index, 1);
                TodoCollectionModel.setterLocalStorage();
            //    renderFunction();
            }
        },
        updateByKey: function(index, key, val, renderFunction) {
            if( index > -1) {
                this.todoCollectionList[index].updateObjectByKeyValue(key, val, renderFunction); 
                TodoCollectionModel.setterLocalStorage();
                renderFunction();
            }
        },
        updateByValues: function(index, message, dueDate, tags, isEditable, renderFunction) {
            if( index > -1) {
                this.todoCollectionList[index].updateObjectByValueParams(message, dueDate, tags, isEditable, renderFunction);
                TodoCollectionModel.setterLocalStorage();
                renderFunction();
            }
        },
        filter: function(state) {
            return this.todoCollectionList.filter(function(obj) {
                if(state !== -1 ) {
                    return (obj.getIsCompleted() === Boolean(state));
                }
                return true;
            });
        },
        toggleAll: function(markAll, renderFunction) {
            for( var i = 0; i < this.todoCollectionList.length; i++ ) {
                if(markAll !== this.todoCollectionList[i].getIsCompleted()) { 
                    this.todoCollectionList[i].updateObjectByKeyValue("isCompleted", markAll, renderFunction);
                }
            }
            TodoCollectionModel.setterLocalStorage();
            renderFunction();
        },
        clearCompleted: function(renderFunction) {
            for( var i = 0; i < this.todoCollectionList.length; i++ ) {
                if(this.todoCollectionList[i].getIsCompleted() === true) {
                    this.todoCollectionList[i].deleteObject(renderFunction);
                    this.todoCollectionList.splice(i, 1);
                    i--;
                }
            }
            TodoCollectionModel.setterLocalStorage();
        //    renderFunction();
        },
        getTotalIncomplete: function() {
            return this.todoCollectionList.filter(function(obj) {
                return obj.getIsCompleted() === false;
            }).length;
        },
        getTodayDate: function() {
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1; //January is 0!
            var yyyy = today.getFullYear();
            if(dd < 10){
                dd = '0' + dd;
            } 
            if(mm < 10){
                mm = '0' + mm;
            } 
            today = dd + '/' + mm + '/' + yyyy;

            return today.toString();
        },
        dateChecker: function(today, dueDate) {
            today = Date.parse(today);
            dueDate = Date.parse(dueDate);

            var retResultClass = '';
            if(today === dueDate){
                retResultClass += ' color-green';
            }
            else if(today > dueDate){
                retResultClass += ' color-red';
            }
            return retResultClass;

        },
        getAllTags: function(state) {
            var allTags = [];
            TodoCollectionModel.filter(state).map(function(obj) {
                var theTags = obj.getTags().split(', ');
                for(var i = 0; i < theTags.length; i++) {
                    if (theTags[i].trim()!== "" && allTags.indexOf(theTags[i].trim()) === -1) {
                        allTags.push(theTags[i].trim());
                    }
                }
                return true;
            });
            return allTags.map(function(item) {
                return {tagValue: item};
            });
        },
        getFilteredCollection: function(state, tagValue) {
            var resultCollection = TodoCollectionModel.filter(state).map(function(obj) {
                return { uniqueId: obj.getId(), message: obj.getMessage(), isCompleted: obj.getIsCompleted(), 
                    dueDate: obj.getDueDate(), tags: obj.getTags(), isEditable: obj.getIsEditable(), 
                    dateCheck: TodoCollectionModel.dateChecker(TodoCollectionModel.getTodayDate(), obj.getDueDate()) };
            });

            if( tagValue !== "") {
                return resultCollection.filter(function(obj) {
                    var tags = obj.tags.split(', ').map(function(tag) {
                        return jQuery.trim(tag);
                    });
                    return (tags.indexOf(tagValue) !== -1);
                });
            }
            else {
                return resultCollection;
            }      
        }
    };

    app.TodoCollectionModel = TodoCollectionModel;

    var TodoController = {
        clickedTag: "",
        state: -1,
        ChangeState: function(state) {
            this.state = state;
            TodoController.renderPage(); 
        },
        getFooterColorClass: function(st) {
            var retClass = '';
            if(this.state === st) {
                retClass = ' selected';
            }
            return retClass;
        },
        toggleAll: function() {
            TodoCollectionModel.toggleAll($(this).prop("checked"), TodoController.renderPage);
        },
        add: function(e) {
            if(e.keyCode == 13) {
                if(jQuery.trim($('#task-entered').val()).length !== 0) {
                    TodoCollectionModel.add($('#task-entered').val(), jQuery.trim($('#task-due-date').val()), jQuery.trim($('#task-input-tags').val()), TodoController.renderPage);
                    $('#task-entered').val('');
                    $('#task-due-date').val('');
                    $('#task-input-tags').val('');
                    return false;
                }
            }
        },
        allowToEdit: function() {
            TodoCollectionModel.updateByKey(TodoCollectionModel.getIndex($(this).parent().attr('id')), "isEditable", true, TodoController.renderPage);
            TodoController.bindingOtherElements();
        },
        edit: function(e) {
            if(e.keyCode == 13) {
                if(jQuery.trim($(this).text()).length !== 0) {
                    var todoDate = $("#" + $(this).parent().attr('id') + " .todo-due-date").text();
                    var updatedTags = jQuery.trim($("#" + $(this).parent().attr('id') + " .todo-tags").text());
                    $('.error span').text('');
                    TodoCollectionModel.updateByValues(TodoCollectionModel.getIndex($(this).parent().attr('id')), $(this).text(), todoDate, updatedTags, false, TodoController.renderPage);
                    return false;
                }
                else {
                    $(this).val(TodoCollectionModel.todoCollectionList[TodoCollectionModel.getIndex($(this).parent().attr('id'))].getMessage());
                    $('.error span').text("sorry! can not be updated to empty text.");
                    TodoController.renderPage();
                }
            }
        },
        remove: function() {
            TodoCollectionModel.delete(TodoCollectionModel.getIndex($(this).parent().parent().attr('id')), TodoController.renderPage);  
        },
        toggle: function() {
            TodoCollectionModel.toggle(TodoCollectionModel.getIndex($(this).parent().parent().attr('id')), TodoController.renderPage);
        },
        clearAllCompleted: function() {
            TodoCollectionModel.clearCompleted(TodoController.renderPage);    
        },
        filterByTag: function() {
            TodoController.clickedTag = jQuery.trim($(this).text()).toString();
            TodoController.renderPage();
            TodoController.clickedTag = "";
        },
        renderList: function() {
            var template = $('#todo-template-list').html();
            var rendered = Mustache.render( template, {todos: TodoCollectionModel.getFilteredCollection(this.state, this.clickedTag), tagsCollection: TodoCollectionModel.getAllTags(this.state)});
            $('#show-list-block').html( rendered );
        },
        renderFooter: function() {
            var template = $('#todo-footer-clear-completed').html();
            var rendered = Mustache.render( template, { todoCompleteState: TodoController.getFooterColorClass(1), todoActiveState: TodoController.getFooterColorClass(0), todoAllState: TodoController.getFooterColorClass(-1), totalTodosIncompleted: TodoCollectionModel.getTotalIncomplete(),totalTodosCompleted: TodoCollectionModel.getTodosLength() - TodoCollectionModel.getTotalIncomplete()});
            $('#show-todos-completed').html( rendered );
        },
        renderPage: function() {
            TodoController.bindingHeaderElements();
            TodoController.renderList();
            TodoController.renderFooter();
            TodoController.bindingOtherElements();
        },
        bindingHeaderElements: function() {
            $('#task-entered').keyup(TodoController.add);
            $('.todo-checkbox-all').click(TodoController.toggleAll);
        },
        bindingOtherElements: function() {
            $('.list-group-item').dblclick(TodoController.allowToEdit);
            $('.list-group-item').keydown(TodoController.edit);
            $('.task-checkbox-left').click(TodoController.toggle);
            $('.cancel-button').click(TodoController.remove);
            $('#all-button').click(function() { TodoController.ChangeState(-1); });
            $('#active-button').click(function() { TodoController.ChangeState(0); });
            $('#completed-button').click(function() { TodoController.ChangeState(1); });
            $('#clear-completed-button').click(TodoController.clearAllCompleted);
            $('.filter-tag').click(TodoController.filterByTag);
        }
    };
    TodoCollectionModel.getterLocalStorage(TodoController.renderPage);
    TodoCollectionModel.syncLocalStorageWithCloud(function(results) {
        TodoCollectionModel.updateLocalFromCloud(results);
        TodoController.renderPage();
    });
})
($,Mustache, app, Parse);
