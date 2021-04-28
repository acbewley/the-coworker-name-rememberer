INSERT INTO department (name)
VALUES ('Accounting'), ('Customer Service'), ('HR');

INSERT INTO roles (title, salary, department_id)
VALUES ('Accountant', 75000, 1), ('Supervisor', 90000, 1), ('Customer Service Rep', 40000, 2), ('HR Agent', 62000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Greg', 'Whart', 1, 2), ('Mary', 'Pulirn', 2, null), ('Theodore', 'Refush', 3, null), ('Terry', 'Yedfun', 3, null)