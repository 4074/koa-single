# koa-single

A single page application middleware for koa app.

**Install**

```sh
# yarn
yarn add koa koa-static koa-single

# npm
npm install koa koa-static koa-single
```

**Usage**

```typescript
import Koa from 'koa'
import single from 'koa-single'

const app = new Koa()
app.use(single({ dir: 'your-react-app-build-dir' }))

app.listen(3000)
```
