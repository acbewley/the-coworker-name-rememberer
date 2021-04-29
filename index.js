const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'companyDB'
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
    connection.query('SELECT * FROM employee LEFT JOIN roles ON employee.role_id = roles.id LEFT JOIN department ON roles.department_id = department.id', (err, res) => {
        if (err) throw err;
        const empTable = [];
        for (i = 0; i < res.length; i++) {
            empTable.push({
                "Name": res[i].first_name + " " + res[i].last_name,
                "Department": res[i].name,
                "Title": res[i].title,
                "Salary": "$" + res[i].salary
            })
        }
        console.table(empTable);
        startApp();
    })
};

const allDep = () => {
    connection.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        inquirer.prompt([
            {
                type: 'list',
                name: 'dep',
                message: 'Which department?',
                choices() {
                    const choices = [];
                    for (i = 0; i < res.length; i++) {
                        choices.push({ value: res[i].id, name: res[i].name })
                    }
                    return choices;
                }
            }
        ]).then(ans => {
            connection.query(`SELECT * FROM roles WHERE roles.department_id = ${ans.dep}`, (err, res) => {
                if (err) throw err;
                const roles = [];
                for (i = 0; i < res.length; i++) {
                    roles.push(res[i].id)
                }
                connection.query(`SELECT * FROM employee WHERE role_id IN (${roles})`, (err, res) => {
                    const empTable = [];
                    for (i = 0; i < res.length; i++) {
                        empTable.push({
                            "Name": res[i].first_name + " " + res[i].last_name
                        })
                    }
                    console.table(empTable);
                    startApp();
                })
            })
        })
    })
};

const allRole = () => {
    connection.query('SELECT * FROM roles', (err, res) => {
        if (err) throw err;
        inquirer.prompt([
            {
                type: 'list',
                name: 'role',
                message: 'Which role?',
                choices() {
                    const choices = [];
                    for (i = 0; i < res.length; i++) {
                        choices.push({ value: res[i].id, name: res[i].title })
                    }
                    return choices;
                }
            }
        ]).then(ans => {
            connection.query(`SELECT first_name, last_name FROM employee WHERE employee.role_id = ${ans.role}`, (err, res) => {
                const empTable = [];
                for (i = 0; i < res.length; i++) {
                    empTable.push({
                        "Name": res[i].first_name + " " + res[i].last_name
                    })
                }
                console.table(empTable);
                startApp();
            })
        })
    })
};

const addEmp = () => {
    connection.query('SELECT * FROM roles', (err, res) => {
        if (err) throw err;

        inquirer.prompt([
            {
                type: 'input',
                name: 'empFName',
                message: 'What is their first name?'
            },
            {
                type: 'input',
                name: 'empLName',
                message: 'What is their last name?'
            },
            {
                type: 'list',
                name: 'role',
                message: 'What is their role?',
                choices() {
                    const choices = [];
                    for (i = 0; i < res.length; i++) {
                        choices.push({ value: res[i].id, name: res[i].title })
                    }
                    return choices;
                }
            }

        ]).then(ans => {
            connection.query('INSERT INTO employee SET ?',
                {
                    first_name: ans.empFName,
                    last_name: ans.empLName,
                    role_id: ans.role,
                    manager_id: ans.manager
                },
                (err, res) => {
                    if (err) throw err;
                    console.log('Employee added!')
                    startApp();
                }
            )
        })
    })

};

const addDep = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: "What is the department's name?"
        }
    ]).then(ans => {
        connection.query('INSERT INTO department SET ?',
            {
                name: ans.name
            },
            (err, res) => {
                if (err) throw err;
                console.log('Role created!')
                startApp();
            }
        )
    })
};

const addRole = () => {
    connection.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: "What is the role's title?"
            },
            {
                type: 'input',
                name: 'salary',
                message: "What is this role's salary?"
            },
            {
                type: 'list',
                name: 'department',
                message: 'What department is this role in?',
                choices() {
                    const choices = [];
                    for (i = 0; i < res.length; i++) {
                        choices.push({ value: res[i].id, name: res[i].name })
                    }
                    return choices;
                }
            }
        ]).then(ans => {
            connection.query('INSERT INTO roles SET ?',
                {
                    title: ans.title,
                    salary: ans.salary,
                    department_id: ans.department
                },
                (err, res) => {
                    if (err) throw err;
                    console.log('Role created!')
                    startApp();
                }
            )
        })
    })
};

const updateRole = () => {
    connection.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
        inquirer.prompt([
            {
                type: 'list',
                name: 'id',
                message: 'Which employee?',
                choices() {
                    const choices = [];
                    for (i = 0; i < res.length; i++) {
                        choices.push({ value: res[i].id, name: res[i].first_name + " " + res[i].last_name })
                    }
                    return choices;
                }
            }
        ]).then(ans => {
            console.log(ans)
            connection.query('SELECT * FROM roles', (err, res) => {
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'role',
                        message: 'What is their new role?',
                        choices() {
                            const choices = [];
                            for (i = 0; i < res.length; i++) {
                                choices.push({ value: res[i].id, name: res[i].title })
                            }
                            return choices;
                        }
                    }
                ]).then(answer => {
                    connection.query(
                        `UPDATE employee SET ? WHERE ?`,
                        [
                            {
                                role_id: answer.role
                            },
                            {
                                id: ans.id
                            }
                        ],
                        (err, res) => {
                            if (err) throw err;
                            console.log('Updated successfully!')
                            startApp();
                        })
                })
            })
        })
    })

};

connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
    ascii();
    startApp();
});