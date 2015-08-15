
var TodoPage = require('./TodoPage.js').TodoPage;

describe('Todos Task Managment.', function() {

	browser.ignoreSynchronization = true;
	browser.get('/');

	var todoPage = new TodoPage();

	beforeEach(function() {

		browser.refresh();
		todoPage.resetPage();
		todoPage.waitTheBrowser(0);
	
	});	

	it('should be empty..', function() {

		expect(todoPage.todoCollection().count()).toBe(0);

	});

	it('should add new todo', function() {	

		todoPage.addNewTodos([{message: "test1", dueDate: "", todoTags: "" }]);
		todoPage.waitTheBrowser(1);
		
		expect(todoPage.todoCollection().count()).toEqual(1);
		expect(todoPage.getFirstElementMessageTextFromList().getText()).toBe("test1");

	});

	it('should not add empty todo', function() {

		todoPage.addNewTodos([{message: "", dueDate: "", todoTags: "" }]);
		todoPage.waitTheBrowser(0);
		expect(todoPage.todoCollection().count()).toEqual(0);

	});

	it('should not add todo with only whitespace chars', function() {
		
		todoPage.addNewTodos([{message: "       ", dueDate: "", todoTags: "" }]);
		todoPage.waitTheBrowser(0);
		expect(todoPage.todoCollection().count()).toEqual(0);

	});

	it('should delete a todo', function() {
		
		todoPage.addNewTodos([{message: "Best!", dueDate: "", todoTags: "" }]);
		todoPage.waitTheBrowser(1);

		todoPage.getByIndexCancelButton(0).click().then(function() {
			todoPage.waitTheBrowser(0);
			expect(todoPage.todoCollection().count()).toEqual(0);
		});

	});

	it('should edit a todo', function() {

		todoPage.addNewTodos([{message: "Google!", dueDate: "", todoTags: "" }]);
		todoPage.waitTheBrowser(1);
		todoPage.editTodo("YAHOO!", "YAHOO!");

	});

	it('should not edit a todo to an empty todo', function() {
		
		todoPage.addNewTodos([{message: "Facebook!", dueDate: "", todoTags: "" }]);
		todoPage.waitTheBrowser(1);
		todoPage.editTodo("", "Facebook!");

	});

	it('should not edit a todo to a todo having only whitespaces', function() {
		
		todoPage.addNewTodos([{message: "Microsoft!", dueDate: "", todoTags: "" }]);
		todoPage.waitTheBrowser(1);
		todoPage.editTodo("     ", "Microsoft!");

	});


	it('should clear all completed todos', function() {
		
		todoPage.addNewTodos([{message: "hello", dueDate: "", todoTags: "" }, {message: "testin!", dueDate: "", todoTags: "" }]);
		browser.sleep(todoPage.waitTime); // 10000
		todoPage.waitTheBrowser(2);

		todoPage.getFirstElementCheckBoxFromList().click().then(function() {
			todoPage.getLastElementCheckBoxFromList().click().then(function() {
				browser.wait(function() { 
					return todoPage.clearCompletedButton().isDisplayed();
				}, todoPage.waitTime); // 5000
				todoPage.clearCompletedButton().click().then(function() {
					todoPage.waitTheBrowser(0);
					todoPage.todoCollection().count().then(function(count) {
						expect(count).toBe(0);
					});
				});
			});
		});

	});	
	
	it('should check filter for all todos', function() {
		
		todoPage.addNewTodos([{message: "done!", dueDate: "", todoTags: "" }, {message: "test", dueDate: "", todoTags: "" }]);
		browser.sleep(todoPage.waitTime); // 10000
		todoPage.waitTheBrowser(2);

		todoPage.getFirstElementCheckBoxFromList().click().then(function() {
			todoPage.allButton().click().then(function() {
				todoPage.todoCollection().count().then(function(count) {
					expect(count).toBe(2);
				});
			});
		});

	});
	
	it('should check filter for active todos', function() {

		todoPage.addNewTodos([{message: "hello.", dueDate: "", todoTags: "" }, {message: "narain", dueDate: "", todoTags: "" }]);
		browser.sleep(todoPage.waitTime); // 10000
		todoPage.waitTheBrowser(2);

		todoPage.getFirstElementCheckBoxFromList().click().then(function() {
			todoPage.activeButton().click().then(function() {
				todoPage.todoCollection().count(function(count) {
					expect(count).toBe(1);
				});
			});
		});
	});

	it('should check filter for completed todos', function() {

		todoPage.addNewTodos([{message: "testing.", dueDate: "", todoTags: "" }, {message: "done!", dueDate: "", todoTags: "" }]);
		browser.sleep(todoPage.waitTime); // 10000
		todoPage.waitTheBrowser(2);

		todoPage.getLastElementCheckBoxFromList().click().then(function() {
			todoPage.completedButton().click().then(function() {
				todoPage.todoCollection().count(function(count) {
					expect(count).toBe(1);
				});
			});
		});

	});



});	