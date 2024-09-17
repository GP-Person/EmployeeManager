const { Pool } = require('pg');
const inquirer = require('inquirer');

// Create a new pool instance to connect to the PostgreSQL database
const pool = new Pool({
  user: 'postgres',      // Your PostgreSQL username
  host: 'localhost',          // Host (usually localhost)
  database: 'employee_db',  // Your database name
  port: 5432,                 // Port (usually 5432)
});

// Define the function to view all departments
async function viewAllDepartments() {
    try {
        const result = await pool.query('SELECT * FROM department');
        console.table(result.rows); // Use console.table to print the results as a formatted table
    } catch (err) {
        console.error('Error retrieving departments:', err.message);
    }
}

// Define the function to view all roles
async function viewAllRoles() {
    try {
        const result = await pool.query('SELECT * FROM role');
        console.table(result.rows); // Use console.table to print the results as a formatted table
    } catch (err) {
        console.error('Error retrieving roles:', err.message);
    }
}

// Define the function to view all employees
async function viewAllEmployees() {
    try {
        const result = await pool.query('SELECT * FROM employee');
        console.table(result.rows); // Use console.table to print the results as a formatted table
    } catch (err) {
        console.error('Error retrieving employees:', err.message);
    }
}

async function addDepartment() {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'departmentName',
            message: 'What is the name of the department you would like to add?',
        },
    ]);

    try {
        const query = 'INSERT INTO department (name) VALUES ($1)';
        const values = [answers.departmentName];
        await pool.query(query, values);
        console.log(`Department "${answers.departmentName}" added successfully!`);
    } catch (err) {
        console.error('Error adding department:', err.message);
    }
}

async function addRole() {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'roleTitle',
            message: 'What is the title of the role you would like to add?',
        },
        {
            type: 'input',
            name: 'roleSalary',
            message: 'What is the salary for this role?',
        },
        {
            type: 'input',
            name: 'departmentId',
            message: 'What is the department ID for this role?',
        },
    ]);

    try {
        const departmentCheckQuery = 'SELECT COUNT(*) FROM department WHERE id = $1';
        const departmentCheckResult = await pool.query(departmentCheckQuery, [answers.departmentId]);

        if (parseInt(departmentCheckResult.rows[0].count) === 0) {
            console.log('Error: Department ID does not exist.');
            return;
        }

        const query = 'INSERT INTO role (title, salary, department) VALUES ($1, $2, $3)';
        const values = [answers.roleTitle, answers.roleSalary, answers.departmentId];
        await pool.query(query, values);
        console.log(`Role "${answers.roleTitle}" added successfully!`);
    } catch (err) {
        console.error('Error adding role:', err.message);
    }
}

async function addEmployee() {
    const roles = await pool.query('SELECT * FROM role');
    const roleChoices = roles.rows.map(role => ({ name: role.title, value: role.id }));

    const managers = await pool.query('SELECT * FROM employee');
    const managerChoices = managers.rows.map(manager => ({
        name: `${manager.first_name} ${manager.last_name}`,
        value: manager.id
    }));

    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'What is the first name of the employee?',
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'What is the last name of the employee?',
        },
        {
            type: 'list',
            name: 'roleId',
            message: 'What is the role of the employee?',
            choices: roleChoices
        },
        {
            type: 'list',
            name: 'managerId',
            message: 'Who is the employee’s manager?',
            choices: managerChoices.concat({ name: 'None', value: null })
        }
    ]);

    try {
        const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)';
        const values = [answers.firstName, answers.lastName, answers.roleId, answers.managerId];
        await pool.query(query, values);
        console.log(`Employee "${answers.firstName} ${answers.lastName}" added successfully!`);
    } catch (err) {
        console.error('Error adding employee:', err.message);
    }
}

async function updateEmployeeRole() {
    const employees = await pool.query('SELECT * FROM employee');
    const employeeChoices = employees.rows.map(employee => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id
    }));

    const roles = await pool.query('SELECT * FROM role');
    const roleChoices = roles.rows.map(role => ({ name: role.title, value: role.id }));

    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'employeeId',
            message: 'Which employee’s role do you want to update?',
            choices: employeeChoices
        },
        {
            type: 'list',
            name: 'newRoleId',
            message: 'What is the new role of the employee?',
            choices: roleChoices
        }
    ]);

    try {
        const query = 'UPDATE employee SET role_id = $1 WHERE id = $2';
        const values = [answers.newRoleId, answers.employeeId];
        await pool.query(query, values);
        console.log('Employee role updated successfully!');
    } catch (err) {
        console.error('Error updating employee role:', err.message);
    }
}

module.exports = {
    viewAllDepartments,
    viewAllRoles,
    viewAllEmployees,
    addDepartment,
    addRole,
    addEmployee,
    updateEmployeeRole
};
