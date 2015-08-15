Parse.initialize( "nvyc2KK1flRJhYXtZPdwbRDR5phQUxTeeQpCJvIz", 
    "yOdYeo2OC6DbRAB7FLdhsK7GbfKmjAgl0QfBlYn9" );

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

    createObject: function(uniqueId, message, completed, date, tags, isEdit, doSave, renderFunc) {
        this.set("uniqueId", uniqueId);
        this.set("message", message);
        this.set("isCompleted", completed);
        this.set("dueDate", date);
        this.set("isEditable", isEdit);
        this.set("tags", tags);

        if( doSave ){ 
            this.saveObject(renderFunc);
        }
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

    updateObjectByValueParams: function(message, date, tags, isEdit) {
        this.set("message", message);
        this.set("dueDate", date);
        this.set("isEditable", isEdit);
        this.set("tags", tags);

        this.save(null, {
            success: function() {

            },
            error: function(object, error) {
                $('.error span').text("Error: " + error.message);
            }
        });
    },

    updateObjectByKeyValue: function(key, value) {
        this.set(key, value);
        this.save(null, {
            success: function() {

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