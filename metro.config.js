// Learn more: https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');
const fs = require('fs');

const config = getDefaultConfig(__dirname);

const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (typeof moduleName === 'string' && (moduleName.includes('nativewind') || moduleName.includes('global.css'))) {
    if (moduleName.includes('node_modules') || moduleName.startsWith('C:') || moduleName.includes('Users')) {
      const cacheWebPath = path.resolve(__dirname, 'node_modules/.cache/nativewind/global.css.web.css');
      const cachePath = path.resolve(__dirname, 'node_modules/.cache/nativewind/global.css');
      const targetPath = fs.existsSync(cacheWebPath) ? cacheWebPath : fs.existsSync(cachePath) ? cachePath : null;
      if (targetPath) {
        return {
          type: 'sourceFile',
          filePath: targetPath,
        };
      }
    }
  }
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: './global.css' });
