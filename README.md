#Rutor API for Node.js
A simple Node module for fetching data from the Rutor sites in json format.

##Installation
```sh
npm install rutor-api
```

##Usage
Get from a category.

```js
var rutor = require("rutor-api");
rutor.search({
  category: 1,
  searchMethod: 1,
  order: 1,
  page: 1,
  query: "therm"
},function(err,data){
  if ( err ) {
    throw err;
  }

  console.log(data);

});
```