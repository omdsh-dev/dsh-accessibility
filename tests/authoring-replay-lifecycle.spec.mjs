import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('authoring replay lifecycle contract', () => {
  it.each(['authoring-agent-replay.jsonl', 'authoring-at-replay.jsonl'])(
    '%s places all five model streams inside matching turn and step boundaries', (file) => {
      const rows = readFileSync(new URL(`../scripts/${file}`, import.meta.url), 'utf8')
        .trim().split(/\r?\n/u).map(line => JSON.parse(line))
      expect(rows[0]).toMatchObject({ type: 'session', version: 0 })
      const lifecycle = rows.filter(row => row.type !== 'assistant/chunk').slice(1)
      expect(lifecycle).toEqual([
        { type: 'turn/start', data: { turn: 1 } },
        ...[1, 2, 3, 4, 5].flatMap(step => [
          { type: 'step/start', data: { turn: 1, step } },
          { type: 'step/end', data: { turn: 1, step } },
        ]),
        { type: 'turn/end', data: { turn: 1, reason: { kind: 'completed' } } },
      ])
      let openStep
      const finishes = []
      for (const row of rows.slice(1)) {
        if (row.type === 'step/start') openStep = row.data.step
        else if (row.type === 'step/end') openStep = undefined
        else if (row.type === 'assistant/chunk') {
          expect(openStep).toBe(row.data.step)
          expect(row.data.turn).toBe(1)
          if (row.data.chunk.type === 'finish') finishes.push(row.data.step)
        }
      }
      expect(finishes).toEqual([1, 2, 3, 4, 5])
    },
  )
})
