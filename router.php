<?php

$path = pathinfo($_SERVER["SCRIPT_FILENAME"]);
if ($path["extension"] == "js") {
    header("Service-Worker-Allowed: /");
    header("Content-Type: text/javascript");
    readfile($_SERVER["SCRIPT_FILENAME"]);
} else {
    return FALSE;
}
