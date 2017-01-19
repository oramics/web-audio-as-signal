/* global AudioContext */
require('web-audio-test-api')
const test = require('tst')
const assert = require('assert')
const { osc, sawtooth, gain, filter, hipass } = require('..')

// helpers to make testing the connections easy
const inputs = (node) => node.toJSON().inputs
const output = (node) => node.toJSON()

const context = () => new AudioContext()

test('oscillator', () => {
  test('create', () => {
    const o = osc({ type: 'sawtooth', frequency: 200, detune: 10 })(context())
    assert.deepEqual(o.type, 'sawtooth')
    assert.deepEqual(o.frequency.value, 200)
    assert.deepEqual(o.detune.value, 10)
  })
  test('sawtooth', () => {
    const node = sawtooth(100)(context())
    assert.deepEqual(node.type, 'sawtooth')
    assert.deepEqual(node.frequency.value, 100)
  })
})

test('filter', () => {
  const ac = context()
  const signal = gain()(ac)
  test('create', () => {
    const node = filter({ type: 'highpass', frequency: 200 }, signal)(ac)
    assert.deepEqual(node.type, 'highpass')
    assert.deepEqual(node.frequency.value, 200)
    assert.deepEqual(inputs(node), [output(signal)])
  })
  test('lowpass', () => {
    const node = hipass(1000, signal)(context())
    assert.deepEqual(node.type, 'highpass')
    assert.deepEqual(node.frequency.value, 1000)
  })
})

test('gain', () => {
  test('create', () => {
    const node = gain({ gain: 5 })(context())
    assert.deepEqual(node.gain.value, 5)
  })
  test('wrap props', () => {
    const node = gain(10)(context())
    assert.deepEqual(node.gain.value, 10)
  })
})
