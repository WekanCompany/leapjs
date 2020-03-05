function registerCleanup(
  exitCallback: any,
  sigintCallback: any,
  uncaughtExceptionCallback: any,
): void {
  process.on('exit', exitCallback);
  process.on('SIGINT', sigintCallback);
  process.on('SIGUSR1', sigintCallback);
  process.on('SIGUSR2', sigintCallback);
  process.on('uncaughtException', uncaughtExceptionCallback);

  ['SIGINT', 'SIGTERM', 'SIGQUIT', 'SIGKILL'].forEach((signal: any) =>
    process.on(signal, () => {
      process.exit();
    }),
  );
}

export default registerCleanup;
