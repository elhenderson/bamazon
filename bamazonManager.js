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
        choices: ["Steering Wheel Attachable Work Surface Tray", `Horse\ Head\ Mask`, "Tile ED-11001", "Vufine+", "Divoom aurabox Bluetooth 4.0 Smart LED Speaker", "Pelican Air 1615 Case with Foam", "16GB Mini Mike Wazowski", "Knock Knock Personal Library Kit", "Flower Boy LP", "Obama: An Intimate Portrait"]
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
      connection.query(`UPDATE products SET stock_quantity = stock_quantity + ${answers.howMany} WHERE product_name = ${answers.whichItem}`, function(err, results) {
        if (err) throw err;
        console.log(results);
        console.log(`${answers.howMany} ${answers.whichItem} have been added to inventory`)
      connection.end();
    })
  })

  } else if (answers.managerOptions === "Add New Product") {

  }
})