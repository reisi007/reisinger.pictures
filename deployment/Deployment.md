# Deployment Guide

This document outlines the deployment architecture and workflow for the `reisinger.pictures` website.

## Architecture Overview
The website is a statically generated site (SSG) built with Astro. The compiled static files are hosted on a remote Linux server and served by a lightweight Nginx web server running inside a Docker container. The container management is handled via Portainer.

* **Local Build**: Astro compiles the site into the `dist/` directory.
* **File Transfer**: `rclone` syncs the local `dist/` directory directly to the server's host directory.
* **Web Server**: An Nginx Alpine container mounts the host directory as a read-only volume (`/usr/share/nginx/html:ro`) and serves the files to the external network (`webnet`).

## Deployment Workflow

Deploying a new version of the website is a single-step process from the developer's perspective.

1. **Run the Publish Command:**
   Open your terminal in the project root and run:
   ```bash
   npm run publish