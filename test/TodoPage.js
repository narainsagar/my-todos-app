var TodoPage = function() {
	this.waitTime = 10000;

	this.getTitle = browser.getTitle();

	this.getHeader = function() {
		return element(by.css('.header-text'));
	};

	this.newTodoInput = function() {
		return element(by.id('task-entered')); 
	};

	this.newTodoDueDateInput = function() {
		return element(by.id('task-due-date')); 
	};

	this.newTodoTagsInput = function() {
		return element(by.id('task-input-tags')); 
	};

	this.checkBoxAll = function() {
		return element(by.css('.todo-checkbox-all'));
	};

	this.todoCollection = function() {
		return element.all(by.css('.collections .todoslist-container .input-group')); 
	};

	this.getByIndexElement = function(index) { 
		return this.todoCollection().get(index).element(by.css('.list-group-item')); 
	};

	this.getFirstElementMessageTextFromList = function() { 
		return this.todoCollection().first().element(by.css('.list-group-item'));
	};

	this.getByIndexCancelButton = function(index) { 
		return this.todoCollection().get(index).element(by.css('.input-group-btn .cancel-button')); 
	};

	this.getFirstElementCancelButton = function() { 
		return this.todoCollection().first().element(by.css('.input-group-btn .cancel-button')); 
	};

	this.getByIndexCheckBox = function(index) { 
		return this.todoCollection().get(index).element(by.css('.input-group-addon .task-checkbox-left')); 
	};

	this.getFirstElementCheckBoxFromList = function() { 
		return this.todoCollection().first().element(by.css('.input-group-addon .task-checkbox-left'));
	};

	this.getLastElementCheckBoxFromList = function() { 
		return this.todoCollection().last().element(by.css('.input-group-addon .task-checkbox-left'));
	};

	this.allButton = function() { 
		return element(by.id('all-button'));
	};

	this.activeButton = function() { 
		return element(by.id('active-button'));
	};
	
	this.completedButton = function() { 
		return element(by.id('completed-button'));
	};
	
	this.clearCompletedButton = function() { 
		return element(by.id('clear-completed-button'));
	};

	this.getByIndexDueDate = function(index) {
		return this.todoCollection().get(index).element(by.css('.todo-due-date'));
	};

	this.getByIndexTags = function(index) {
		return this.todoCollection().get(index).element(by.css('.todo-tags'));
	};

	this.tagsCollection = function() {
		return element.all(by.css('.collections .filter-tag')); 
	};

	this.getByIndexTagFromCollection = function(index) { 
		return this.tagsCollection().get(index);
	};

	this.hasClass = function (element, cls) {
	    return element.getAttribute('class').then(function (classes) {
	        return classes.split(' ').indexOf(cls) !== -1;
	    });
	};

	this.waitTheBrowser = function(todoCount) {
		var _this = this;
		browser.wait(function() {
			return _this.todoCollection().count().then(function(count) {
				return count === todoCount;
			});
		}, _this.waitTime * 3);//30000
	};

	this.addNewTodos = function(arr) {
		var _this = this;
		browser.sleep(_this.waitTime); // 5000
		arr.forEach(function(elementObj, index, array) {
			var message = elementObj.message;
			var dueDate = elementObj.dueDate;
			var allTags = elementObj.todoTags;
			_this.newTodoInput().sendKeys(message).then(function() {
				_this.newTodoDueDateInput().sendKeys(dueDate).then(function() {
					_this.newTodoTagsInput().click().then(function() { 
						_this.newTodoTagsInput().sendKeys(allTags).then(function() {
							_this.newTodoInput().click().then(function() {
								browser.actions().sendKeys(protractor.Key.ENTER).perform().then(function() {

								});
							});
						});
					});
				});
			});	
		});
	};

	this.resetPage = function(done) {
		var _this = this;
		browser.sleep(_this.waitTime); //5000
		_this.todoCollection().count().then(function(count) {
			for(var i=0; i < count; i++) {	
				_this.getByIndexCancelButton(i).click().then(function() {
					
				});
			}
		});
	};

	this.editTodo = function(editText, resultText) {
		var _this = this;
		var element = _this.getFirstElementMessageTextFromList();
		browser.actions().doubleClick(element).perform().then(function() {
			browser.wait(function() {
				return _this.hasClass(element, 'isEditable');
			}, _this.waitTime); // 10000
			browser.wait(function() {
				return element.isPresent();
			}, _this.waitTime); // 3000
			element.click().then(function() {
				element.clear().then(function() {
					element.sendKeys(editText).then(function() {
						browser.actions().sendKeys(protractor.Key.ENTER).perform().then(function() {
							browser.wait(function() {
								return element.getText().then(function(txt) {
									return txt === resultText;
								});
							}, _this.waitTime); // 3000
							browser.wait(function() {
								return element.isPresent();
							}, _this.waitTime); // 3000
							expect(element.getText()).toBe(resultText);
						});
					});
				});
			});	
		});
	};

	this.editTodoTags = function(updatedTags) {
		var _this = this;
		var msgelement = _this.getFirstElementMessageTextFromList();
		browser.actions().doubleClick(msgelement).perform().then(function() {
			var element = _this.getByIndexTags(0);
			browser.wait(function() {
				return _this.hasClass(element, 'isEditable');
			}, _this.waitTime); // 10000
			element.click().then(function() {
				element.clear().then(function() {
					element.sendKeys(updatedTags).then(function() {
						msgelement.click().then(function() {
							browser.actions().sendKeys(protractor.Key.ENTER).perform().then(function() {
								browser.wait(function() {
									return element.getText().then(function(txtTags) {
										return txtTags === updatedTags;
									});
								}, _this.waitTime); // 10000
								expect(element.getText()).toBe(updatedTags);
							});
						});
					});
				});
			});	
		});

	};
};

exports.TodoPage = TodoPage;