# tg-file-id
[![Publish on npm](https://github.com/smaznet/tg-file-id/actions/workflows/npm.yml/badge.svg)](https://github.com/smaznet/tg-file-id/actions/workflows/npm.yml)
[![npm version](https://badge.fury.io/js/tg-file-id.svg)](https://badge.fury.io/js/tg-file-id)


A simple nodejs module to decode file_id and file_uniq_id of telegram bots


example usage:

``` js
let f = require('tg-file-id');
let result = f.decodeFileId("AwACAgQAAxkBAAEE3SZgO-PbHlWtxRt5cPWvXlGRWHXM3AACuwgAAj0d4FF_jv-i_-7iQR4E")
```
result will be:
``` js
{
  version: 4,
  subVersion: 30,
  typeId: 3,
  dcId: 4,
  hasReference: true,
  hasWebLocation: false,
  fileType: 'voice',
  fileReference: '010004dd26603be3db1e55adc51b7970f5af5e51915875ccdc',
  id: 5899747659685562555n,
  access_hash: 4747619738920652415n
}
```


and for file_uniq_ids
```js
let f = require('tg-file-id')
let result = f.decodeUniqFileId('AgADuwgAAj0d4FE');
```
result will be:
```js
let result = { typeId: 2, type: 'document', id: 5899747659685562555n }
 ```

### Convert file_id to file_uniq_id
```js
let {FileId} = require("tg-file-id");
let uniqFileId = FileId.fromFileId('AwACAgQAAxkBAAEE3SZgO-PbHlWtxRt5cPWvXlGRWHXM3AACuwgAAj0d4FF_jv-i_-7iQR4E').toFileUniqId();

// outputs: AwADuwgAAj0d4FE
```

## TODO:
- [ ] add function to make file_id from result like input
- [ ] create class named FileId and UniqueFileId to set or get fields and functions like fromFileId or toFileId
- [ ] convert file_ids to file_uniq_id 
