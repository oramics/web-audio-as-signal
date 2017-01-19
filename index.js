const is = (t, o) => typeof o === t
const isNot = (t, o) => typeof o !== t
const isAudioParam = (p) => p && typeof p.setValueAtTime === 'function'
export const set = (key, value, obj) => { obj[key] = value; return obj }
export const toProps = (props, defKey) => is('object', props) ? props : set(defKey, props, {})

const create = (name, state, startAt) => (ac) => {
  const node = ac['create' + name]()
  Object.keys(state).forEach((k) => plug(node, k, state[k]))
  if (isNot('undefined')) node.start(startAt)
  return node
}

const plug = (node, name, value) => {
  const target = node[name]
  if (is('undefined', value)) {
    // do nothing
  } else if (is('function', value)) {
    plug(node, name, value(target.context))
  } else if (isAudioParam(target)) {
    target.value = value
  } else {
    node[name] = value
  }
}

export const buffer = (data) => (ac) => {
  var buffer = ac.createBuffer(1, data.length, ac.sampleRate)
  buffer.copyToChannel(data, 0)
  return buffer
}

export const memoize = (name, fn) => (ac) => {
  ac._cache = ac._cache || []
  ac._cache[name] = ac._cache[name] || fn(ac)
  return ac._cache[name]
}

export const voltage = memoize('voltage', buffer(Float32Array.from([1, 1])))

export const source = (props) => (ac) => {
  if (typeof props === 'function') props = { buffer: props }
  return create('BufferSource', props)
}

export const mult = (value, signal) => (ac) => {
  const g = ac.createGain()
  plug(g, 'gain', value)
  signal(ac).connect(g)
  return g
}

export const gain = (props) => create('Gain', toProps(props, 'gain'))
export const constant = (value) => mult(value, source({ buffer: voltage, loop: true }))

export const osc = (props) => create('Oscillator', props, 0)
export const sine = (props) => osc(set(toProps(props, 'frequency'), 'type', 'sine'))
export const sawtooth = (props) => osc(set('type', 'sawtooth', toProps(props, 'frequency'), 'type', 'sawtooth'))
export const square = (props) => osc(set('type', 'square', toProps(props, 'frequency'), 'type', 'sawtooth'))

export const filter = (props) => create('BiquadFilter', props)
export const lowpass = (props) => filter(set('type', 'lowpass', toProps(props, 'frequency')))
export const hipass = (props) => filter(set('type', 'highpass', toProps(props, 'frequency')))

export function adsr (attack = 0.01, decay = 0.1, sustain = 0.8, release = 0.1) {
}
