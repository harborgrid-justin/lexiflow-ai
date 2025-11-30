# GitHub Actions Workflows

## Status: DISABLED

All workflows are currently **DISABLED** and set to manual trigger only (`workflow_dispatch`).

## Available Workflows

### 1. CI/CD Pipeline (`ci-cd.yml`)
**Purpose**: Continuous integration and deployment
- Frontend linting and build
- Backend linting, testing, and build
- Security vulnerability scanning
- TypeScript type checking
- Code quality checks (SonarCloud)
- Deploy preview (PR)
- Deploy to production (main branch)

**Triggers (when enabled)**:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

### 2. Security Audit (`security.yml`)
**Purpose**: Security scanning and vulnerability detection
- Dependency vulnerability scan (Snyk)
- Code security scan (CodeQL)
- Secret scanning (TruffleHog)
- Docker image security scan (Trivy)
- OWASP ZAP security testing

**Triggers (when enabled)**:
- Push to `main` or `develop` branches
- Pull requests to `main` branch
- Weekly schedule (Sundays at 3 AM UTC)

### 3. Code Quality (`code-quality.yml`)
**Purpose**: Code quality and standards enforcement
- ESLint checks
- Prettier formatting checks
- TypeScript type coverage
- Unused exports detection
- Code complexity analysis

**Triggers (when enabled)**:
- Push to `main` or `develop` branches
- Pull requests to `main` branch

### 4. Performance Monitoring (`performance.yml`)
**Purpose**: Performance testing and monitoring
- Lighthouse CI (Core Web Vitals)
- Bundle size analysis
- API load testing (Artillery)

**Triggers (when enabled)**:
- Push to `main` branch
- Pull requests to `main` branch
- Daily schedule (2 AM UTC)

### 5. Dependency Updates (`dependency-updates.yml`)
**Purpose**: Automated dependency updates
- Update npm packages (frontend and backend)
- Apply security fixes from npm audit
- Create PR with updates

**Triggers (when enabled)**:
- Weekly schedule (Mondays at 9 AM UTC)

## How to Enable Workflows

### Option 1: Enable Individual Workflow
1. Open the workflow file (e.g., `ci-cd.yml`)
2. Remove the `workflow_dispatch:` line
3. Uncomment the desired trigger(s)
4. Commit and push changes

**Before:**
```yaml
on:
  workflow_dispatch: # Manual trigger only
  # push:
  #   branches: [ main, develop ]
```

**After:**
```yaml
on:
  push:
    branches: [ main, develop ]
```

### Option 2: Manual Trigger (Current Setup)
All workflows can be manually triggered from the GitHub Actions tab:
1. Go to repository → Actions
2. Select the workflow
3. Click "Run workflow"
4. Select branch and click "Run workflow"

## Required Secrets

Before enabling workflows, configure these secrets in GitHub Settings → Secrets:

### Required for Deployment
- `VERCEL_TOKEN` - Vercel deployment token
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_PROJECT_ID` - Vercel project ID
- `RAILWAY_TOKEN` - Railway deployment token (backend)

### Required for Security Scanning
- `SNYK_TOKEN` - Snyk API token for vulnerability scanning
- `SONAR_TOKEN` - SonarCloud token for code quality

### Auto-Generated (No action needed)
- `GITHUB_TOKEN` - Automatically provided by GitHub Actions

## Configuration Files

- `.lighthouserc.json` - Lighthouse CI performance budgets
- `.prettierrc` - Prettier formatting rules (if needed)
- `.eslintrc.*` - ESLint configuration

## Best Practices

1. **Enable Gradually**: Start with CI/CD, then add quality and security checks
2. **Test Locally**: Run linters, tests, and builds locally before enabling CI
3. **Configure Secrets**: Set up all required secrets before enabling deployments
4. **Monitor Costs**: Some actions (Snyk, SonarCloud) may have usage limits
5. **Review PR Checks**: Ensure all checks pass before merging

## Workflow Dependencies

```
deploy-production
  ↳ Requires: frontend-build, backend-build, security-scan, type-check

deploy-preview
  ↳ Requires: frontend-build, backend-build
```

## Estimated Monthly Usage

With all workflows enabled on a moderately active repository:
- **CI/CD**: ~500-1000 minutes/month
- **Security**: ~200 minutes/month
- **Code Quality**: ~300 minutes/month
- **Performance**: ~100 minutes/month
- **Dependencies**: ~50 minutes/month

**Total**: ~1,150-1,650 minutes/month (Free tier: 2,000 minutes/month for public repos)

## Support

For issues with workflows:
1. Check workflow logs in Actions tab
2. Verify all secrets are configured
3. Review individual job output
4. Consult workflow-specific documentation

## Last Updated
2025-11-30
