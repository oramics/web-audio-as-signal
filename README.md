# web-audio-as-signal

Experimenting with a better web audio api:

```js
import { sawtooth, filter, scale, sine, adsr } from 'web-audio-as-signal'

const synth = connect(
  sawtooth({ frequency: scale(sine(10), { min: 220, max: 880 }) }),
  lowpass(600),
  adsr({ release: 1.3 })
)
node.start({ duration: 1 })
```
