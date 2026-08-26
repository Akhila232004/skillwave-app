const { execFileSync, execSync } = require("child_process");

const ports = process.argv
  .slice(2)
  .map((value) => Number.parseInt(value, 10))
  .filter((value) => Number.isInteger(value) && value > 0 && value <= 65535);

if (ports.length === 0) {
  process.exit(0);
}

const ownPid = String(process.pid);

const killPid = (pid) => {
  if (!pid || pid === ownPid) return;

  try {
    if (process.platform === "win32") {
      execFileSync("taskkill", ["/F", "/PID", pid], { stdio: "ignore" });
    } else {
      execFileSync("kill", ["-TERM", pid], { stdio: "ignore" });
    }
  } catch {
    // The process may have already exited.
  }
};

const windowsListeningPids = (port) => {
  let output = "";

  try {
    output = execSync(`netstat -ano | findstr :${port} | findstr LISTENING`, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
  } catch {
    return [];
  }

  return output
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split(/\s+/))
    .filter((parts) => parts[0] === "TCP" && parts[1]?.endsWith(`:${port}`))
    .map((parts) => parts.at(-1))
    .filter(Boolean);
};

const unixListeningPids = (port) => {
  try {
    return execFileSync("lsof", ["-ti", `tcp:${port}`, "-sTCP:LISTEN"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    })
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
};

for (const port of ports) {
  const pids =
    process.platform === "win32" ? windowsListeningPids(port) : unixListeningPids(port);

  for (const pid of new Set(pids)) {
    killPid(pid);
  }
}
