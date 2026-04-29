const { test: base } = require('@playwright/test');

const customTest = base.extend({

    testDataForOrder: {
        username: "marie.valencia@example.com",
        password: "Password123@",
        productName: "ZARA COAT 3"
    }

});

module.exports = { customTest };
