@echo off

echo Step 1 of 4: Starting app server

start /b "" "C:\Program Files\nodejs\node" index.js

echo Step 2 of 4: Waiting a few seconds before starting the Kiosk...

"C:\windows\system32\ping" -n 5 -w 1000 127.0.0.1 >NUL

echo Step 3 of 4: Waiting a few more seconds before starting the browser...

"C:\windows\system32\ping" -n 5 -w 1000 127.0.0.1 >NUL

echo Step 4 of 4 (Final): 'invisible' step: Starting the browser, Finally...

"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --chrome --kiosk http://127.0.0.1:9090/ --disable-pinch --overscroll-history-navigation=0

exit