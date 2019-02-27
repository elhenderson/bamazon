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

let choices = []

connection.query('SELECT * FROM products', function (error, results) {
  if (error) throw error;
  for (i = 0; i<results.length; i++) {
    choices.push(results[i].product_name)
  }
})

let departmentProfits = []

connection.query("SELECT product_sales, department_name, SUM(product_sales) AS amount FROM products GROUP BY department_name ORDER BY department_name asc", function(error, results) {
  if (error) throw error;
  for (i=0; i<results.length;i++) {
    departmentProfits.push(results[i].amount);    
  }
}) 

let totalProfit = []
let over_head_costs = []

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

    connection.query("SHOW COLUMNS FROM departments", function (error, results) {
      if (error) throw error;
      var tableHeaders = [];
      function addHeaders() {
        for (i=0; i<results.length; i++) {
          tableHeaders.push(results[i].Field);
        }
        tableHeaders.push("product_sales", "total_profit")
      }
      addHeaders();
      
      connection.query("SELECT * FROM departments ORDER BY department_name asc", function (error, results) {

        


        var table = new Table({
          head: tableHeaders,
          colWidths: [20,20,20,20,20]
        });
        if (error) throw error;
        for(i=0; i<results.length;i++) {
          over_head_costs.push(results[i].over_head_costs)
        }
        calcTotalProfit();
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
      connection.query(`INSERT IGNORE INTO departments VALUE (${answers.departmentId}, "${answers.departmentName}", ${answers.overhead})`, function(error, results) {
        if (error) throw error;
        console.log("Department added");
      })
    })
  }
})