### to be released in the future in npmjs
[![Node Package](https://github.com/erffy/erfdb/actions/workflows/npm.yml/badge.svg)](https://github.com/erffy/erfdb/actions/workflows/npm.yml)
[![CodeQL](https://github.com/erffy/erfdb/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/erffy/erfdb/actions/workflows/github-code-scanning/codeql)
## erf.db
- A Map-based Smartest and Fastest database module

### Features
- 🍃 Performance: Written in TypeScript for optimal speed and performance.
- 🛠️ Ease of Use: Provides a straightforward API for managing the database.
- 🔒 Security: Implements best practices to secure data storage and access.
- 🖥️ Versatile Driver Support: Supports up to 4 drivers, providing flexibility for different storage and retrieval needs.
- ♻️ Modern: Fully compatible with both ESM (ECMAScript Modules) and CJS (CommonJS), ensuring seamless integration with modern JavaScript environments.

### Installation
```sh
npm install erf.db
pnpm add erf.db
yarn add erf.db
bun add erf.db
```

### Usage
- Note: MemoryDriver is default.
```js
// TypeScript / ESM
import Database/*, { JsonDriver, BsonDriver, YamlDriver }*/ from 'erf.db';
// or
import { Database/*, JsonDriver, BsonDriver, YamlDriver */} from 'erf.db';
//

// CJS
const Database = require('erf.db');
// or
const { Database, JsonDriver, BsonDriver, YamlDriver } = require('erf.db');
//

const db = new Database();
/*
const db2 = new Database();

for (let i = 0; i < 200; i++) db.set(`key-${i}`, i);
for (let i = 0; i < 50; i++) db2.set(`key-${i}`, i);
*/

db.all(); // db.all(5);
db.array();
db.at('k:0'); // db.at('v:0');
db.clone();
db.concat(db2);
db.del('key-25');
db.each((e) => typeof e);
db.every((e) => e === 28);
db.filter((e) => typeof e === 'number');
db.find((e) => e === 2)?.key;
db.get('key-5');
db.has('key-1');
db.intersection(db2);
db.json();
db.keyOf(24);
db.map((e) => e === 24);
db.math('key-29', '-', 2);
db.merge(db2);
db.partition((c) => c === 24);
db.pick('key-5', 'key-6');
db.pluck('key-29');
db.reduce((e) => e * 3, 2);
db.set('d', 0);
db.size;
db.slice(5, 5);
db.some((e) => e === 24);
db.sweep((e) => e);
```

<br>

[![Alt](https://repobeats.axiom.co/api/embed/7fd6fff744f52025aa6b5218d6c6e8f638c13aa4.svg)](https://github.com/erffy/erfdb)
