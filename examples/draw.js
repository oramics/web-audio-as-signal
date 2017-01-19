/* global OfflineAudioContext */
const ac = require('audio-context')
const h = require('h')
const { constant, sine, sawtooth, lowpass } = require('..')
const draw = require('draw-waveform')

const ms = (time) => ac.sampleRate * time / 1000
const add = (el) => { document.body.appendChild(el); return el }
const canvas = ({ width = 600, height = 100 } = {}) => h('canvas', { width, height })
const print = (text) => add(h('h4', h('code', text)))

const render = (text, node, length = 600) => {
  var ctx = new OfflineAudioContext(1, length, ac.sampleRate)
  node(ctx).connect(ctx.destination)
  return ctx.startRendering().then((buffer) => {
    print(text)
    draw(add(canvas()), buffer.getChannelData(0))
    return buffer
  })
}

add(h('h1', 'Web audio as signal'))
render('constant(2)', constant(2))
render('sine(10)', sine(10), ms(500))
render('sine(10)', sawtooth(10), ms(500))
render('lowpass(9, sawtooth(10))', lowpass(9, sawtooth(10)), ms(500))
