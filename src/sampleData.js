import { createDemoApplicationDocs } from './demoSeed'

/** Adds stable ids (`sample-1`, …) to rows from `createDemoApplicationDocs`. */
export function createSampleApplications() {
  return createDemoApplicationDocs().map((doc, i) => ({
    ...doc,
    id: `sample-${i + 1}`,
  }))
}
