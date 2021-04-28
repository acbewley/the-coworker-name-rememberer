const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'companydb'
});

const ascii = () => {
    console.log(`
    _______  __   __  _______  ___      _______  __   __  _______  _______                      
   |       ||  |_|  ||       ||   |    |       ||  | |  ||       ||       |                     
   |    ___||       ||    _  ||   |    |   _   ||  |_|  ||    ___||    ___|                     
   |   |___ |       ||   |_| ||   |    |  | |  ||       ||   |___ |   |___                      
   |    ___||       ||    ___||   |___ |  |_|  ||_     _||    ___||    ___|                     
   |   |___ | ||_|| ||   |    |       ||       |  |   |  |   |___ |   |___                      
   |_______||_|   |_||___|    |_______||_______|  |___|  |_______||_______|                     
    ______    _______  __   __  _______  __   __  _______  _______  ______    _______  ______   
   |    _ |  |       ||  |_|  ||       ||  |_|  ||  _    ||       ||    _ |  |       ||    _ |  
   |   | ||  |    ___||       ||    ___||       || |_|   ||    ___||   | ||  |    ___||   | ||  
   |   |_||_ |   |___ |       ||   |___ |       ||       ||   |___ |   |_||_ |   |___ |   |_||_ 
   |    __  ||    ___||       ||    ___||       ||  _   | |    ___||    __  ||    ___||    __  |
   |   |  | ||   |___ | ||_|| ||   |___ | ||_|| || |_|   ||   |___ |   |  | ||   |___ |   |  | |
   |___|  |_||_______||_|   |_||_______||_|   |_||_______||_______||___|  |_||_______||___|  |_|`);
};

const startApp = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'mainOptions',
            message: 'What would you like to do?',
            choices: [
                'View all employees',
                'View all employees by department',
                'View all employees by role',
                'Add employee',
                'Add department',
                'Add role',
                'Update employee role'
            ]
        }
    ]).then(answer => {
        switch (answer.mainOptions) {
            case 'View all employees':
                allEmp();
                break;
            case 'View all employees by department':
                allDep();
                break;
            case 'View all employees by role':
                allRole();
                break;
            case 'Add employee':
                addEmp();
                break;
            case 'Add department':
                addDep();
                break;
            case 'Add role':
                addRole();
                break;
            case 'Update employee role':
                updateRole();
                break;
        }
    })
}

const allEmp = () => {

};

const allDep = () => {

};

const allRole = () => {
    
};

const addEmp = () => {

};

const addDep = () => {

};

const addRole = () => {

};

const updateRole = () => {

};

connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
    ascii();
    startApp();
});