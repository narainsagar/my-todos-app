/* jshint undef: true, unused: true */
/* global TodoController */

var TodoController = {
    tagState: "",
    state: -1,
    changeState: function(state) {
        this.state = state;
        TodoController.renderPage(); 
    },
    getFooterColorClass: function(st) {
        var retClass = '';
        if(TodoController.state === st) {
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
                TodoCollectionModel.add( $('#task-entered').val(), jQuery.trim($('#task-due-date').val()), 
                    jQuery.trim($('#task-input-tags').val()), TodoController.renderPage );
                $('#task-entered').val('');
                $('#task-due-date').val('');
                $('#task-input-tags').val('');
                return false;
            }
        }
    },
    allowToEdit: function() {
        TodoCollectionModel.updateByKey(TodoCollectionModel.getIndex($(this).parent().attr('id')),
         "isEditable", true, TodoController.renderPage);
        TodoController.bindingOtherElements();
    },
    edit: function(e) {
        if(e.keyCode == 13) {
            if(jQuery.trim($(this).text()).length !== 0) {
                var todoDate = $("#" + $(this).parent().attr('id') + " .todo-due-date").text();
                var updatedTags = jQuery.trim($("#" + $(this).parent().attr('id') + " .todo-tags").text());
                $('.error span').text('');
                TodoCollectionModel.updateByValues(TodoCollectionModel.getIndex($(this).parent().attr('id')),
                 $(this).text(), todoDate, updatedTags, false, TodoController.renderPage);
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
        TodoController.tagState = jQuery.trim($(this).text()).toString();
        TodoController.renderPage();
    },
    renderList: function() {
        var template = $('#todo-template-list').html();
        var rendered = Mustache.render( template, {todos: TodoCollectionModel.getFilteredCollection(TodoController.state, TodoController.tagState),
         tagsCollection: TodoCollectionModel.getAllTags(TodoController.state, TodoController.tagState)} );
        $('#show-list-block').html( rendered );
    },
    renderFooter: function() {
        var template = $('#todo-footer-clear-completed').html();
        var rendered = Mustache.render( template, { todoCompleteState: TodoController.getFooterColorClass(1),
         todoActiveState: TodoController.getFooterColorClass(0), todoAllState: TodoController.getFooterColorClass(-1), 
         totalTodosIncompleted: TodoCollectionModel.getTotalIncomplete(),
         totalTodosCompleted: TodoCollectionModel.getTodosLength() - TodoCollectionModel.getTotalIncomplete()} );
        $('#show-todos-completed').html( rendered );
    },
    renderPage: function() {
        TodoController.bindingHeaderElements();
        TodoController.renderList();
        TodoController.renderFooter();
        TodoController.bindingOtherElements();
    },
    start: function() {
        TodoCollectionModel.getterLocalStorage(TodoController.renderPage);
        TodoCollectionModel.syncLocalStorageWithCloud(function(results) {
            TodoCollectionModel.updateLocalFromCloud(results);
            TodoController.renderPage();
        });
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
        $('#all-button').click(function() { TodoController.changeState(-1); });
        $('#active-button').click(function() { TodoController.changeState(0); });
        $('#completed-button').click(function() { TodoController.changeState(1); });
        $('#clear-completed-button').click(TodoController.clearAllCompleted);
        $('.filter-tag').click(TodoController.filterByTag);
    }
};