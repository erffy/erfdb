// database
import Database from './database/Database';

// drivers
import BsonDriver from './drivers/BsonDriver';
import MemoryDriver from './drivers/MemoryDriver';
import JsonDriver from './drivers/JsonDriver';
import YamlDriver from './drivers/YamlDriver';

// utils
import Validator from './utils/Validator';
import Lodash from './utils/Lodash';

export {
  Database,

  BsonDriver, MemoryDriver, JsonDriver, YamlDriver,

  Validator, Lodash
}

export default Database;

/*
const db = new Database();
const db2 = new Database();

for (let i = 0; i < 200; i++) db.set(`key-${i}`, i);
for (let i = 0; i < 50; i++) db2.set(`key-${i}`, i);

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

db.set('ts.b', 'test');
console.log(db.keyOf('test'))
*/