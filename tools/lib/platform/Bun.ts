import { Provider } from 'tools/lib/platform/provider.js';

const BunProvider = new Provider();
BunProvider.File.readBytes = async (path) => await Bun.file(path).bytes();
BunProvider.File.readText = async (path) => await Bun.file(path).text();
BunProvider.File.write = async (path, data) => await Bun.write(path, data);

export default BunProvider;
