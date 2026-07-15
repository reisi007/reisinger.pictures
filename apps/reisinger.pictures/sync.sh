#!/usr/bin/env bash
set -e
echo "Synchronisiere reisinger.pictures via rclone..."
rclone sync dist reisinger.pictures:/reisinger.pictures --transfers=150 --track-renames --progress
echo "Upload fuer reisinger.pictures erfolgreich abgeschlossen!"
