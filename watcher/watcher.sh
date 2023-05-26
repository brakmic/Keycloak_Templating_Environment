#!/bin/sh

# Absolute path to directory to watch for changes
watch_directory=/themes

service_name=keycloak

# Hash of directory state
last_hash=""

# Check for changes every 10 seconds
# We're only interested in the top-level directory changes
while true; do
    current_hash=$(ls $watch_directory | md5sum)
    if [ "$current_hash" != "$last_hash" ]; then
        echo "Detected change in $watch_directory, restarting $service_name..."
        docker restart $(docker ps -q --filter name=$service_name)
        last_hash=$current_hash
    fi
    sleep 10
done
