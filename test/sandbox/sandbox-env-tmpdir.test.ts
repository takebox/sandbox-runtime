import { describe, it, expect, beforeEach, afterEach } from 'bun:test'
import { generateProxyEnvVars } from '../../src/sandbox/sandbox-utils.js'

describe('generateProxyEnvVars: TMPDIR', () => {
  const saved = {
    HAIJUN_CODE_TMPDIR: process.env.HAIJUN_CODE_TMPDIR,
    HAIJUN_TMPDIR: process.env.HAIJUN_TMPDIR,
  }

  beforeEach(() => {
    delete process.env.HAIJUN_CODE_TMPDIR
    delete process.env.HAIJUN_TMPDIR
  })

  afterEach(() => {
    for (const [k, v] of Object.entries(saved)) {
      if (v === undefined) delete process.env[k]
      else process.env[k] = v
    }
  })

  it('reads HAIJUN_CODE_TMPDIR for TMPDIR', () => {
    process.env.HAIJUN_CODE_TMPDIR = '/tmp/haijun-1001'
    expect(generateProxyEnvVars()).toContain('TMPDIR=/tmp/haijun-1001')
  })

  it('falls back to HAIJUN_TMPDIR when HAIJUN_CODE_TMPDIR is unset', () => {
    process.env.HAIJUN_TMPDIR = '/tmp/legacy'
    expect(generateProxyEnvVars()).toContain('TMPDIR=/tmp/legacy')
  })

  it('prefers HAIJUN_CODE_TMPDIR over HAIJUN_TMPDIR when both set', () => {
    process.env.HAIJUN_CODE_TMPDIR = '/tmp/haijun-1001'
    process.env.HAIJUN_TMPDIR = '/tmp/legacy'
    expect(generateProxyEnvVars()).toContain('TMPDIR=/tmp/haijun-1001')
  })

  it('falls back to /tmp/haijun when neither is set', () => {
    expect(generateProxyEnvVars()).toContain('TMPDIR=/tmp/haijun')
  })

  it('omits TMPDIR when skipTmpdir is true', () => {
    process.env.HAIJUN_CODE_TMPDIR = '/tmp/haijun-1001'
    const vars = generateProxyEnvVars(
      undefined,
      undefined,
      undefined,
      undefined,
      true,
    )
    expect(vars.some(v => v.startsWith('TMPDIR='))).toBe(false)
    expect(vars).toContain('SANDBOX_RUNTIME=1')
  })
})
