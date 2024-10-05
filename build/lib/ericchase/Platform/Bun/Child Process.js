import { ConsoleLogWithDate } from '../../Utility/Console.js';
function logRunnerHeader(cmds) {
  ConsoleLogWithDate(`> ${cmds.map((s) => (s.includes(' ') ? `"${s}"` : s)).join(' ')}`);
}
function parseCommand(args) {
  if (args.flags.has('BunRun')) {
    return ['bun', 'run', ...args.cmds];
  }
  if (args.flags.has('Bun')) {
    return ['bun', ...args.cmds];
  }
  return args.cmds;
}
function parseRunnerFlags(args) {
  const cmds = parseCommand(args);
  const mode = args.flags.has('Quiet') || args.flags.has('Silent') ? 'ignore' : 'inherit';
  if (!args.flags.has('Silent')) logRunnerHeader(cmds);
  return { cmds, mode };
}
function parseSpawnerFlags(args) {
  const cmds = parseCommand(args);
  if (!args.flags.has('Silent')) logRunnerHeader(cmds);
  return { cmds };
}
function takeFlags(flags) {
  try {
    return new Set(flags);
  } finally {
    flags.clear();
  }
}
function runnerChain(flags = new Set()) {
  const instance = new Proxy((...cmds) => runner({ cmds, flags: takeFlags(flags) }), {
    get: (_, flag) => runnerChain(flags.add(flag)),
    apply: (_, __, cmds) => runner({ cmds, flags: takeFlags(flags) }),
  });
  return instance;
}
function runnerChainSync(flags = new Set()) {
  const instance = new Proxy((...cmds) => runnerSync({ cmds, flags: takeFlags(flags) }), {
    get: (_, flag) => runnerChainSync(flags.add(flag)),
    apply: (_, __, cmds) => runnerSync({ cmds, flags: takeFlags(flags) }),
  });
  return instance;
}
function spawnerChain(flags = new Set()) {
  const instance = new Proxy((...cmds) => spawner({ cmds, flags: takeFlags(flags) }), {
    get: (_, flag) => spawnerChain(flags.add(flag)),
    apply: (_, __, cmds) => spawner({ cmds, flags: takeFlags(flags) }),
  });
  return instance;
}
function spawnerChainSync(flags = new Set()) {
  const instance = new Proxy((...cmds) => spawnerSync({ cmds, flags: takeFlags(flags) }), {
    get: (_, flag) => spawnerChainSync(flags.add(flag)),
    apply: (_, __, cmds) => spawnerSync({ cmds, flags: takeFlags(flags) }),
  });
  return instance;
}
function runner(args) {
  const { cmds, mode } = parseRunnerFlags(args);
  return Bun.spawn(cmds, { stdin: 'inherit', stdout: mode, stderr: mode });
}
function runnerSync(args) {
  const { cmds, mode } = parseRunnerFlags(args);
  return Bun.spawnSync(cmds, { stdin: 'inherit', stdout: mode, stderr: mode });
}
function spawner(args) {
  const { cmds } = parseSpawnerFlags(args);
  return Bun.spawn(cmds, { stdin: 'pipe', stdout: 'pipe', stderr: 'pipe' });
}
function spawnerSync(args) {
  const { cmds } = parseSpawnerFlags(args);
  return Bun.spawnSync(cmds, { stdout: 'pipe', stderr: 'pipe' });
}
export const Run = runnerChain();
export const RunSync = runnerChainSync();
export const Spawn = spawnerChain();
export const SpawnSync = spawnerChainSync();
