@echo off
echo 🚀 Synchronisiere story.reisinger.pictures via rclone...
rclone sync dist reisinger.pictures:/story.reisinger.pictures --transfers=150 --track-renames --progress
echo 🎉 Upload fuer story.reisinger.pictures erfolgreich abgeschlossen!