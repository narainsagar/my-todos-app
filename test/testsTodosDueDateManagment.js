
var TodoPage = require('./TodoPage.js').TodoPage;

describe('Todos Due Date Managment.', function() {

	browser.ignoreSynchronization = true;
	browser.get('/');

	var todoPage = new TodoPage();

	beforeEach(function() {

		browser.refresh();
		todoPage.resetPage();
		todoPage.waitTheBrowser(0);
	
	});	

	it('should add new todo with empty due date.', function() {

		todoPage.addNewTodos( [{message: 'testing.', dueDate: '', todoTags: "" }] );

		todoPage.waitTheBrowser(1);

		expect(todoPage.todoCollection().count()).toBe(1);
		expect(todoPage.getByIndexDueDate(0).getText()).toBe('');

	});

	it('should add new todo with specified due date.', function() {

		todoPage.addNewTodos( [{message: "testing.", dueDate: "07/08/2015", todoTags: "" }] );

		todoPage.waitTheBrowser(1);

		expect(todoPage.todoCollection().count()).toBe(1);
		expect(todoPage.getByIndexDueDate(0).getText()).toBe('07/08/2015');
		
	});

	it('should allow due date to be edit when todo is being edited.', function() {

		todoPage.addNewTodos( [{message: "testing.", dueDate: "07/08/2015", todoTags: "" }] );

		todoPage.waitTheBrowser(1);
		
		var msgelement = todoPage.getFirstElementMessageTextFromList();
		browser.actions().doubleClick(msgelement).perform().then(function() {
			browser.wait(function() {
				return todoPage.hasClass(todoPage.getByIndexDueDate(0), 'isEditable');
			}, todoPage.waitTime); // 10000
			todoPage.getByIndexDueDate(0).click().then(function() {
				todoPage.getByIndexDueDate(0).clear().then(function() {
					todoPage.getByIndexDueDate(0).sendKeys("10/08/2015").then(function() {
						msgelement.click().then(function() {
							browser.actions().sendKeys(protractor.Key.ENTER).perform().then(function() {
								browser.wait(function() {
									return todoPage.getByIndexDueDate(0).getText().then(function(txtDate) {
										return txtDate === "10/08/2015";
									});
								}, todoPage.waitTime); // 10000
								expect(todoPage.getByIndexDueDate(0).getText()).toBe("10/08/2015");
							});
						});
					});
				});
			});	
		});

	});

	it('should add red background to task if due date is passed.', function() {

		todoPage.addNewTodos( [{message: "testing passed...!", dueDate: "08/08/2015", todoTags: "" }] );

		todoPage.waitTheBrowser(1);

		expect(todoPage.hasClass(todoPage.getByIndexDueDate(0), 'color-red')).toBe(true);

	});

	it('should add green background to task if due date is today.', function() {

		todoPage.addNewTodos( [{message: "testing.", dueDate: "12/08/2015", todoTags: "" }] );

		todoPage.waitTheBrowser(1);

		expect(todoPage.hasClass(todoPage.getByIndexDueDate(0), 'color-green')).toBe(true);

	});

});