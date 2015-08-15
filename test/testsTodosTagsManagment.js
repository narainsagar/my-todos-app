
var TodoPage = require('./TodoPage.js').TodoPage;

describe('Todos Tags Managment.', function() {

	browser.ignoreSynchronization = true;
	browser.get('/');

	var todoPage = new TodoPage();

	beforeEach(function() {

		browser.refresh();
		todoPage.resetPage();
		todoPage.waitTheBrowser(0);
	
	});	

	it('should add todo with tags', function() {

		todoPage.addNewTodos( [{message: "Hello Todo1!", dueDate: "09/08/2015", todoTags: "test, js, angular" }] );

		todoPage.waitTheBrowser(1);

		expect(todoPage.todoCollection().count()).toBe(1);

		expect(todoPage.getByIndexTags(0).getText()).toBe("test, js, angular");

	});


	it('should allow tags to edit when a todo is being edited.', function() {

		todoPage.addNewTodos( [{message: "Hello Todo2!", dueDate: "10/08/2015", todoTags: "test, js, angular" }] );

		todoPage.waitTheBrowser(1);

		todoPage.editTodoTags("test, javascript, angular, mustache");

	});


	it('should allow all tags to delete (no tag) when a todo is being edited.', function() {

		todoPage.addNewTodos( [{message: "Hello Mind!", dueDate: "10/08/2015", todoTags: "test, javascript, angular, mustache" }] );

		todoPage.waitTheBrowser(1);

		todoPage.editTodoTags("");

	});


	it('should allow tags to remove when a todo is being edited.', function() {

		todoPage.addNewTodos( [{message: "Hello Todo3!", dueDate: "11/08/2015", todoTags: "test, javascript, angular, mustache" }] );

		todoPage.waitTheBrowser(1);

		todoPage.editTodoTags("javascript, angular");

	});

	it('filter todosCollections by tags used in app todos', function() {

		todoPage.addNewTodos( [{message: "The Complete Code!", dueDate: "11/08/2015", todoTags: "php, javascript, c++, java" },
			{message: "Uni Portal!", dueDate: "12/08/2015", todoTags: "java, java script, c-sharp, php" }] );

		todoPage.waitTheBrowser(2);

		todoPage.tagsCollection().count().then(function(count) {
			
			expect(count).toBe(6);

			todoPage.getByIndexTagFromCollection(0).click().then(function() {

				todoPage.waitTheBrowser(2);

				expect(todoPage.todoCollection().count()).toBe(2);
				expect(todoPage.tagsCollection().get(0).getText()).toBe('php');
				expect(todoPage.getByIndexElement(0).getText()).toBe('The Complete Code!');
				expect(todoPage.getByIndexElement(1).getText()).toBe('Uni Portal!');

			});

			todoPage.getByIndexTagFromCollection(2).click().then(function() {

				todoPage.waitTheBrowser(1);
				expect(todoPage.todoCollection().count()).toBe(1);
				expect(todoPage.tagsCollection().get(2).getText()).toBe('c++');
				expect(todoPage.getByIndexElement(0).getText()).toBe('The Complete Code!');
			});
		});

	});

	it('filter todosCollections by tags used in app todos in active state', function() {

		todoPage.addNewTodos( [{message: "The Complete Code!", dueDate: "11/08/2015", todoTags: "php, javascript, c++, java" },
			{message: "Uni Portal!", dueDate: "12/08/2015", todoTags: "java, java script, c-sharp, php" }] );

		todoPage.waitTheBrowser(2);

		todoPage.tagsCollection().count().then(function(count) {
			
			expect(count).toBe(6);

			todoPage.getByIndexCheckBox(0).click().then(function() {

				todoPage.activeButton().click().then(function() {

					todoPage.waitTheBrowser(1);

					expect(todoPage.todoCollection().count()).toBe(1);

					expect(todoPage.getByIndexElement(0).getText()).toBe('Uni Portal!');
					expect(todoPage.getByIndexTags(0).getText()).toBe("java, java script, c-sharp, php");

				});

			});
		});

	});


	it('filter todosCollections by tags used in app todos in completed state', function() {

		todoPage.addNewTodos( [{message: "The Complete Code!", dueDate: "11/08/2015", todoTags: "php, javascript, c++, java" },
			{message: "Uni Portal!", dueDate: "12/08/2015", todoTags: "java, java script, c-sharp, php" }] );

		todoPage.waitTheBrowser(2);

		todoPage.tagsCollection().count().then(function(count) {
			
			expect(todoPage.tagsCollection().count()).toBe(6);

			todoPage.getByIndexCheckBox(0).click().then(function() {

				todoPage.completedButton().click().then(function() {

					expect(todoPage.todoCollection().count()).toBe(1);

					expect(todoPage.getByIndexElement(0).getText()).toBe('The Complete Code!');
					expect(todoPage.getByIndexTags(0).getText()).toBe("php, javascript, c++, java");

				});

			});
		});

	});

	it('filter todosCollections by tags used in app todos in all state', function() {

		todoPage.addNewTodos( [{message: "The Complete Code!", dueDate: "11/08/2015", todoTags: "php, javascript, c++, java" },
			{message: "Uni Portal!", dueDate: "12/08/2015", todoTags: "java, java script, c-sharp, php" }] );

		todoPage.waitTheBrowser(2);

		todoPage.tagsCollection().count().then(function(count) {
			
			expect(todoPage.tagsCollection().count()).toBe(6);

			todoPage.getByIndexCheckBox(0).click().then(function() {

				todoPage.allButton().click().then(function() {

					expect(todoPage.todoCollection().count()).toBe(2);

					expect(todoPage.getByIndexElement(0).getText()).toBe('The Complete Code!');
					expect(todoPage.getByIndexTags(0).getText()).toBe("php, javascript, c++, java");

					expect(todoPage.getByIndexElement(1).getText()).toBe('Uni Portal!');
					expect(todoPage.getByIndexTags(1).getText()).toBe("java, java script, c-sharp, php");

				});

			});
		});

	});

});