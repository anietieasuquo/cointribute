#!/bin/bash

COMPONENTS_DIR=$1

if [ ! -d "$COMPONENTS_DIR" ]; then
  echo "Directory $COMPONENTS_DIR does not exist."
  exit 1
fi

for file in "$COMPONENTS_DIR"/*.tsx; do
  component_name=$(grep -o 'export {.*}' "$file" | sed 's/export {//;s/}//;s/ //g')
  echo "Refactoring $component_name"
  mkdir -p "$COMPONENTS_DIR/$component_name"
  cp "$file" "$COMPONENTS_DIR/$component_name"
  echo "export { $component_name } from '@/components/$component_name/$component_name';" > "$COMPONENTS_DIR/$component_name/index.ts"
  echo >> "$COMPONENTS_DIR/$component_name/index.ts"
  echo >> "$COMPONENTS_DIR/$component_name/$component_name.styles.scss"
  rm "$COMPONENTS_DIR/$component_name.tsx"
done
