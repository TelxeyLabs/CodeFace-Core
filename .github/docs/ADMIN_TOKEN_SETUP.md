# GitHub Admin Token Setup and Branch Protection Guide

This document provides comprehensive guidance on setting up and managing the `ADMIN_TOKEN` required for the branch protection workflow in this repository.

## Table of Contents

1. [What is ADMIN_TOKEN](#what-is-admin_token)
2. [Creating the ADMIN_TOKEN](#creating-the-admin_token)
3. [Adding the Token to GitHub Secrets](#adding-the-token-to-github-secrets)
4. [Security Best Practices](#security-best-practices)
5. [Token Rotation Procedure](#token-rotation-procedure)
6. [Branch Protection Configuration](#branch-protection-configuration)
7. [Troubleshooting](#troubleshooting)

## What is ADMIN_TOKEN

The `ADMIN_TOKEN` is a GitHub Personal Access Token (PAT) with administrative permissions that allows our GitHub Actions workflow to configure and enforce branch protection rules for the repository. 

This token is necessary because:
- Regular GitHub Actions tokens (`GITHUB_TOKEN`) do not have sufficient permissions to modify branch protection rules
- Branch protection settings require administrative access to the repository
- The token enables automation of security policies without manual intervention

## Creating the ADMIN_TOKEN

Follow these steps to create a Personal Access Token with the appropriate permissions:

1. **Log in to GitHub** with an account that has admin permissions for the repository
2. **Navigate to Settings**:
   - Click on your profile picture in the top-right corner
   - Select "Settings" from the dropdown menu
3. **Access Developer Settings**:
   - Scroll down and click on "Developer settings" in the left sidebar
4. **Personal Access Tokens**:
   - Click on "Personal access tokens"
   - Select "Fine-grained tokens" or "Classic tokens" (Fine-grained is recommended for better permission control)
5. **Generate New Token**:
   - Click "Generate new token" button
   - Add a descriptive note like "Branch Protection Automation Token"
   - Set an appropriate expiration date (recommended: 90 days)
6. **Set Permissions**:
   - If using fine-grained tokens:
     - Select "Only select repositories" and choose this repository
     - Under "Repository permissions":
       - Set "Administration" to "Read and write"
       - Set "Metadata" to "Read-only"
   - If using classic tokens, select the following scopes:
     - `repo` (Full control)
     - `admin:org` (specifically for branch protection)
7. **Generate Token**:
   - Click "Generate token" at the bottom of the page
8. **Copy the Token**:
   - **IMPORTANT**: Copy the generated token immediately and save it in a secure location like a password manager
   - Once you navigate away from the page, you cannot view the token again

## Adding the Token to GitHub Secrets

After generating the token, add it to your repository's secrets:

1. **Navigate to the Repository**:
   - Go to the main page of the repository
2. **Access Settings**:
   - Click on "Settings" in the repository navigation
3. **Secrets and Variables**:
   - In the left sidebar, click on "Secrets and variables"
   - Select "Actions"
4. **Add New Repository Secret**:
   - Click "New repository secret"
   - Name: `ADMIN_TOKEN`
   - Value: Paste the Personal Access Token you generated
   - Click "Add secret"

## Security Best Practices

Follow these security best practices when managing the ADMIN_TOKEN:

1. **Limit Access**:
   - Only repository administrators should have the ability to create or modify this token
   - Restrict the number of people who have access to this token

2. **Use Fine-Grained Permissions**:
   - When possible, use fine-grained tokens with the minimum necessary permissions
   - Limit the token's access to only the specific repository that needs branch protection

3. **Set Expiration Dates**:
   - Always set an expiration date on the token (recommended: 60-90 days)
   - Plan to rotate the token before it expires

4. **Secure Storage**:
   - Store the token securely in a password manager when not in use
   - Never store the token in code, documentation, or unsecured locations

5. **Access Audit**:
   - Periodically review who has admin access to the repository
   - Check GitHub audit logs for any unusual activity related to secrets or branch protection

## Token Rotation Procedure

To maintain security, the ADMIN_TOKEN should be rotated regularly:

1. **Schedule**:
   - Establish a regular rotation schedule (recommended: every 60-90 days)
   - Set calendar reminders before the token expires

2. **Rotation Process**:
   - Create a new token following the steps in [Creating the ADMIN_TOKEN](#creating-the-admin_token)
   - Update the repository secret with the new token:
     - Go to repository Settings > Secrets and variables > Actions
     - Edit the existing `ADMIN_TOKEN` secret and paste the new token value
   - Immediately revoke the old token:
     - Go to your GitHub personal settings > Developer settings > Personal access tokens
     - Find the old token and click "Delete"
     - Confirm the deletion

3. **Verification**:
   - After rotation, manually trigger the branch protection workflow to verify it works with the new token:
     - Go to Actions > Branch Protection > Run workflow > Run workflow

## Branch Protection Configuration

Our repository uses a scheduled GitHub Actions workflow to enforce branch protection rules. The current configuration:

### Main Branch Protection Rules

- **Enforcement**: Enforced for everyone (including administrators)
- **Required Status Checks**:
  - `lint` (strict)
  - `test` (strict)
  - `build` (strict)
- **Required Pull Request Reviews**:
  - At least 1 approving review required
  - Dismiss stale reviews when new commits are pushed
  - Require review from Code Owners

### Develop Branch Protection Rules

- **Enforcement**: Enforced for everyone except administrators
- **Required Status Checks**:
  - `lint` (strict)
  - `test` (strict)
- **Required Pull Request Reviews**:
  - At least 1 approving review required
  - Dismiss stale reviews when new commits are pushed

### Workflow Schedule

The branch protection rules are automatically applied:
- On the first day of each month at 00:00 UTC
- Any time the workflow is manually triggered

## Troubleshooting

If you encounter issues with the branch protection workflow:

1. **Token Permission Issues**:
   - Error: "Resource not accessible by integration"
   - Solution: Verify the token has `admin:org` or appropriate repository administration permissions

2. **Token Expiration**:
   - Error: "Bad credentials" or "The access token you provided is invalid"
   - Solution: Generate a new token and update the `ADMIN_TOKEN` secret

3. **Branch Not Found**:
   - Error: "Branch 'xxx' not found"
   - Solution: Verify the branch exists and the spelling is correct in the workflow file

4. **Workflow Syntax Errors**:
   - Check the action logs for specific syntax errors in the protection rules
   - Verify JSON formatting in the workflow file's configuration blocks

5. **Action Version Issues**:
   - If the action behavior changes, check for updates to the `relaxdiego/branch-protection` action
   - Consider pinning to a specific version if compatibility issues arise

For assistance with persistent issues, contact the repository administrators or DevOps team.

