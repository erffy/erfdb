[![CodeQL](https://github.com/erffy/erfdb/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/erffy/erfdb/actions/workflows/github-code-scanning/codeql)
[![Release](https://github.com/erffy/erfdb/actions/workflows/release.yml/badge.svg)](https://github.com/erffy/erfdb/actions/workflows/release.yml)

## erfdb
A high-performance, type-safe database module built on Map

### Features
- 🚀 **High Performance** - Built with TypeScript and optimized for speed
- 🛡️ **Type Safety** - Full TypeScript support with comprehensive type definitions
- 🔌 **Multiple Drivers** - Support for JSON, YAML, BSON and in-memory storage
- 🔄 **Modern JavaScript** - Compatible with both ESM and CommonJS
- 🛠️ **Rich API** - Extensive set of utility methods for data manipulation
- 🔒 **Data Security** - Implements best practices for secure data handling

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

// Get all entries (optionally limit to first 5)
db.all(); // Returns all entries
db.all(5); // Returns first 5 entries

// Convert to different formats
db.toArray(); // Convert to array of {key, value} objects
db.toJSON(); // Convert to plain object
db.toSet(); // Convert to Set of {key, value} objects

// Access and check entries
db.at('key:test'); // Get entry by key path
db.at('value:123'); // Get entry by value
db.get('users.john'); // Get value by key
db.getMany(['users.john', 'users.jane']); // Get multiple values
db.has('key-1'); // Check if key exists
db.typeOf('users.age'); // Get type of value
db.sizeOf('users'); // Get size of value
db.size; // Get total number of entries

// Find entries
db.find(user => user.age > 18); // Find first matching entry
db.keyOf('john'); // Get key for value
db.indexOf('key-5'); // Get index of key

// Navigate entries
db.first(); // Get first entry
db.last(); // Get last entry
db.slice(5, 10); // Get entries from index 5 to 10

// Modify entries
db.set('users.john', {name: 'John'}); // Set value
db.setMany([['user1', data1], ['user2', data2]]); // Set multiple entries
db.del('users.jane'); // Delete entry
db.delMany(['user1', 'user2']); // Delete multiple entries
db.push('users.john.roles', 'admin'); // Add to array
db.pull('users.john.roles', 'admin'); // Remove from array
db.math('score', '+', 10); // Perform math operation

// Iterate and transform
db.each((value, key) => console.log(key, value)); // Iterate entries
db.map(value => value * 2); // Transform values
db.filter(user => user.age >= 18); // Filter entries
db.reduce((sum, value) => sum + value, 0); // Reduce to single value
db.partition(user => user.age >= 18); // Split into two arrays
db.sweep(value => value === null); // Remove entries matching condition

// Combine databases
db.clone(); // Create copy
db.concat(otherDb); // Combine databases
db.merge(otherDb); // Merge databases
db.intersection(otherDb); // Get common entries

// Check conditions
db.every(num => num > 0); // Test if all match
db.some(num => num > 100); // Test if any match

// Select entries
db.pick('user.name', 'user.email'); // Get specific entries

// Clear database
db.clear(); // Remove all entries
```

<br>

[![Alt](https://repobeats.axiom.co/api/embed/7fd6fff744f52025aa6b5218d6c6e8f638c13aa4.svg)](https://github.com/erffy/erfdb)
