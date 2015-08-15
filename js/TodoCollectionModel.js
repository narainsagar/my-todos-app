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
               this.todoCollectionList.push( new TodoService().createObject(localCollection[i].uniqueId, 
                localCollection[i].message, localCollection[i].isCompleted, localCollection[i].dueDate,
                localCollection[i].tags, localCollection[i].isEditable, false) );
            }
        }
        renderPage();
    },
    getTodosLength: function() {
        return this.todoCollectionList.length;
    },
    add: function(message, dueDate, tags, renderFunction) {
        var uniqueId = "todo-" + Date.now();
        this.todoCollectionList.push( new TodoService().createObject(uniqueId, message, false, 
            dueDate, tags, false, true, renderFunction) );
        TodoCollectionModel.setterLocalStorage();
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
            this.todoCollectionList[index].updateObjectByKeyValue( "isCompleted", 
                !this.todoCollectionList[index].getIsCompleted() );
            TodoCollectionModel.setterLocalStorage();
            renderFunction();
        }
    },
    delete: function(index, renderFunction) {
        if (index > -1) {
            this.todoCollectionList[index].deleteObject(renderFunction);
            this.todoCollectionList.splice(index, 1);
            TodoCollectionModel.setterLocalStorage();
        }
    },
    updateByKey: function(index, key, val, renderFunction) {
        if( index > -1) {
            this.todoCollectionList[index].updateObjectByKeyValue(key, val); 
            TodoCollectionModel.setterLocalStorage();
            renderFunction();
        }
    },
    updateByValues: function(index, message, dueDate, tags, isEditable, renderFunction) {
        if( index > -1) {
            this.todoCollectionList[index].updateObjectByValueParams(message, dueDate, tags, isEditable);
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
                this.todoCollectionList[i].updateObjectByKeyValue("isCompleted", markAll);
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
    },
    getTotalIncomplete: function() {
        return this.todoCollectionList.filter(function(obj) {
            return obj.getIsCompleted() === false;
        }).length;
    },
    getTodayDate: function() {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
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
    getAllTags: function(state, tagVal) {
        var allTags = [];
        TodoCollectionModel.filter(state).map(function(obj) {
            var tagState = false;
            var theTags = obj.getTags().split(',').map(function(tag) {
                if(jQuery.trim(tag) === tagVal) {
                    tagState = true;
                }
                return jQuery.trim(tag);
            });  
            if ( tagState || tagVal === "" ) {
                theTags.forEach(function(element, index, value) {
                    if( element !== "" && allTags.indexOf(element) === -1) {
                        allTags.push(element.trim());
                    }
                });  
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
                var theTags = obj.tags.split(',').map(function(tag) {
                    return jQuery.trim(tag);
                });
                return (theTags.indexOf(tagValue) !== -1);
            });
        }
        else {
            return resultCollection;
        }      
    }
};