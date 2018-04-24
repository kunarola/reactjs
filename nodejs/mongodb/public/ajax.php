<?php

define('BASE_PATH', 'http://localhost/angular_node/public/');
define('DB_HOST', 'localhost');
define('DB_NAME', 'angularjs');
define('DB_USERNAME', 'root');
define('DB_PASSWORD', '');


$mysqli = new mysqli(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME);
if (mysqli_connect_errno()) {
    echo("Failed to connect, the error message is : " . mysqli_connect_error());
    exit();
}

if (isset($_POST['type']) && !empty(isset($_POST['type']))) {
    $type = $_POST['type'];

    switch ($type) {
        case "save_user":
            save_user($mysqli);
            break;
        case "delete_user":
            delete_user($mysqli, $_POST['id']);
            break;
        case "getUsers":
            getUsers($mysqli);
            break;
        default:
            invalidRequest();
    }
} else {
    invalidRequest();
}

/**
 * This function will handle user add, update functionality
 * @throws Exception
 */
function save_user($mysqli) {
    try {
        $data = array();
        $firstname = $mysqli->real_escape_string(isset($_POST['user']['firstname']) ? $_POST['user']['firstname'] : '');
        $lastname = $mysqli->real_escape_string(isset($_POST['user']['lastname']) ? $_POST['user']['lastname'] : '');
        $email = $mysqli->real_escape_string(isset($_POST['user']['email']) ? $_POST['user']['email'] : '');

        $id = $mysqli->real_escape_string(isset($_POST['user']['id']) ? $_POST['user']['id'] : '');

        if (empty($id)) {
            $query = 'SELECT id FROM users WHERE email="' . $email . '"';
        } else {
            $query = 'SELECT id FROM users WHERE email="' . $email . '" AND id!=' . $id;
        }
        $result = $mysqli->query($query);
        $row = $result->fetch_assoc();
        if (!$row) {
            if ($firstname == '' || $lastname == '' || $email == '') {
                throw new Exception("Required fields missing, Please enter and submit");
            }

            if (empty($id)) {
                $query = "INSERT INTO users (`id`, `firstname`, `lastname`, `email`) VALUES (NULL, '$firstname', '$lastname', '$email')";
            } else {
                $query = "UPDATE users SET `firstname` = '$firstname', `lastname` = '$lastname', `email` = '$email' WHERE `users`.`id` = $id";
            }

            if ($mysqli->query($query)) {
                $data['success'] = true;
                if (!empty($id))
                    $data['message'] = 'User updated successfully.';
                else
                    $data['message'] = 'User inserted successfully.';
                if (empty($id))
                    $data['id'] = (int) $mysqli->insert_id;
                else
                    $data['id'] = (int) $id;
            }else {
                throw new Exception($mysqli->sqlstate . ' - ' . $mysqli->error);
            }
            $mysqli->close();
        } else {
            $data['success'] = false;
            $data['message'] = $_POST['user']['email'] . ' email already exist!';
        }
        echo json_encode($data);
        exit;
    } catch (Exception $e) {
        $data = array();
        $data['success'] = false;
        $data['message'] = $e->getMessage();
        echo json_encode($data);
        exit;
    }
}

/**
 * This function will handle user deletion
 * @param string $id
 * @throws Exception
 */
function delete_user($mysqli, $id = '') {
    try {
        if (empty($id))
            throw new Exception("Invalid User.");
        $query = "DELETE FROM `users` WHERE `id` = $id";
        if ($mysqli->query($query)) {
            $data['success'] = true;
            $data['message'] = 'User deleted successfully.';
            echo json_encode($data);
            exit;
        } else {
            throw new Exception($mysqli->sqlstate . ' - ' . $mysqli->error);
        }
    } catch (Exception $e) {
        $data = array();
        $data['success'] = false;
        $data['message'] = $e->getMessage();
        echo json_encode($data);
        exit;
    }
}

/**
 * This function gets list of users from database
 */
function getUsers($mysqli) {
    try {
        $query = "SELECT * FROM users order by id";
        $result = $mysqli->query($query);
        $data = array();
        while ($row = $result->fetch_assoc()) {
            $row['id'] = (int) $row['id'];
            $data['data'][] = $row;
        }
        $data['success'] = true;
        echo json_encode($data);
        exit;
    } catch (Exception $e) {
        $data = array();
        $data['success'] = false;
        $data['message'] = $e->getMessage();
        echo json_encode($data);
        exit;
    }
}

function invalidRequest() {
    $data = array();
    $data['success'] = false;
    $data['message'] = "Invalid request.";
    echo json_encode($data);
    exit;
}
