@echo off
echo 🚀 Synchronisiere reisinger.pictures via rclone...
rclone sync apps/reisinger.pictures/dist reisinger.pictures:/reisinger.pictures --transfers=50 --track-renames --progress
echo 🎉 Upload fuer reisinger.pictures erfolgreich abgeschlossen!