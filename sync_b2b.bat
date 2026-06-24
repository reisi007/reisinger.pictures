@echo off
echo 🏢 Starte Sync: reisinger.pictures (B2B)...
rclone sync E:\astro-reisinger.pictures\apps\reisinger.pictures\dist reisinger.pictures:/reisinger.pictures --transfers=50 --track-renames --progress
echo 🎉 B2B Sync abgeschlossen!