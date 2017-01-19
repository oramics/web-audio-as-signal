'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const is = (t, o) => typeof o === t;
const isNot = (t, o) => typeof o !== t;
const isAudioParam = (p) => p && typeof p.setValueAtTime === 'function';
const set = (key, value, obj) => { obj[key] = value; return obj };
const toProps = (props, defKey) => is('object', props) ? props : set(defKey, props, {});

const create = (name, state, startAt) => (ac) => {
  const node = ac['create' + name]();
  Object.keys(state).forEach((k) => plug(node, k, state[k]));
  if (isNot('undefined')) node.start(startAt);
  return node
};

const plug = (node, name, value) => {
  const target = node[name];
  if (is('undefined', value)) {
    // do nothing
  } else if (is('function', value)) {
    plug(node, name, value(target.context));
  } else if (isAudioParam(target)) {
    target.value = value;
  } else {
    node[name] = value;
  }
};

const buffer = (data) => (ac) => {
  var buffer = ac.createBuffer(1, data.length, ac.sampleRate);
  buffer.copyToChannel(data, 0);
  return buffer
};

const memoize = (name, fn) => (ac) => {
  ac._cache = ac._cache || [];
  ac._cache[name] = ac._cache[name] || fn(ac);
  return ac._cache[name]
};

const voltage = memoize('voltage', buffer(Float32Array.from([1, 1])));

const source = (props) => (ac) => {
  if (typeof props === 'function') props = { buffer: props };
  return create('BufferSource', props)
};

const mult = (value, signal) => (ac) => {
  const g = ac.createGain();
  plug(g, 'gain', value);
  signal(ac).connect(g);
  return g
};

const gain = (props) => create('Gain', toProps(props, 'gain'));
const constant = (value) => mult(value, source({ buffer: voltage, loop: true }));

const osc = (props) => create('Oscillator', props, 0);
const sine = (props) => osc(set(toProps(props, 'frequency'), 'type', 'sine'));
const sawtooth = (props) => osc(set('type', 'sawtooth', toProps(props, 'frequency'), 'type', 'sawtooth'));
const square = (props) => osc(set('type', 'square', toProps(props, 'frequency'), 'type', 'sawtooth'));

const filter = (props) => create('BiquadFilter', props);
const lowpass = (props) => filter(set('type', 'lowpass', toProps(props, 'frequency')));
const hipass = (props) => filter(set('type', 'highpass', toProps(props, 'frequency')));

function adsr (attack = 0.01, decay = 0.1, sustain = 0.8, release = 0.1) {
}

exports.set = set;
exports.toProps = toProps;
exports.buffer = buffer;
exports.memoize = memoize;
exports.voltage = voltage;
exports.source = source;
exports.mult = mult;
exports.gain = gain;
exports.constant = constant;
exports.osc = osc;
exports.sine = sine;
exports.sawtooth = sawtooth;
exports.square = square;
exports.filter = filter;
exports.lowpass = lowpass;
exports.hipass = hipass;
exports.adsr = adsr;
