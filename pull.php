<?php

// Use in the “Post-Receive URLs” section of your GitHub repo.


try {
  if ( $_POST['payload']) {
    $salida = exec(' cd C:\xampp\htdocs\app && git pull origin production' );
    echo "<pre>$salida</pre>";
  }
} catch (\Exception $e) {
  echo $e->getMessage();
}


?>hi
