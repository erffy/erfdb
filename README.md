[![CodeQL](https://github.com/erffy/erfdb/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/erffy/erfdb/actions/workflows/github-code-scanning/codeql)
## erfdb
- A Map-based Smartest and Fastest database module

### Features
- 🍃 Performance: Written in TypeScript for optimal speed and performance.
- 🛠️ Ease of Use: Provides a basic functionality for managing the database.
- 🔒 Security: Implements best practices to secure data storage and access.
- 🖥️ Versatile Driver Support: Supports up to 4 drivers, providing flexibility for different storage and retrieval needs.
- ♻️ Modern: Fully compatible with both ESM (ECMAScript Modules) and CJS (CommonJS), ensuring seamless integration with modern JavaScript environments.

### Installation
Note: Before installation, you need to install 'typescript' globally with the package manager you use.
```sh
npm install erffy/erfdb
pnpm add erffy/erfdb
yarn add erffy/erfdb
bun add erffy/erfdb
```

### Usage
- Note: MemoryDriver is default.
```js
// TypeScript / ESM
import Database/*, { JsonDriver, BsonDriver, YamlDriver }*/ from 'erfdb';
// or
import { Database/*, JsonDriver, BsonDriver, YamlDriver */} from 'erfdb';
//

// CJS
const Database = require('erfdb').default;
// or
const { Database, JsonDriver, BsonDriver, YamlDriver } = require('erfdb');
//

const db = new Database();
// with driver specified
const db = new Database({ driver: new JsonDriver() });
/*
const db2 = new Database();

for (let i = 0; i < 200; i++) db.set(`key-${i}`, i);
for (let i = 0; i < 50; i++) db2.set(`key-${i}`, i);
*/

db.all(); // db.all(5);
db.toArray();
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
db.toJSON();
db.toSet();
db.indexOf('key-5'); // 6
db.last();
db.first();
db.typeOf('key-2'); // number
db.keyOf(24);
db.push('data', { id: 1 });
db.pull('data', { id: 1 });
db.map((e) => e === 24);
db.math('key-29', '-', 2);
db.merge(db2);
db.partition((c) => c === 24);
db.pick('key-5', 'key-6');
db.reduce((e) => e * 3, 2);
db.set('d', '0');
db.sizeOf('d'); // 1
db.size;
db.slice(5, 5);
db.some((e) => e === 24);
db.sweep((e) => e);
```

<br>

[![Alt](https://repobeats.axiom.co/api/embed/7fd6fff744f52025aa6b5218d6c6e8f638c13aa4.svg)](https://github.com/erffy/erfdb)
