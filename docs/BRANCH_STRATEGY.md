# CodeFace Branching Strategy

This document outlines the branching strategy used in the CodeFace project. We follow a modified GitFlow approach that helps us manage development, testing, and releases in a structured manner.

## Branch Structure

Our repository uses the following branch types:

| Branch Type | Purpose | Naming Convention | Source Branch | Target Branch |
|-------------|---------|-------------------|---------------|--------------|
| **Main** | Production releases | `main` | Release/Hotfix | N/A |
| **Develop** | Main development branch | `develop` | Feature | Main |
| **Feature** | New features | `feature/<name>` | Develop | Develop |
| **Hotfix** | Urgent fixes | `hotfix/<version>` | Main | Main & Develop |
| **Release** | Release preparation | `release/<version>` | Develop | Main & Develop |

## Branch Descriptions

### Main Branch (`main`)

- Contains production-ready code
- All code in this branch should be deployable
- Protected branch that requires pull request reviews
- No direct commits are allowed to this branch
- Only merged from `release/*` or `hotfix/*` branches

### Develop Branch (`develop`)

- Main development branch where all features are integrated
- Contains the latest delivered development changes for the next release
- Should be in a functional state, but can contain features in progress
- Features are tested here before being included in a release

### Feature Branches (`feature/*`)

- Used for developing new features or enhancements
- Always branch off from: `develop`
- Always merge back into: `develop`
- Naming convention: `feature/<descriptive-feature-name>`
- Example: `feature/enhanced-styling`, `feature/user-authentication`

### Hotfix Branches (`hotfix/*`)

- Used to quickly address critical issues in production
- Always branch off from: `main`
- Always merge back into: `main` and `develop`
- Naming convention: `hotfix/v<version>`
- Example: `hotfix/v0.1.1`, `hotfix/v1.2.3`
- Requires immediate attention and expedited reviews

### Release Branches (`release/*`)

- Used to prepare for a new production release
- Always branch off from: `develop`
- Always merge back into: `main` and `develop`
- Naming convention: `release/v<version>`
- Example: `release/v0.2.0`, `release/v1.0.0`
- Only bug fixes and release preparations should be done in these branches

## Workflow

### Feature Development

1. Create a new feature branch from `develop`: `git checkout -b feature/my-feature develop`
2. Develop and commit changes to the feature branch
3. When complete, push the branch and create a pull request to `develop`
4. After code review and approval, merge the feature into `develop`

### Release Process

1. When `develop` has enough features for a release or a planned release date is approaching:
   - Create a release branch: `git checkout -b release/v1.0.0 develop`
2. Perform final testing and bug fixes in the release branch
3. Once ready for release:
   - Merge the release branch into `main`: `git checkout main && git merge --no-ff release/v1.0.0`
   - Tag the release in `main`: `git tag -a v1.0.0 -m "Version 1.0.0"`
   - Merge the release branch back to `develop`: `git checkout develop && git merge --no-ff release/v1.0.0`
   - Delete the release branch: `git branch -d release/v1.0.0`

### Hotfix Process

1. When a critical bug is identified in production:
   - Create a hotfix branch from `main`: `git checkout -b hotfix/v1.0.1 main`
2. Fix the issue in the hotfix branch
3. Once the fix is complete:
   - Merge the hotfix into `main`: `git checkout main && git merge --no-ff hotfix/v1.0.1`
   - Tag the hotfix in `main`: `git tag -a v1.0.1 -m "Version 1.0.1"`
   - Merge the hotfix into `develop`: `git checkout develop && git merge --no-ff hotfix/v1.0.1`
   - Delete the hotfix branch: `git branch -d hotfix/v1.0.1`

## Pull Request Guidelines

- All changes must be made through pull requests
- Pull requests require at least one review before merging
- Feature branches should be deleted after merging
- CI tests must pass before merging is allowed
- Use meaningful commit messages that explain why the change was made

## Branch Protection Rules

- The `main` branch requires pull request reviews before merging
- The `main` branch requires status checks to pass before merging
- The `develop` branch requires status checks to pass before merging
- Direct pushes to `main` and `develop` are prohibited

## Tagging Strategy

- All production releases are tagged with version numbers
- We use semantic versioning: `vMAJOR.MINOR.PATCH`
  - MAJOR: Breaking changes
  - MINOR: New features, no breaking changes
  - PATCH: Bug fixes, no breaking changes
- Tags should be annotated for proper release notes
- Example: `git tag -a v1.0.0 -m "Version 1.0.0 - Initial Release"`

