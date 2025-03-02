import { Command } from '@commander-js/extra-typings';
import { bundlesOption, manifestOption, srcDirOption, tabsOption, type TimedResult } from '@src/commandUtils';
import { logInputs, type Severity } from '../utils';

export interface PrebuildOptions {
  srcDir: string
  manifest: string
  bundles: string[]
  tabs: string[]
}

export type PrebuildResult<T extends { severity: Severity }> = TimedResult<T>;

export function createPrebuildCommand(
  commandName: string,
  description: string
) {
  return new Command(commandName)
    .description(description)
    .addOption(srcDirOption)
    .addOption(manifestOption)
    .addOption(bundlesOption)
    .addOption(tabsOption);
}

export function createPrebuildCommandHandler<T extends { severity: Severity }>(
  func: (opts: PrebuildOptions) => Promise<PrebuildResult<T>>,
  resultsProcessor: (results: PrebuildResult<T>) => string
) {
  return async (opts: PrebuildOptions) => {
    console.log(logInputs(opts, {}));
    const results = await func(opts);
    const toLog = resultsProcessor(results);

    console.log(toLog);
    if (results.result.severity === 'error') process.exit(1);
  };
}
