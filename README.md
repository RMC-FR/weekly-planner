# Weekly Planner

A small weekly planner page. Weeks start on Monday; the main view always shows Last Week, This Week and Next Week, and rolls over automatically.

- Each week is a row; topic cards are added to the right with **+ New Topic** (instantly, with 3 empty checkboxes).
- Edit topic names and checklist items directly on the card. Enter adds an item, Backspace on an empty item removes it.
- Each card shows a progress bar for its topic across **all weeks** (cards with the same topic name are linked).
- Older weeks are kept and can be viewed with **History**.
- Data is saved in this browser (localStorage). Use **Export** / **Import** to back up or move data to another device.

## Google Drive sync (optional)

`apps-script/Code.gs` is a small Google Apps Script web app that stores the planner data as a JSON file in your own Google Drive.
Deploy it as a web app (Execute as: Me, Access: Anyone), put a secret in `SYNC_KEY`, then connect a device by opening
`https://<this site>/#sync=<web app URL>|<key>` once, or with the **Sync** button. The URL and key are kept only in that browser.
