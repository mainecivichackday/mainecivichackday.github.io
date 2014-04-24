<?php
$name       = "";
$email      = "";
$message    = "";
$newsletter = 0;

//Set the variables based on GET parameters
foreach ($_POST as $key => $value) {
    if(isset($_POST[$key])) {
        ${$key} = $value;
    }
}

echo '{"name": "'.$name.'", "email": "'.$email.'", "message": "'.$message.'", "newsletter": "'.$newsletter.'"}';

?>