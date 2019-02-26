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

//First query which lists out all available products
connection.query('SELECT * FROM products', function (error, results) {
  if (error) throw error;
  for (i = 0; i<results.length; i++) {
    console.log(`Product Name: ${results[i].product_name}\nDepartment Name: ${results[i].department_name}\nPrice: ${results[i].price}\nStock Quantity: ${results[i].stock_quantity}\nItem ID: ${results[i].item_id}\n`);
  }
})

//Once the customer sees the list, they choose which product they want via the id, then pick a quantity
inquirer.prompt([ 
  {
    type: "input",
    name: 'productId',
    message: "Please input the ID of the product you would like to purchase.",
    validate: function(input) {
      if (!input.match(/[0-9]/) || input >= 11) {
        console.log(`\nEnter a valid product ID\n`)
        return false
      } else {
        return true
      }
    }
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
  //Puts the item_id into a variable less 1, so that it lines up with what the query spits out
  let productId = answers.productId - 1

  //Second query 
  connection.query('SELECT * from products', function(error, results) {
    if (error) throw error;
    console.log(`\nYou chose: ${answers.howMany} ${results[productId].product_name}\n`);

    console.log(`Checking store inventory...\n`)

    

    let total = results[productId].price * answers.howMany;

    //Timeout function for realism
    setTimeout(function() {

      //if there is inventory
      if (results[productId].stock_quantity > 0) {
        //lists total to customer
        console.log(`Your total is: $${total}\n`);
        //Subtracts amount of product from database
        connection.query(`UPDATE products SET stock_quantity = stock_quantity - ${answers.howMany} WHERE item_id=${answers.productId}`, function(err, result) {
          if (err) throw err;
          console.log(`Database updated!\n`)
        })
        connection.end();
      //if there is not inventory
      } else if (results[productId].stock_quantity <= 0) {
        console.log("\x1b[31m", "Insufficient inventory!");
        console.log("\x1b[0m")
        connection.end();
      }
    }, 3000)
  }) 
})









