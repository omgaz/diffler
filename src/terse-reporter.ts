import type { SerializedError, TestModule } from 'vitest/node';
import type { Reporter } from 'vitest/reporters';

const collectFailures = (testModule: TestModule): string[] => {
  const failures: string[] = [];
  for (const testCase of testModule.children.allTests('failed')) {
    const result = testCase.result();
    if (result.state !== 'failed') continue;
    const errorMessages = result.errors
      .map((e) => e.message?.split('\n')[0] ?? 'unknown error')
      .join('; ');
    failures.push(`  FAIL ${testCase.fullName} → ${errorMessages}`);
  }
  return failures;
};

export default class TerseReporter implements Reporter {
  onTestRunEnd(
    testModules: ReadonlyArray<TestModule>,
    unhandledErrors: ReadonlyArray<SerializedError>,
  ) {
    const lines: string[] = [];
    let passed = 0;
    let failed = 0;
    let skipped = 0;

    for (const mod of testModules) {
      const moduleFailures: string[] = [];

      for (const testCase of mod.children.allTests()) {
        const state = testCase.result().state;
        if (state === 'passed') passed++;
        else if (state === 'failed') {
          failed++;
          moduleFailures.push(...collectFailures(mod));
        } else if (state === 'skipped') skipped++;
      }

      if (moduleFailures.length > 0) {
        lines.push(mod.relativeModuleId);
        lines.push(...moduleFailures);
      }
    }

    for (const error of unhandledErrors) {
      lines.push(`UNHANDLED ${error.message}`);
    }

    const status = failed > 0 ? 'FAIL' : 'PASS';
    const parts = [`${status} ${passed} passed`, `${failed} failed`];
    if (skipped > 0) parts.push(`${skipped} skipped`);
    lines.push(parts.join(', '));

    console.log(lines.join('\n'));
  }
}
