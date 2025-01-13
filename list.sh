#!/bin/sh

# Navigate to the queries directory
QUERIES_DIR="src/components/queries"
BASE_API_DIR="api"

# Ensure the base API directory exists
echo mkdir -p \"$BASE_API_DIR\"

# Process each file starting with "use" in the queries directory
for file in "$QUERIES_DIR"/use*; do
    # Extract the endpoint from the axios.get line
    ENDPOINT=$(grep -oE 'axios\.get\("/api/[^"]+"' "$file" | sed -E 's/axios\.get\("\/api\/([^"]+)".*/\1/')

    if [ -n "$ENDPOINT" ]; then
        # Create the directory structure based on the endpoint
        DIR_PATH="$BASE_API_DIR/$(dirname "$ENDPOINT")"
        FILE_NAME="$(basename "$ENDPOINT").ts"

       echo mkdir -p \"$DIR_PATH\"

        # Create the file if it doesn't already exist
        FILE_PATH="$DIR_PATH/$FILE_NAME"
        if [ ! -f "$FILE_PATH" ]; then
            echo touch \"$FILE_PATH\"
            #echo "Created file: $FILE_PATH"
        fi
    fi
done