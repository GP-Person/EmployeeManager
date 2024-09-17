const inquirer = require('inquirer');
const { 
    viewAllDepartments,
    viewAllRoles,
    viewAllEmployees,
    addDepartment,
    addRole,
    addEmployee,
    updateEmployeeRole
} = require('./db/db.js'); // Adjust the path as necessary

function mainMenu() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What would you like to do?',
                choices: [
                    'View All Departments',
                    'View All Roles',
                    'View All Employees',
                    'Add Department',
                    'Add Role',
                    'Add Employee',
                    'Update Employee Role',
                    'Exit',
                ],
            },
        ])
        .then((answers) => {
            switch (answers.action) {
                case 'View All Departments':
                    viewAllDepartments().then(() => mainMenu());
                    break;
                case 'View All Roles':
                    viewAllRoles().then(() => mainMenu());
                    break;
                case 'View All Employees':
                    viewAllEmployees().then(() => mainMenu());
                    break;
                case 'Add Department':
                    addDepartment().then(() => mainMenu());
                    break;
                case 'Add Role':
                    addRole().then(() => mainMenu());
                    break;
                case 'Add Employee':
                    addEmployee().then(() => mainMenu());
                    break;
                case 'Update Employee Role':
                    updateEmployeeRole().then(() => mainMenu());
                    break;
                case 'Exit':
                    console.log('Goodbye!');
                    process.exit();
                    break;
            }
        });
}

mainMenu();