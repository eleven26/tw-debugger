#!/usr/bin/php
<?php

$zip = new ZipArchive();

// remove old archives.
$directoryIterator = new DirectoryIterator(__DIR__ . DIRECTORY_SEPARATOR . 'output');
foreach($directoryIterator as $f) {
    if ($f->isFile()) {
        unlink($f->getPathname());
    }
}

$filename = __DIR__ . "/output/tw-debugger-" . time() . ".zip";

if ($zip->open($filename, ZipArchive::CREATE) !== true) {
    die("create zip file fails!" . PHP_EOL);
}

$files = [
    'background.js',
    'manifest.json',
    'popup.css',
    'popup.html',
    'popup.js',
];

foreach ($files as $file) {
    if (!$zip->addFile(__DIR__ . DIRECTORY_SEPARATOR . $file)) {
        die("add file: {$file} fails!" . PHP_EOL);
    }
}

if (!$zip->close()) {
    die("save {$filename} fails!" . PHP_EOL);
}

echo 'success' . PHP_EOL;
