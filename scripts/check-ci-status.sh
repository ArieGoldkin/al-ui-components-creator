#!/bin/bash

# Check CI/CD Pipeline Status
# This script checks the status of the latest GitHub Actions workflow run

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Repository information
REPO_OWNER="ArieGoldkin"
REPO_NAME="al-ui-components-creator"
WORKFLOW_NAME="ci.yml"

print_status() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_status "Checking CI/CD Pipeline Status for ${REPO_OWNER}/${REPO_NAME}..."

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    print_error "GitHub CLI (gh) is not installed. Please install it first:"
    echo "  brew install gh"
    echo "  or visit: https://cli.github.com/"
    exit 1
fi

# Check if user is authenticated
if ! gh auth status &> /dev/null; then
    print_error "Not authenticated with GitHub CLI. Please run:"
    echo "  gh auth login"
    exit 1
fi

# Get the latest workflow run status
print_status "Fetching latest workflow run..."

WORKFLOW_STATUS=$(gh run list --repo "${REPO_OWNER}/${REPO_NAME}" --workflow "${WORKFLOW_NAME}" --limit 1 --json status,conclusion,headBranch,createdAt,url --jq '.[0]')

if [ "$WORKFLOW_STATUS" = "null" ] || [ -z "$WORKFLOW_STATUS" ]; then
    print_warning "No workflow runs found for ${WORKFLOW_NAME}"
    exit 0
fi

# Parse workflow information
STATUS=$(echo "$WORKFLOW_STATUS" | jq -r '.status')
CONCLUSION=$(echo "$WORKFLOW_STATUS" | jq -r '.conclusion')
BRANCH=$(echo "$WORKFLOW_STATUS" | jq -r '.headBranch')
CREATED_AT=$(echo "$WORKFLOW_STATUS" | jq -r '.createdAt')
URL=$(echo "$WORKFLOW_STATUS" | jq -r '.url')

echo ""
echo "📊 Latest Workflow Run:"
echo "  Branch: $BRANCH"
echo "  Created: $CREATED_AT"
echo "  Status: $STATUS"
echo "  URL: $URL"
echo ""

# Display status with appropriate color
case "$STATUS" in
    "completed")
        case "$CONCLUSION" in
            "success")
                print_success "Pipeline completed successfully! 🎉"
                ;;
            "failure")
                print_error "Pipeline failed! 💥"
                echo ""
                print_status "To view detailed logs, run:"
                echo "  gh run view --repo ${REPO_OWNER}/${REPO_NAME}"
                echo "  or visit: $URL"
                exit 1
                ;;
            "cancelled")
                print_warning "Pipeline was cancelled"
                ;;
            *)
                print_warning "Pipeline completed with conclusion: $CONCLUSION"
                ;;
        esac
        ;;
    "in_progress")
        print_status "Pipeline is currently running... ⏳"
        echo ""
        print_status "To watch the progress, run:"
        echo "  gh run watch --repo ${REPO_OWNER}/${REPO_NAME}"
        ;;
    "queued")
        print_status "Pipeline is queued and waiting to start... ⏳"
        ;;
    *)
        print_warning "Unknown pipeline status: $STATUS"
        ;;
esac

echo ""
print_status "To view all recent runs:"
echo "  gh run list --repo ${REPO_OWNER}/${REPO_NAME} --workflow ${WORKFLOW_NAME}"

echo ""
print_status "To trigger a new workflow run:"
echo "  gh workflow run ${WORKFLOW_NAME} --repo ${REPO_OWNER}/${REPO_NAME}"
