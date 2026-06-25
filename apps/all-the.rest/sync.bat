@echo off
echo 🚀 Synchronisiere all-the.rest via rclone...
rclone sync dist reisinger.pictures:/all-the.rest --transfers=50 --track-renames --progress
echo 🎉 Upload fuer all-the.rest erfolgreich abgeschlossen!