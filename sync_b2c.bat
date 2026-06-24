@echo off
echo 🌍 Starte Sync: all-the.rest (B2C)...
rclone sync E:\astro-reisinger.pictures\apps\all-the.rest\dist reisinger.pictures:/all-the.rest --transfers=50 --track-renames --progress
echo 🎉 B2C Sync abgeschlossen!