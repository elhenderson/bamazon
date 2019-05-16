//Modules
var mysql = require('mysql');
var inquirer = require('inquirer');

//Sets up a connection to my database
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'bamazon'
});

//Initializes the connection
connection.connect();

let choices = []



connection.query('SELECT * FROM products', function (error, results) {
  if (error) throw error;
  for (let i = 0; i<results.length; i++) {
    choices.push(`${results[i].product_name}`)
  }
})


//Once the customer sees the list, they choose which product they want via the id, then pick a quantity
setTimeout(function() {
inquirer.prompt([ 
  {
    type: "list",
    name: 'productName',
    message: "Please choose an item to purchase",
    choices: choices
  },
  {
    type: "input",
    name: 'howMany',
    message: "How many would you like?",
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
  console.log(answers.productName)

  //Second query 
  connection.query(`SELECT * FROM products WHERE ?`, {product_name: answers.productName}, function(error, results) {
    if (error) throw error;
    console.log(`\nYou chose: ${answers.howMany} ${results[0].product_name}\n`);

    console.log(`Checking store inventory...\n`)

    

    let total = results[0].price * answers.howMany;

    //Timeout function for realism
    setTimeout(function() {

      //if there is inventory
      if (results[0].stock_quantity > 0) {
        //lists total to customer
        console.log(`Your total is: $${total}\n`);
        //Subtracts amount of product from database
        connection.query(`UPDATE products SET stock_quantity = stock_quantity - ${answers.howMany} WHERE ?`, {product_name: answers.productName},  function(err, result) {
          if (err) throw err;
          console.log(`Database updated!\n`)
        })
        connection.query(`UPDATE products SET product_sales = product_sales + ${total} WHERE ?`, {product_name: answers.productName}, function(err, results) {
          if (err) throw err;
        })
        connection.end();
      //if there is not inventory
      } else if (results[0].stock_quantity <= 0) {
        console.log("\x1b[31m", "Insufficient inventory!");
        console.log("\x1b[0m")
        connection.end();
      }
    }, 3000)
  }) 
})
}, 500)









