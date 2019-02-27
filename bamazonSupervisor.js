var inquirer = require('inquirer');
var mysql = require('mysql');
var Table = require('cli-table')

//Sets up a connection to my database
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'bamazon'
});

//Initializes the connection
connection.connect();

// let choices = []

// connection.query('SELECT * FROM products', function (error, results) {
//   if (error) throw error;
//   for (i = 0; i<results.length; i++) {
//     choices.push(results[i].product_name)
//   }
// })

//Empty array to put profits into
let departmentProfits = []

//Generates an array of the sum of different departments
connection.query("SELECT product_sales, department_name, SUM(product_sales) AS amount FROM products GROUP BY department_name ORDER BY department_name asc", function(error, results) {
  if (error) throw error;
  for (i=0; i<results.length;i++) {
    departmentProfits.push(results[i].amount);    
  }
  console.log(departmentProfits);
}) 

//Empty array to push totalProfits
let totalProfit = []

//Empty array to push overhead costs
let over_head_costs = []

//Function that calculates total profit for each department
function calcTotalProfit() {
  for (i=0; i<over_head_costs.length;i++) {
    totalProfit.push(departmentProfits[i] - over_head_costs[i])
  }
}



inquirer.prompt([
  {
    type: "list",
    name: "managerOptions",
    message: "Manager Options:",
    choices: ["View Product Sales by Department", "Create New Department"]
  }
]).then(answers => {
  if (answers.managerOptions === "View Product Sales by Department") {

    //pulls column names from database
    connection.query("SHOW COLUMNS FROM departments", function (error, results) {
      if (error) throw error;

      //an empty array to push all the headers
      var tableHeaders = [];

      //Adds the headers
      function addHeaders() {
        for (i=0; i<results.length; i++) {
          tableHeaders.push(results[i].Field);
        }
        tableHeaders.push("product_sales", "total_profit")
      }
      addHeaders();
      
      connection.query("SELECT * FROM departments ORDER BY department_name asc", function (error, results) {

        //Generates a table in the console
        var table = new Table({
          head: tableHeaders,
          colWidths: [20,20,20,20,20]
        });
        if (error) throw error;
        //Overhead costs for all departments are pushed to the array
        for(i=0; i<results.length;i++) {
          over_head_costs.push(results[i].over_head_costs)
        }

        //Total profit is then calculated
        calcTotalProfit();

        //All the relevant info is pushed to the table
        for (i=0; i<results.length; i++) {  
          table.push(
            [results[i].department_id, results[i].department_name, results[i].over_head_costs, departmentProfits[i], totalProfit[i]]
          )
        }
          
          console.log(table.toString())
      })

    })


  }
  else if (answers.managerOptions === "Create New Department") {
    inquirer.prompt([
      {
        type:"input",
        name:"departmentName",
        message: "What is the name of the new department?"
      },
      {
        type:"input",
        name:"departmentId",
        message:"What is the ID of the new department?"
      },
      {
        type:"input",
        name:"overhead",
        message:"What will be the overhead cost of this department?"
      }
    ]).then(answers => {
      //Fun "feature" where product sales won't line up unless you add an item with some sales belonging to the department you just added
      connection.query(`INSERT IGNORE INTO departments VALUE (${answers.departmentId}, "${answers.departmentName}", ${answers.overhead})`, function(error, results) {
        if (error) throw error;
        console.log("Department added");
      })
    })
  }
})