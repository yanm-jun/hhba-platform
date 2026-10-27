# HHBA platform migration (2026-10-27)

## Scope and provenance

This repository starts with a fresh `main` history. It deliberately does not
import the old repository's branch graph.

* Static-site baseline: `yanm-jun/hhba-talent`, branch
  `feat/hhba-unified-static-20261025`, commit
  `9bb35bb2fdaaa4abfd2008b1267e659cd3830b81`.
* Domestic Apply Assistant V0.2: `yanm-jun/hhba-talent`, branch
  `feat/hhba-domestic-apply-assistant-20261027`, commit
  `ca93248da088206dce62fe723be7cdfc264f9872`.

The baseline retains the static site, employer material, overseas job samples,
and employer/admin previews. The V0.2 migration adds the browser extension,
candidate UI, application-intelligence gateway, tests, and operating notes.

## Deployment boundary

This migration adds verification-only GitHub Actions. It does not enable GitHub
Pages, Railway, Alibaba Cloud, or any production deployment. Deployment of any
kind requires explicit human approval after a separate review.

The apply-assistant extension must never submit a real application
automatically. Browser coverage uses only its synthetic Chinese recruitment
form fixture; any test against a live or third-party form needs explicit,
written authorization.
