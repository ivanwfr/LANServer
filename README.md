# **LANServer** — A Local Desktop files personal server

**LANServer** — Local Area Network

*WIP early stage*

Access any files from a Windows Desktop using a device browser on a private Wi-Fi network.

## It runs from this repository root folder.

* The `server_loop_84_447.sh` script will run in a Restart loop when it fails in a terminal.

* Press Ctrl-C to restart the server

* Click the close icon [x] to stop the server

  ! But watch out for that damn “QuickEdit” option in the terminal!
  ! When you click inside the terminal, the copy-paste feature interrupts the script wainting for a keyboard input.
  ! Uncheck this option to avoid getting stuck by a mouse-click!

* You can now edit SERVER/server.js, then press Ctrl-C to test your changes.

* server_loop_84_447.sh will loop on failure in a terminal.
* Hit Ctrl-C to restart the server
* Click the [x] exit icon to terminate the server
  ! But beware of the f u c k i n g QuickEdit terminal option!
  ! When you click on the terminal, the cut-paste feature will interrupt the script, wating for input
  ! Uncheck it to avoid getting stuck as soon as you click with your mouse!
* Now you can edit SERVER/server.js, hit Ctrl-C to test your changes.

## RUNNING configuration:
* PARAMS are in config_dev.json.
* Your LAN Home folder can be a real folder or a symbolic-link.
* Your LAN Home folder must have a link or a copy of those two folders:
  . **SERVER/scripts** and
  . **SERVER/style**
  . ...You can use symbolic-links or a copy of those folders.


## THIS VERSION DEVELOPMENT STATE:

* This version is still cluttred
  with irrelevant code from an unrelated original project.
  I still have to remove a good part.
* YOU CAN IGNORE postgres related errors (lib_postgres is not used here)

* config_dev.json is where tuning takes place

## Features:

* Gives access to any file accessible from a configurable Root directory.
  Any file, hardlink or symbolic link accessible with the server privileges
  will be served on the local network IP address of the server.

## Embedded scripts:

* custom mime types can be configured to be embedded into an HTML formatted response.
* Some files, containing Vim-style-markers `{{{` and `}}}` are equiped with
  javascript tooling to turn fold sections into DETAILS-SUMMARY HTML equivalent.

* At load time, `js_linkify.js` embeded into the page header will adjust the page layout.

* The embeded personal note taking app `js_notes.js` will add a `page notes section` at the bottom of those pages.

