import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { getConfig, setConfig } from './config.js';
import {
  searchJobs,
  getJob,
  getJobTypes,
  getIndustries,
  getRegions
} from './api.js';

const program = new Command();

function printSuccess(message) {
  console.log(chalk.green('✓') + ' ' + message);
}

function printError(message) {
  console.error(chalk.red('✗') + ' ' + message);
}

function printTable(data, columns) {
  if (!data || data.length === 0) {
    console.log(chalk.yellow('No results found.'));
    return;
  }

  const widths = {};
  columns.forEach(col => {
    widths[col.key] = col.label.length;
    data.forEach(row => {
      const val = String(col.format ? col.format(row[col.key], row) : (row[col.key] ?? ''));
      if (val.length > widths[col.key]) widths[col.key] = val.length;
    });
    widths[col.key] = Math.min(widths[col.key], 40);
  });

  const header = columns.map(col => col.label.padEnd(widths[col.key])).join('  ');
  console.log(chalk.bold(chalk.cyan(header)));
  console.log(chalk.dim('─'.repeat(header.length)));

  data.forEach(row => {
    const line = columns.map(col => {
      const val = String(col.format ? col.format(row[col.key], row) : (row[col.key] ?? ''));
      return val.padEnd(widths[col.key]);
    }).join('  ');
    console.log(line);
  });
}

// ============================================================
// Commands
// ============================================================

program
  .name('workbc')
  .description('WorkBC Job Search CLI')
  .version('1.0.0');

// Config command
program
  .command('config')
  .description('Configure WorkBC CLI settings')
  .option('--base-url <url>', 'Set API base URL')
  .option('--show', 'Show current configuration')
  .action(async (options) => {
    try {
      if (options.show) {
        const config = getConfig();
        console.log(JSON.stringify(config, null, 2));
        return;
      }

      if (options.baseUrl) {
        setConfig('baseUrl', options.baseUrl);
        printSuccess(`Base URL set to: ${options.baseUrl}`);
      }
    } catch (error) {
      printError(error.message);
      process.exit(1);
    }
  });

// Search jobs
program
  .command('search')
  .description('Search job postings')
  .option('--keywords <text>', 'Search keywords')
  .option('--region <region>', 'Filter by region')
  .option('--industry <industry>', 'Filter by industry')
  .option('--job-type <type>', 'Filter by job type (full-time, part-time, etc.)')
  .option('--page <number>', 'Page number', '1')
  .option('--per-page <number>', 'Results per page', '10')
  .option('--json', 'Output as JSON')
  .action(async (options) => {
    const spinner = ora('Searching jobs...').start();
    try {
      const params = {
        page: options.page,
        per_page: options.perPage
      };

      if (options.keywords) {
        params.keywords = options.keywords;
      }

      if (options.region) {
        params.region = options.region;
      }

      if (options.industry) {
        params.industry = options.industry;
      }

      if (options.jobType) {
        params.job_type = options.jobType;
      }

      const data = await searchJobs(params);
      spinner.stop();

      if (options.json) {
        console.log(JSON.stringify(data, null, 2));
        return;
      }

      if (data.jobs && data.jobs.length > 0) {
        printSuccess(`Found ${data.jobs.length} jobs`);
        printTable(data.jobs, [
          { key: 'id', label: 'ID' },
          { key: 'title', label: 'Title', format: (val) => (val || '').substring(0, 40) },
          { key: 'employer', label: 'Employer', format: (val) => (val || '').substring(0, 30) },
          { key: 'location', label: 'Location', format: (val) => (val || '').substring(0, 25) }
        ]);
      } else {
        console.log(chalk.yellow('No jobs found.'));
      }
    } catch (error) {
      spinner.stop();
      printError(error.message);
      process.exit(1);
    }
  });

