#!/bin/bash
# Kill all processes running on ports 3000-3300

echo "Killing processes on ports 3000-3300..."

for port in $(seq 3000 3300); do
  fuser -k $port/tcp 2>/dev/null && echo "Killed process on port $port"
done

echo "Done."
