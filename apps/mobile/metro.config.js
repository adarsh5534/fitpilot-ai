const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Watch all files in monorepo (so Metro reloads on changes in packages/shared)
config.watchFolders = [monorepoRoot];

// 2. Let Metro know where to look for modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// 3. Map @fitpilot/shared directly to its source entry point
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  '@fitpilot/shared': path.resolve(monorepoRoot, 'packages/shared/src/index.ts'),
};

module.exports = config;
