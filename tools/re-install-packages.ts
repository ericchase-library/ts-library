const package_json = await Bun.file('./package.json').json();

const package_list = Object.keys(package_json.dependencies ?? {});
const package_dev_list = Object.keys(package_json.devDependencies ?? {});

// Remove

for (const item of package_list) {
  Bun.spawnSync(['bun', 'remove', item], { stdout: 'inherit' });
}
for (const item of package_dev_list) {
  Bun.spawnSync(['bun', 'remove', item], { stdout: 'inherit' });
}

// Add

for (const item of package_list) {
  Bun.spawnSync(['bun', 'add', item], { stdout: 'inherit' });
}
for (const item of package_dev_list) {
  Bun.spawnSync(['bun', 'add', '-d', item], { stdout: 'inherit' });
}
