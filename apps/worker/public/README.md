Drop a real `notification.mp3` file in this folder.

`audioPlayer.ts` fetches it from `/notification.mp3` at runtime — I can't
generate an actual audio binary through a text-editing tool, so this is the
one asset you need to supply yourself. Any short (under ~2s) notification
chime works; Vite serves anything in `public/` as-is at the site root.
