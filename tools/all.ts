import { Run } from '../src/Platform/Bun/Process.js';

await Run('bun update');
await Run('bun run format');
await Run('bun run build');
await Run('bun run strip');
await Run('bun test');