// Get job details
program
  .command('job <id>')
  .description('Get details for a specific job posting')
  .option('--json', 'Output as JSON')
  .action(async (id, options) => {
    const spinner = ora('Fetching job details...').start();
    try {
      const data = await getJob(id);
      spinner.stop();

      if (options.json) {
        console.log(JSON.stringify(data, null, 2));
        return;
      }

      const job = data.job || data;
      console.log(chalk.bold.cyan('\nJob Details:'));
      console.log(chalk.dim('─'.repeat(60)));
      console.log(`${chalk.bold('ID:')} ${job.id}`);
      console.log(`${chalk.bold('Title:')} ${job.title || 'N/A'}`);
      console.log(`${chalk.bold('Employer:')} ${job.employer || 'N/A'}`);
      console.log(`${chalk.bold('Location:')} ${job.location || 'N/A'}`);
      console.log(`${chalk.bold('Job Type:')} ${job.job_type || 'N/A'}`);
      console.log(`${chalk.bold('Salary:')} ${job.salary || 'N/A'}`);
      console.log(`${chalk.bold('Posted:')} ${job.posted_date || 'N/A'}`);
      console.log(`${chalk.bold('Description:')} ${job.description || 'N/A'}`);
      if (job.url) {
        console.log(`${chalk.bold('URL:')} ${job.url}`);
      }
    } catch (error) {
      spinner.stop();
      printError(error.message);
      process.exit(1);
    }
  });

// Get job types
program
  .command('types')
  .description('List available job types')
  .option('--json', 'Output as JSON')
  .action(async (options) => {
    const spinner = ora('Fetching job types...').start();
    try {
      const data = await getJobTypes();
      spinner.stop();

      if (options.json) {
        console.log(JSON.stringify(data, null, 2));
        return;
      }

      if (data.types && data.types.length > 0) {
        printSuccess(`Found ${data.types.length} job types`);
        printTable(data.types, [
          { key: 'id', label: 'ID' },
          { key: 'name', label: 'Type Name' }
        ]);
      } else if (Array.isArray(data)) {
        printSuccess(`Found ${data.length} job types`);
        data.forEach(type => {
          console.log(`  • ${type.name || type}`);
        });
      } else {
        console.log(chalk.yellow('No job types found.'));
      }
    } catch (error) {
      spinner.stop();
      printError(error.message);
      process.exit(1);
    }
  });

// Get industries
program
  .command('industries')
  .description('List available industries')
  .option('--json', 'Output as JSON')
  .action(async (options) => {
    const spinner = ora('Fetching industries...').start();
    try {
      const data = await getIndustries();
      spinner.stop();

      if (options.json) {
        console.log(JSON.stringify(data, null, 2));
        return;
      }

      if (data.industries && data.industries.length > 0) {
        printSuccess(`Found ${data.industries.length} industries`);
        printTable(data.industries, [
          { key: 'id', label: 'ID' },
          { key: 'name', label: 'Industry Name' }
        ]);
      } else if (Array.isArray(data)) {
        printSuccess(`Found ${data.length} industries`);
        data.forEach(industry => {
          console.log(`  • ${industry.name || industry}`);
        });
      } else {
        console.log(chalk.yellow('No industries found.'));
      }
    } catch (error) {
      spinner.stop();
      printError(error.message);
      process.exit(1);
    }
  });

// Get regions
program
  .command('regions')
  .description('List available regions')
  .option('--json', 'Output as JSON')
  .action(async (options) => {
    const spinner = ora('Fetching regions...').start();
    try {
      const data = await getRegions();
      spinner.stop();

      if (options.json) {
        console.log(JSON.stringify(data, null, 2));
        return;
      }

      if (data.regions && data.regions.length > 0) {
        printSuccess(`Found ${data.regions.length} regions`);
        printTable(data.regions, [
          { key: 'id', label: 'ID' },
          { key: 'name', label: 'Region Name' }
        ]);
      } else if (Array.isArray(data)) {
        printSuccess(`Found ${data.length} regions`);
        data.forEach(region => {
          console.log(`  • ${region.name || region}`);
        });
      } else {
        console.log(chalk.yellow('No regions found.'));
      }
    } catch (error) {
      spinner.stop();
      printError(error.message);
      process.exit(1);
    }
  });

program.parse();
