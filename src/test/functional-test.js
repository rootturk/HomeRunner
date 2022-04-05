var assert = require('assert');

describe('contact page', function() {

    it('should show contact a form', function() {
      assert.ok(this.browser.success);
      assert.equal(this.browser.text('h1'), 'Contact');
    });
  
  });