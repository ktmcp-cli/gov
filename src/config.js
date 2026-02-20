import Conf from 'conf';

const config = new Conf({
  projectName: 'ktmcp-workbc'
});

export function getConfig() {
  return {
    baseUrl: config.get('baseUrl', 'https://www.workbc.ca/api')
  };
}

export function setConfig(key, value) {
  config.set(key, value);
}

export function isConfigured() {
  return true; // WorkBC API is public, no API key required
}
