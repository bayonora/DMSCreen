const fs = require('fs');

// ViewInitiative
const initPath = 'src/views/ViewInitiative.tsx';
let initCode = fs.readFileSync(initPath, 'utf8');

// padding on list item
initCode = initCode.replace(
  /"flex items-center px-6 py-4 border-b border-\[#2a2420\] transition-colors"/g,
  '"flex items-center px-3 sm:px-6 py-4 border-b border-[#2a2420] transition-colors"'
);

// right block responsiveness
const targetRightBlock = `<div className="flex items-center gap-6 shrink-0 mt-2 md:mt-0 justify-start">
                      <div className="w-48 flex flex-col justify-center items-end pr-4">`;
const newRightBlock = `<div className="flex items-center gap-4 sm:gap-6 shrink-0 mt-3 md:mt-0 justify-between w-full md:w-auto">
                      <div className="flex-1 md:w-48 flex flex-col justify-center md:items-end md:pr-4">`;
initCode = initCode.replace(targetRightBlock, newRightBlock);

// adjust hp text and progress bar alignment on mobile
const targetHpText = `<div className="flex items-center gap-1 text-sm font-mono mb-1 justify-end w-full">`;
const newHpText = `<div className="flex items-center gap-1 text-sm font-mono mb-1 justify-start md:justify-end w-full">`;
initCode = initCode.replace(targetHpText, newHpText);

fs.writeFileSync(initPath, initCode);

// App.tsx header padding
const appPath = 'src/App.tsx';
let appCode = fs.readFileSync(appPath, 'utf8');
appCode = appCode.replace(
  /className="flex justify-between items-center px-6 py-3/g,
  'className="flex justify-between items-center px-4 sm:px-6 py-3'
);
fs.writeFileSync(appPath, appCode);

