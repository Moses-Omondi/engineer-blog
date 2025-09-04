# Security Policy

## Supported Versions

We release patches for security vulnerabilities on the latest stable version.

## Reporting a Vulnerability

If you believe you have found a security vulnerability, please report it to us by sending an email to **mosesomondi.dev@gmail.com**. Please include:
- A detailed description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested mitigations

We will acknowledge receipt of your report within 48 hours and provide an estimated timeline for remediation.

## Security Best Practices in This Repo

- All dependencies are pinned in package.json and automatically updated by Dependabot
- CI runs npm audit and Snyk scans on every pull request
- Linting includes security rules via eslint-plugin-security
- User-generated content is sanitized using sanitize-html
- No secrets are stored in the repository or CI variables

## Disclosure Policy

We follow a responsible disclosure policy. Please do not disclose the vulnerability publicly until it has been resolved and a release has been made available.
