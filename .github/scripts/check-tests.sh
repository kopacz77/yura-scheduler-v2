#!/bin/bash

# Check if tests exist for new files
changed_files=$(git diff --name-only HEAD~1 HEAD | grep -E '\.tsx?$' | grep -v '\.test\.tsx?$' | grep -v '\.d\.ts$')

for file in $changed_files; do
  test_file=$(echo $file | sed 's/\.tsx\?$/.test.tsx/')
  if [ ! -f "$test_file" ]; then
    echo "Warning: No test file found for $file"
    echo "Expected test file: $test_file"
  fi
done
