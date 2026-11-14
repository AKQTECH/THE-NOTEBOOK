# Pre-push safety checks — November 13, 2026

36 Playwright cases passed; 2 PWA-only cases intentionally skipped on desktop. Chromium desktop and WebKit phone viewport were exercised. npm audit reported zero known vulnerabilities. A credential-pattern scan found no private keys, GitHub tokens, or Dropbox access tokens in the release and application source.

Additional checks: unsafe JSON rejected without modifying saved notes; executable HTML sanitized; two tabs propagate edits without stale overwrite; concurrent deletion preserves edited content; edited conflict copies survive repeated synchronization; offline cache excludes query strings and unrelated URLs. A separate WebKit smoke test exercised the exact root-PWA plus /desktop deployment and verified shared note persistence.

Fixes: preserve existing conflict copies during repeated sync; restrict service-worker caching to this app's shell, normalize cache keys, and leave other paths such as /desktop untouched.

Deployment files were byte-compared to the tested builds. No user notes, localStorage dumps, OAuth credentials, browser profiles, or test result recordings are included in the push. The public Dropbox app identifier is intentionally included. Existing production assets unrelated to this replacement are retained. The parent Git commit remains a rollback point.

The generated bundle contains intentional Markdown hard-break whitespace inside a dependency's JavaScript template string; it is retained unchanged. Live Dropbox authorization, physical-iPhone installation, and native soft-keyboard behavior remain unverified. Mocked Dropbox conflict tests do not establish live authentication success.
