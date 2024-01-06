# react-svg-mouse-follower

A morphing SVG circle that follows your mouse

[![NPM](https://img.shields.io/npm/v/react-svg-mouse-follower.svg)](https://www.npmjs.com/package/react-svg-mouse-follower) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install react-svg-mouse-follower
```

## Usage

```jsx
import * as React from 'react'
import MouseFollower from 'react-svg-mouse-follower'

const Component = () => {
    return (
        <MouseFollower/>
        ...
    )
}
```

| Argument    | Type        | Default  | Description                                            |
| ----------- | ------------| -------- | ------------------------------------------------------ |
| disable     | boolean     | false    | Whether or not the scroll effect will be enabled       |
| trailLength | number      |   40     | How much the circle would extends                      |
| radius      | number      |   60     | The radius of the circle                               |



## License

[MIT](LICENSE)
