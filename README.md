![Banner](https://raw.githubusercontent.com/ktmcp-cli/gov/main/banner.svg)

> "Six months ago, everyone was talking about MCPs. And I was like, screw MCPs. Every MCP would be better as a CLI."
>
> — [Peter Steinberger](https://twitter.com/steipete), Founder of OpenClaw
> [Watch on YouTube (~2:39:00)](https://www.youtube.com/@lexfridman) | [Lex Fridman Podcast #491](https://lexfridman.com/peter-steinberger/)

# WorkBC Job Search CLI

> **⚠️ Unofficial CLI** - Not officially sponsored or affiliated with WorkBC.

A production-ready command-line interface for [WorkBC Job Posting API](https://www.workbc.ca/) — search and discover job opportunities in British Columbia, Canada. Access thousands of job postings directly from your terminal.

## Features

- **Job Search** — Search jobs by keywords, region, industry, and job type
- **Job Details** — Get detailed information about specific job postings
- **Filter Options** — Browse available job types, industries, and regions
- **Advanced Filtering** — Combine multiple filters for precise results
- **JSON output** — All commands support `--json` for scripting
- **Colorized output** — Clean terminal output with chalk

## Installation

```bash
npm install -g @ktmcp-cli/gov
```

## Quick Start

```bash
# Search for software developer jobs
workbc search --keywords "software developer"

# Search by region and industry
workbc search --region "Vancouver" --industry "Technology"

# Get details for a specific job
workbc job 12345

# List available job types
workbc types

# List available industries
workbc industries

# List available regions
workbc regions
```

## Commands

### Config

```bash
workbc config --base-url https://www.workbc.ca/api
workbc config --show
```

### Search Jobs

```bash
# Search all jobs
workbc search

# Search by keywords
workbc search --keywords "nurse"
workbc search --keywords "construction manager"

# Filter by region
workbc search --region "Vancouver"
workbc search --region "Victoria"

# Filter by industry
workbc search --industry "Healthcare"
workbc search --industry "Technology"

# Filter by job type
workbc search --job-type "full-time"
workbc search --job-type "part-time"

# Combine multiple filters
workbc search --keywords "developer" --region "Vancouver" --job-type "full-time"

# Pagination
workbc search --page 2 --per-page 20

# JSON output
workbc search --json
```

### Get Job Details

```bash
workbc job 12345
workbc job 67890 --json
```

### List Job Types

```bash
workbc types
workbc types --json
```

### List Industries

```bash
workbc industries
workbc industries --json
```

### List Regions

```bash
workbc regions
workbc regions --json
```

## JSON Output

All commands support `--json` for structured output:

```bash
workbc search --keywords "developer" --json | jq '.jobs[] | {id, title, employer}'
workbc job 12345 --json | jq '.job.description'
workbc industries --json | jq '.industries[] | .name'
```

## Why CLI > MCP?

No server to run. No protocol overhead. Just install and go.

- **Simpler** — Just a binary you call directly
- **Composable** — Pipe to `jq`, `grep`, `awk`
- **Scriptable** — Works in cron jobs, CI/CD, shell scripts

## License

MIT — Part of the [Kill The MCP](https://killthemcp.com) project.


---

## Support KTMCP

If you find this CLI useful, we'd greatly appreciate your support! Share your experience on:
- Reddit
- Twitter/X
- Hacker News

**Incentive:** Users who can demonstrate that their support/advocacy helped advance KTMCP will have their feature requests and issues prioritized.

Just be mindful - these are real accounts and real communities. Authentic mentions and genuine recommendations go a long way!

## Support This Project

If you find this CLI useful, we'd appreciate support across Reddit, Twitter, Hacker News, or Moltbook. Please be mindful - these are real community accounts. Contributors who can demonstrate their support helped advance KTMCP will have their PRs and feature requests prioritized.
