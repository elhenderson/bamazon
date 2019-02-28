var inquirer = require('inquirer');
var mysql = require('mysql');

//Sets up a connection to my database
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'bamazon'
});

//Initializes the connection
connection.connect();

//an array of current products to prevent similar names for same item
let choices = []
connection.query('SELECT * FROM products', function (error, results) {
  if (error) throw error;
  for (i = 0; i<results.length; i++) {
    choices.push(results[i].product_name)
  }
})

//An array of departments to prevent similar names for the same department
let departments = [];
connection.query("SELECT * FROM departments", function (err, results) {
  if (err) throw err;
  for (let i=0; i<results.length; i++) {
    departments.push(results[i].department_name);
  }
})

inquirer.prompt([
  {
    type: "list",
    name:'managerOptions',
    message: "Menu:",
    choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
  }
]).then(answers => {
  if (answers.managerOptions === "View Products for Sale") {
    connection.query('SELECT * FROM products', function (error, results) {
      if (error) throw error;
      for (i = 0; i<results.length; i++) {
        console.log(`\nProduct Name: ${results[i].product_name}\nDepartment Name: ${results[i].department_name}\nPrice: ${results[i].price}\nStock Quantity: ${results[i].stock_quantity}\nItem ID: ${results[i].item_id}\n`);
      }
    })
    connection.end();
  } else if (answers.managerOptions === "View Low Inventory") {
    connection.query('SELECT * FROM products WHERE stock_quantity < 5', function (error, results) {
      if (error) throw error;
      for (i = 0; i<results.length; i++) {
          console.log(`\nProduct Name: ${results[i].product_name}\nDepartment Name: ${results[i].department_name}\nPrice: ${results[i].price}\nStock Quantity: ${results[i].stock_quantity}\nItem ID: ${results[i].item_id}\n`);     
      }
    })
    connection.end();
  } else if (answers.managerOptions === "Add to Inventory") {
    inquirer.prompt([
      {
        type: "list",
        name: "whichItem",
        message: "Which item do you want to add?",
        choices: choices
      },
      {
        type: "input",
        name: "howMany",
        message: "How many items do you want to add?",
        validate: function(input) {
          if (!input.match(/[0-9]/)) {
            console.log(`\nEnter an integer\n`)
            return false
          } else {
            return true
          }
        }
      }
    ]).then(answers => {

      function whereItAt(element) {
       return element === answers.whichItem
      }
      var item_id = choices.findIndex(whereItAt) + 1
      connection.query(`UPDATE products SET stock_quantity = stock_quantity + ${answers.howMany} WHERE item_id = ${item_id}`, function(err, results) {
        if (err) throw err;
        console.log(`Inventory + ${answers.howMany} ${answers.whichItem} `)
      connection.end();
    })
  })

  } else if (answers.managerOptions === "Add New Product") {
    inquirer.prompt([
      {
        type: "input",
        name: "productName",
        message: "What is the name of the product you're adding?"
      },
      {
        type: "list",
        name: "departmentName",
        message: "To which department does this product belong?",
        choices: departments
      },
      {
        type: "input",
        name: "price",
        message: "What is the price of this product?",
        validate: function(input) {
          if (!input.match(/[0-9]/)) {
            console.log(`\nEnter an integer\n`)
            return false
          } else {
            return true
          }
        }
      },
      {
        type: "input",
        name: "stock",
        message: "How much of this product do you want to add?",
        validate: function(input) {
          if (!input.match(/[0-9]/)) {
            console.log(`\nEnter an integer\n`)
            return false
          } else {
            return true
          }
        }
      }
    ]).then(answers => {
      connection.query(`INSERT IGNORE INTO products VALUE ("${answers.productName}", "${answers.departmentName}", ${answers.price}, ${answers.stock}, 'null', ${0})`, function(err, results) {
        if (err) throw err;
        console.log(`${answers.stock} ${answers.productName} have been added to the database.`)
        connection.end();
      })
    })
  }
})