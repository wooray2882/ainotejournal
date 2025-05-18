#!/bin/bash

# AI Note Journal Setup Script
# This script automates the setup and installation process

# Text colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== AI Note Journal Setup ===${NC}"
echo -e "${BLUE}This script will install all required dependencies and set up the project.${NC}"
echo -e ""

# Check if Node.js is installed
if ! [ -x "$(command -v node)" ]; then
  echo -e "${RED}Error: Node.js is not installed.${NC}" >&2
  echo -e "Please install Node.js v18 or later from https://nodejs.org/"
  exit 1
fi

# Check if npm is installed
if ! [ -x "$(command -v npm)" ]; then
  echo -e "${RED}Error: npm is not installed.${NC}" >&2
  echo -e "Please install npm v9 or later"
  exit 1
fi

# 1. Install npm dependencies
echo -e "\n${GREEN}Installing npm dependencies...${NC}"
npm install --legacy-peer-deps
if [ $? -ne 0 ]; then
  echo -e "${RED}Failed to install npm dependencies.${NC}"
  echo -e "Try running 'npm install --legacy-peer-deps' manually."
  exit 1
fi
echo -e "${GREEN}npm dependencies installed successfully!${NC}"

# 2. Install iOS Pod dependencies (if on macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
  echo -e "\n${GREEN}Installing iOS Pod dependencies...${NC}"
  npx pod-install
  if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to install iOS Pod dependencies.${NC}"
    echo -e "Try running 'npx pod-install' manually."
    echo -e "Make sure you have CocoaPods installed (brew install cocoapods)."
    exit 1
  fi
  echo -e "${GREEN}iOS Pod dependencies installed successfully!${NC}"
else
  echo -e "\n${BLUE}Skipping iOS Pod installation as you're not on macOS.${NC}"
fi

# 3. Create assets directories if they don't exist
echo -e "\n${GREEN}Setting up project directories...${NC}"
mkdir -p assets/images
echo -e "${GREEN}Project directories created!${NC}"

# 4. Check if aws-exports.ts exists
if [ ! -f "./src/aws-exports.ts" ]; then
  echo -e "\n${RED}Warning: aws-exports.ts not found in src directory.${NC}"
  echo -e "You need to configure AWS Amplify to use authentication features."
  echo -e "See INSTALLATION.md for instructions on setting up Amplify."
fi

# 5. Provide instructions for next steps
echo -e "\n${GREEN}Setup completed!${NC}"
echo -e "${BLUE}=== Next Steps ===${NC}"
echo -e "1. Make sure your AWS Amplify backend is configured correctly."
echo -e "2. Run the app with: ${GREEN}npm run ios${NC} (for iOS) or ${GREEN}npm run android${NC} (for Android)"
echo -e "3. For development with hot reloading: ${GREEN}npm start${NC}"
echo -e "\nRefer to INSTALLATION.md for detailed instructions and troubleshooting."

exit 0 