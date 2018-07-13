<?php

$path = pathinfo($_SERVER["SCRIPT_FILENAME"]);
if ($path["basename"] == "serviceWorker.js") {
    header("Service-Worker-Allowed: /");
    header("Content-Type: text/javascript");
    readfile($_SERVER["SCRIPT_FILENAME"]);
} else {
    return FALSE;
}
