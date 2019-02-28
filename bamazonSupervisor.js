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

//Empty array to put profits into
let departmentProfits = []

//Generates an array of the sum of different departments
connection.query("SELECT department_name, product_sales, SUM(product_sales) AS amount FROM products GROUP BY department_name ORDER BY department_name asc", function(error, results) {
  if (error) throw error;
  setTimeout(function() {
  for (let i=0; i<(results.length);i++) {
    departmentProfits.push(results[i].amount);    
  }
}, 250)
}) 

//Empty array to push totalProfits
let totalProfit = []

//Empty array to push overhead costs
let over_head_costs = []

//Function that calculates total profit for each department
function calcTotalProfit() {
  for (let i=0; i<over_head_costs.length;i++) {
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
        for (let i=0; i<results.length; i++) {
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
        for(let i=0; i<results.length;i++) {
          over_head_costs.push(results[i].over_head_costs)
        }

        //Total profit is then calculated
        calcTotalProfit();

        //All the relevant info is pushed to the table
        for (let i=0; i<results.length; i++) {  
          table.push(
            [results[i].department_id, results[i].department_name, results[i].over_head_costs, departmentProfits[i], totalProfit[i]]
          )
        }
          
          console.log(table.toString())
          connection.end();
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
        name:"overhead",
        message:"What will be the overhead cost of this department?"
      }
    ]).then(answers => {
      connection.query(`INSERT IGNORE INTO departments VALUE (null, "${answers.departmentName}", ${answers.overhead})`, function(error, results) {
        if (error) throw error;
        console.log("Department added");
        connection.end();
      })
    })
    
  }
})