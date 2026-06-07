# M3U8 Editor

A simple browser-based M3U/M3U8 playlist editor built with React and Vite.

Features
- Load and parse M3U/M3U8 files (supports #EXTINF and #EXTGRP).
- View and manage channel groups: create, rename, delete.
- Drag & drop groups and channels to change order.
- Copy/move channels between groups.
- Pagination for long channel lists.
- Save the playlist with the current group order preserved.

Installation and running
1. Install dependencies:
   npm install
2. Start the dev server:
   npm run dev
3. Build for production:
   npm run build

Usage
1. Click "Load" and select an M3U/M3U8 file.
2. Edit groups and channels in the left/right panes.
3. Drag groups/channels to reorder them.
4. Click "Save M3U8" — the downloaded file will reflect the current ordering.

Technical details
- Parser/unparser: src/parser/m3u_parser.jsx
- Channel/group models: src/models
- UI components: src/components (GroupList, ChannelList, PlaylistView, etc.)


