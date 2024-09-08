# Typescript + React + React Router + SCSS webpack config 
This is a config for Typescript, React, React Router, SCSS that uses Webpack, ESLint, Stylelint, Babel and other tools.

### Another config versions:
React + React Router + SCSS: https://github.com/alexhrabovyi/ts-jsx-react-webpack-configs/tree/react-router
React + React Router + Redux (RTK and React Redux) + SCSS: https://github.com/alexhrabovyi/ts-jsx-react-webpack-configs/tree/react-router-redux

There is also a version of this config that uses ts-loader instead of babel:
https://github.com/alexhrabovyi/ts-jsx-react-webpack-configs/tree/ts-loader-version

### Additional modules:
- SVGR - https://react-svgr.com/
- gh-pages - https://github.com/tschaub/gh-pages
- classnames - https://github.com/JedWatson/classnames

## Features
### HTML
- automatically creates HTML file;
- automatically connects JS and CSS files;

Production:
- minimizing;

### SCSS
- compilation SCSS to CSS;
- file names with contenthash;
- CSS Modules support;
- Stylelint with SCSS style rules;

Development:
- injects in HTML as an inline string to better rebuild performance;
- creates source maps;

Production:
- creates separate bundle files and separate chunk files;
- minimizing;
- adds vendor prefix by Autoprefixer;
- source maps aren't created;
- automatically executes `stylelint --fix`. If any unfixed errors left, build doesn't get created;

### TS | TSX | JS | JSX
- Typescript support
- React support
- React Router support 
- creates separate bundle and separate chunk files;
- file names with contenthash;
- ESLint with React support;

Development:
- creates source maps;

Production:
- minimizing;
- mangling
- treeshacking
- transpiles and adds polyfills
- automatically executes `eslint --fix`. If any unfixed errors left, build doesn't get created;

### Images
- automatically generates to bundle folder;
- file names with contenthash;

Production:
- minimizing;

### Fonts
- automatically generates to bundle folder;
- file names with contenthash;

### Favicons 
- automatically generates to bundle folder;
- automatically connects to HTML file;

Development:
- generates one icon for better performance

Production:
- generates all kinds of favicons for better compatibility;

### Performance
- creates separate vendor.js file that contains necessary node modules. Because it doesn't often get changed, it can be 
cached in users' browser;
- file names depend on their content, so name gets changed only if content of that file changes;

### Webpack Bundle Analyzer
- production and development build can be executed with Webpack Bundle Analyzer to see sizes of files;

### Other
- Webpack DevServer with HMR enabled;
- automatically cleans bundle folder before rebuilds

## Commands
- `eslint` - check files with eslint;
- `esling --fix` - check and fix files with eslint;
- `stylelint` - check files with stylelint;
- `stylelint --fix` - check and fix files with stylelint;
- `build:dev` - execute development build;
- `build:dev:analyze` - execute development build with Webpack Bundle Analyzer stats;
- `build:prod` - execute production build;
- `build:prod:analyze` - execute production build with Webpack Bundle Analyzer stats;
- `serve` - execute development build with Webpack DevServer;
- `serve:tscheck` - execute development build with Webpack DevServer and TS errors checking;
- `deploy` - create production build and deploy it on separate gh-pages branch to publish it on GitHub Pages;

## File Structure
bundle <br />
src <br />
|_assets <br />
&nbsp;&nbsp;|_favicons <br />
&nbsp;&nbsp;|_fonts <br />
|_components <br />
&nbsp;&nbsp;|_common <br />
|_contexts <br />
|_hooks <br />
|_pages <br />
|_scss <br />
|_static <br />
&nbsp;&nbsp;|_index.html <br />
&nbsp;&nbsp;|_main.tsx <br />
&nbsp;&nbsp;|_main.scss <br />
|_utils <br />

## File Structure Example 
bundle  <br />
src  <br />
|_assets  <br />
&nbsp;&nbsp;|_favicons  <br />
&nbsp;&nbsp;&nbsp;&nbsp;|_favicon.png  <br />
&nbsp;&nbsp;|_fonts  <br /> 
&nbsp;&nbsp;&nbsp;&nbsp;|_Roboto-Bold.ttf  <br />
|_components  <br />
&nbsp;&nbsp;|_common  <br />
&nbsp;&nbsp;&nbsp;&nbsp;|_Button <br /> 
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|_Button.tsx		<br />
&nbsp;&nbsp;&nbsp;&nbsp;|_Input  <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|_Input.tsx		<br />
&nbsp;&nbsp;|_ProductList  <br />
&nbsp;&nbsp;&nbsp;&nbsp;|_List.tsx			<br />
&nbsp;&nbsp;&nbsp;&nbsp;|_ProductProfile  <br /> 
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|_Profile.tsx		 <br /> 
&nbsp;&nbsp;|_UserProfile <br />
&nbsp;&nbsp;&nbsp;&nbsp;|_Avatar <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|_images <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|_avatar.png <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|_Avatar.tsx		<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|_Avatar.lazy.tsx		 <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|_Avatar.module.scss <br />
&nbsp;&nbsp;|_Description <br />
&nbsp;&nbsp;&nbsp;&nbsp;|_images <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|_background.png <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|_Description.tsx		<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|_Description.lazy.tsx	 <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|_Description.module.scss <br />
&nbsp;&nbsp;|_Profile.tsx	 <br />
&nbsp;&nbsp;|_Profile.module.scss <br />
|_contexts <br />
&nbsp;&nbsp;|_ThemeContext.tsx <br />
|_hooks <br />
&nbsp;&nbsp;|_useThemeContext.tsx <br />
|_pages <br />
&nbsp;&nbsp;|_ProductListPage <br />
&nbsp;&nbsp;&nbsp;&nbsp;|_ProductListPage.tsx	 <br />
&nbsp;&nbsp;|_ProductProfilePage <br />
&nbsp;&nbsp;&nbsp;&nbsp;|_ProductProfilePage.tsx	 <br />
&nbsp;&nbsp;|_UserProfilePage <br />
&nbsp;&nbsp;&nbsp;&nbsp;|_UserProfilePage.tsx	 <br />
|_scss <br />
&nbsp;&nbsp;|_colors.scss <br />
&nbsp;&nbsp;|_fonts.scss <br />
&nbsp;&nbsp;|_mixins.scss <br />
&nbsp;&nbsp;|_reset.scss <br />
|_static <br />
&nbsp;&nbsp;|_index.html <br />
&nbsp;&nbsp;|_main.tsx <br />
&nbsp;&nbsp;|_main.scss <br />
|_utils <br />
&nbsp;&nbsp;|_productListAPI.json <br />


