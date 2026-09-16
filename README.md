# **LANServer** — A Local Desktop files personal server

## Read your Windows hard-drive files from a tablet using a web browser on a personal Wi-Fi network.

```md
- *WIP early stage readme_tag (260916:15h:21)*
- comments, ideas are welcome ➔ ivanwfr@gmail.com
```

### RUN FROM REPOSITORY FOLDER:
* The `server_loop.sh` script will run in a Restart loop when it fails in a terminal.
* Press `Ctrl-C` to restart the server
* Click the close icon [x] to stop the server
  ! But watch out for that damn “QuickEdit” option in the terminal!
  ! When you click inside the terminal, the copy-paste feature interrupts the script waiting for a keyboard input.
  ! Uncheck this option to avoid getting stuck by a mouse-click!
* You can now edit `SERVER/server.js`, and press `Ctrl-C` in the terminal to test your changes.

### CUSTOMIZING `SERVER/server.js:`
* Run `server_loop.sh` in a terminal.
* If you hit `Ctrl-C` in the terminal, the server will restart.
* it will enter a restart loop with a one second interval on failure.
* Then, you can modify `server.js` and hit `Ctrl-C` to see the result.
* Click the [x] exit icon to terminate the server

### A BIT OF ADVICE:
  Beware of the damn `QuickEdit terminal option`!
  …When you click on the terminal, the cut-paste feature
  will interrupt the script, waiting for a keyboard input.
  ➔ Uncheck it to avoid getting stuck by a mouse-click!

### YOUR LAN CONFIGURATION:
* PARAMETERS are in `config_dev.json` *WIP*.
* Your `LAN Home folder` can be a real folder or a symbolic-link.
* It must contain a link, or a copy of those two repository folders:
  . **SERVER/scripts** and
  . **SERVER/style**
  . ...either symbolic-links or copies.

### THIS VERSION DEVELOPMENT STATE:
* This version is still cluttered
  with irrelevant code from an unrelated original project.
  …I still have to remove a good part.
* You can ignore Postgres related errors (`lib_postgres` is not used here).
* `config_dev.json` is where tuning takes place.

### FEATURES:
The idea is to give access to any file accessible from a configurable root directory.
Any file, hard-link or symbolic-link accessible with the server privileges
will be served on the Local Area Network IP:PORT address logged in the terminal.

### EMBEDDED SCRIPTS:
* `server.js` will send custom mime types embedded into an HTML formatted response.
* Some files, containing `Vim-style-markers` (i.e. `{{{` and `}}}`) are equipped with
  JavaScript tooling to turn `fold sections` into `DETAILS-SUMMARY` HTML equivalent.
* At load time, `js_linkify.js` embedded into the page header by the server will adjust the page layout.
* Also, the embedded personal note taking script `js_notes.js` will add a `page notes section` at the bottom of those pages.

