# WorkBC Job Search CLI - Agent Guide

## Overview

This is a CLI for the WorkBC Job Posting API, which provides access to job postings in British Columbia, Canada.

## Common Commands

### Search Jobs
```bash
workbc search --keywords "software developer"
workbc search --region "Vancouver" --industry "Technology"
workbc search --job-type "full-time" --per-page 20
```

### Get Job Details
```bash
workbc job 12345
```

### List Available Options
```bash
workbc types
workbc industries
workbc regions
```

## API Key

No API key required - WorkBC API is public.

## JSON Output

Add `--json` to any command for structured output suitable for parsing.
