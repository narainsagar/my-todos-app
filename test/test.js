var TodoPage = require('./TodoPage.js').TodoPage;

describe('Page Load', function() {
	
	browser.ignoreSynchronization = true;
	browser.get('/');

	var todoPage = new TodoPage();

	it("should load page", function() {

		expect(todoPage.getTitle).toEqual('todosApp');
		expect(todoPage.getHeader().getText()).toBe('todos');

	});	

});