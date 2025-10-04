#!/bin/bash

# Docker Wrapper Script
# Automatically uses sudo on Linux if needed

# Check if we can run docker without sudo
if docker ps > /dev/null 2>&1; then
    # Docker works without sudo
    exec docker "$@"
elif sudo docker ps > /dev/null 2>&1; then
    # Docker needs sudo
    exec sudo docker "$@"
else
    echo "❌ Error: Cannot access Docker daemon"
    exit 1
fi

