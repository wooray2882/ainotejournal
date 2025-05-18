# Commit Strategy for AI Note Journal

## When to Commit
1. **New Features**
   - When a new feature is completed and tested
   - When a new screen or component is added
   - When new API integrations are implemented

2. **Bug Fixes**
   - When a bug is identified and fixed
   - When a critical issue is resolved
   - When performance improvements are made

3. **Major Updates**
   - When UI/UX changes are implemented
   - When authentication flows are modified
   - When backend configurations are updated
   - When dependencies are updated

4. **Code Refactoring**
   - When code is restructured for better organization
   - When components are optimized
   - When code quality improvements are made

## Commit Message Format
```
type(scope): description

[optional body]

[optional footer]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or modifying tests
- `chore`: Maintenance tasks

### Examples
```
feat(auth): implement email verification flow
fix(login): resolve USER_PASSWORD_AUTH flow issue
refactor(components): optimize NoteCard component
style(ui): update color scheme for dark mode
```

## Branch Strategy
1. **Main Branch**
   - `main`: Production-ready code
   - Protected branch
   - Requires pull request reviews

2. **Development Branch**
   - `develop`: Integration branch for features
   - Base branch for feature branches

3. **Feature Branches**
   - `feature/feature-name`: For new features
   - `fix/bug-name`: For bug fixes
   - `refactor/component-name`: For refactoring

## Pull Request Process
1. Create a feature/fix branch from `develop`
2. Make changes and commit following the commit message format
3. Push changes and create a pull request
4. Get code review approval
5. Merge into `develop`
6. After testing, merge `develop` into `main`

## Commit Frequency
- Commit after each logical unit of work
- Don't wait for multiple features to be complete
- Keep commits focused and atomic
- Push to remote repository after each commit

## Best Practices
1. Write clear, descriptive commit messages
2. Keep commits focused on a single change
3. Test changes before committing
4. Review changes before pushing
5. Keep the commit history clean and meaningful

## Tools and Commands
```bash
# Create a new feature branch
git checkout -b feature/feature-name

# Stage changes
git add .

# Commit changes
git commit -m "type(scope): description"

# Push changes
git push origin feature/feature-name

# Update local repository
git pull origin develop
```

## Review Process
1. Self-review changes before committing
2. Ensure code follows project standards
3. Verify all tests pass
4. Check for any linting errors
5. Review commit message format

Remember: A good commit history is like a project diary - it should tell the story of how the project evolved and make it easy to understand why changes were made. 