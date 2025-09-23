## @private/leagoflegends-client@1.0.0

This generator creates TypeScript/JavaScript client that utilizes [axios](https://github.com/axios/axios). The generated Node module can be used in the following environments:

Environment
* Node.js
* Webpack
* Browserify

Language level
* ES5 - you must have a Promises/A+ library installed
* ES6

Module system
* CommonJS
* ES6 module system

It can be used in both TypeScript and JavaScript. In TypeScript, the definition will be automatically resolved via `package.json`. ([Reference](https://www.typescriptlang.org/docs/handbook/declaration-files/consumption.html))

### Building

To build and compile the typescript sources to javascript use:
```
npm install
npm run build
```

### Publishing

First build the package then run `npm publish`

### Consuming

navigate to the folder of your consuming project and run one of the following commands.

_published:_

```
npm install @private/leagoflegends-client@1.0.0 --save
```

_unPublished (not recommended):_

```
npm install PATH_TO_GENERATED_PACKAGE --save
```

### Documentation for API Endpoints

All URIs are relative to *http://localhost*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*AbilitiesApi* | [**getLiveclientdataActiveplayerabilities**](docs/AbilitiesApi.md#getliveclientdataactiveplayerabilities) | **GET** /liveclientdata/activeplayerabilities | Get Abilities for the active player
*ActivePlayerApi* | [**getLiveclientdataActiveplayer**](docs/ActivePlayerApi.md#getliveclientdataactiveplayer) | **GET** /liveclientdata/activeplayer | Get all data about the active player
*ActivePlayerApi* | [**getLiveclientdataActiveplayerabilities**](docs/ActivePlayerApi.md#getliveclientdataactiveplayerabilities) | **GET** /liveclientdata/activeplayerabilities | Get Abilities for the active player
*ActivePlayerApi* | [**getLiveclientdataActiveplayername**](docs/ActivePlayerApi.md#getliveclientdataactiveplayername) | **GET** /liveclientdata/activeplayername | Returns the player name
*ActivePlayerApi* | [**getLiveclientdataActiveplayerrunes**](docs/ActivePlayerApi.md#getliveclientdataactiveplayerrunes) | **GET** /liveclientdata/activeplayerrunes | Retrieve the full list of runes for the active player
*AllApi* | [**getLiveclientdataAllgamedata**](docs/AllApi.md#getliveclientdataallgamedata) | **GET** /liveclientdata/allgamedata | Get all available data
*AllPlayersApi* | [**getLiveclientdataPlayeritems**](docs/AllPlayersApi.md#getliveclientdataplayeritems) | **GET** /liveclientdata/playeritems | Retrieve the list of items for the player
*AllPlayersApi* | [**getLiveclientdataPlayerlist**](docs/AllPlayersApi.md#getliveclientdataplayerlist) | **GET** /liveclientdata/playerlist | Retrieve the list of heroes in the game and their stats
*AllPlayersApi* | [**getLiveclientdataPlayermainrunes**](docs/AllPlayersApi.md#getliveclientdataplayermainrunes) | **GET** /liveclientdata/playermainrunes | Retrieve the basic runes of any player
*AllPlayersApi* | [**getLiveclientdataPlayerscores**](docs/AllPlayersApi.md#getliveclientdataplayerscores) | **GET** /liveclientdata/playerscores | Retrieve the list of the current scores for the player
*AllPlayersApi* | [**getLiveclientdataPlayersummonerspells**](docs/AllPlayersApi.md#getliveclientdataplayersummonerspells) | **GET** /liveclientdata/playersummonerspells | Retrieve the list of the summoner spells for the player
*BuiltinApi* | [**asyncDelete**](docs/BuiltinApi.md#asyncdelete) | **POST** /AsyncDelete | Cancels the asynchronous operation or removes its completion status.
*BuiltinApi* | [**asyncResult**](docs/BuiltinApi.md#asyncresult) | **POST** /AsyncResult | Retrieves the result of a completed asynchronous operation.
*BuiltinApi* | [**asyncStatus**](docs/BuiltinApi.md#asyncstatus) | **POST** /AsyncStatus | Retrieves details on the current state of an asynchronous operation.
*BuiltinApi* | [**cancel**](docs/BuiltinApi.md#cancel) | **POST** /Cancel | Attempts to cancel an asynchronous operation
*BuiltinApi* | [**exit**](docs/BuiltinApi.md#exit) | **POST** /Exit | Closes the connection.
*BuiltinApi* | [**help**](docs/BuiltinApi.md#help) | **POST** /Help | Returns information on available functions and types
*BuiltinApi* | [**httpApiDeclarationV1**](docs/BuiltinApi.md#httpapideclarationv1) | **GET** /swagger/v1/api-docs/{api} | Retrieves the API declaration for a supported API
*BuiltinApi* | [**httpApiDocsV1**](docs/BuiltinApi.md#httpapidocsv1) | **GET** /swagger/v1/api-docs | Retrieves the API documentation resource listing
*BuiltinApi* | [**httpApiDocsV2**](docs/BuiltinApi.md#httpapidocsv2) | **GET** /swagger/v2/swagger.json | Retrieves the API documentation
*BuiltinApi* | [**httpApiDocsV3**](docs/BuiltinApi.md#httpapidocsv3) | **GET** /swagger/v3/openapi.json | Retrieves the API documentation
*BuiltinApi* | [**httpAsyncDelete**](docs/BuiltinApi.md#httpasyncdelete) | **DELETE** /async/v1/status/{asyncToken} | Cancels the asynchronous operation or removes its completion status.
*BuiltinApi* | [**httpAsyncResult**](docs/BuiltinApi.md#httpasyncresult) | **GET** /async/v1/result/{asyncToken} | Retrieves the result of a completed asynchronous operation.
*BuiltinApi* | [**httpAsyncStatus**](docs/BuiltinApi.md#httpasyncstatus) | **GET** /async/v1/status/{asyncToken} | Retrieves details on the current state of an asynchronous operation.
*BuiltinApi* | [**subscribe**](docs/BuiltinApi.md#subscribe) | **POST** /Subscribe | Subscribes to a given event
*BuiltinApi* | [**unsubscribe**](docs/BuiltinApi.md#unsubscribe) | **POST** /Unsubscribe | Unsubscribes from a given event
*ChampionsApi* | [**getLiveclientdataActiveplayer**](docs/ChampionsApi.md#getliveclientdataactiveplayer) | **GET** /liveclientdata/activeplayer | Get all data about the active player
*ChampionsApi* | [**getLiveclientdataActiveplayerabilities**](docs/ChampionsApi.md#getliveclientdataactiveplayerabilities) | **GET** /liveclientdata/activeplayerabilities | Get Abilities for the active player
*ChampionsApi* | [**getLiveclientdataEventdata**](docs/ChampionsApi.md#getliveclientdataeventdata) | **GET** /liveclientdata/eventdata | Get a list of events that have occurred in the game
*ChampionsApi* | [**getLiveclientdataPlayerlist**](docs/ChampionsApi.md#getliveclientdataplayerlist) | **GET** /liveclientdata/playerlist | Retrieve the list of heroes in the game and their stats
*EventsApi* | [**getLiveclientdataEventdata**](docs/EventsApi.md#getliveclientdataeventdata) | **GET** /liveclientdata/eventdata | Get a list of events that have occurred in the game
*GameApi* | [**getLiveclientdataGamestats**](docs/GameApi.md#getliveclientdatagamestats) | **GET** /liveclientdata/gamestats | Basic data about the game
*ItemsApi* | [**getLiveclientdataPlayeritems**](docs/ItemsApi.md#getliveclientdataplayeritems) | **GET** /liveclientdata/playeritems | Retrieve the list of items for the player
*RunesApi* | [**getLiveclientdataActiveplayerrunes**](docs/RunesApi.md#getliveclientdataactiveplayerrunes) | **GET** /liveclientdata/activeplayerrunes | Retrieve the full list of runes for the active player
*RunesApi* | [**getLiveclientdataPlayermainrunes**](docs/RunesApi.md#getliveclientdataplayermainrunes) | **GET** /liveclientdata/playermainrunes | Retrieve the basic runes of any player
*ScoresApi* | [**getLiveclientdataPlayerscores**](docs/ScoresApi.md#getliveclientdataplayerscores) | **GET** /liveclientdata/playerscores | Retrieve the list of the current scores for the player
*UnitsApi* | [**getLiveclientdataPlayerlist**](docs/UnitsApi.md#getliveclientdataplayerlist) | **GET** /liveclientdata/playerlist | Retrieve the list of heroes in the game and their stats


### Documentation For Models

 - [LoLAbilityResourceModel](docs/LoLAbilityResourceModel.md)
 - [LoLBindingAsyncCancelEventModel](docs/LoLBindingAsyncCancelEventModel.md)
 - [LoLBindingAsyncFailureEventModel](docs/LoLBindingAsyncFailureEventModel.md)
 - [LoLBindingAsyncStateModel](docs/LoLBindingAsyncStateModel.md)
 - [LoLBindingCallbackEventModel](docs/LoLBindingCallbackEventModel.md)
 - [LoLBindingFullApiHelpModel](docs/LoLBindingFullApiHelpModel.md)
 - [LoLBindingFullArgumentHelpModel](docs/LoLBindingFullArgumentHelpModel.md)
 - [LoLBindingFullEnumValueHelpModel](docs/LoLBindingFullEnumValueHelpModel.md)
 - [LoLBindingFullEventHelpModel](docs/LoLBindingFullEventHelpModel.md)
 - [LoLBindingFullFieldHelpModel](docs/LoLBindingFullFieldHelpModel.md)
 - [LoLBindingFullFunctionHelpModel](docs/LoLBindingFullFunctionHelpModel.md)
 - [LoLBindingFullTypeHelpModel](docs/LoLBindingFullTypeHelpModel.md)
 - [LoLBindingFullTypeIdentifierModel](docs/LoLBindingFullTypeIdentifierModel.md)
 - [LoLBindingGenericAsyncEventModel](docs/LoLBindingGenericAsyncEventModel.md)
 - [LoLBindingGenericEventModel](docs/LoLBindingGenericEventModel.md)
 - [LoLBindingHelpFormatModel](docs/LoLBindingHelpFormatModel.md)
 - [LoLColorModel](docs/LoLColorModel.md)
 - [LoLRemotingHelpFormatModel](docs/LoLRemotingHelpFormatModel.md)
 - [LoLRemotingPrivilegeModel](docs/LoLRemotingPrivilegeModel.md)
 - [LoLRemotingSerializedFormatModel](docs/LoLRemotingSerializedFormatModel.md)
 - [LoLTeamIDModel](docs/LoLTeamIDModel.md)
 - [LoLVector2fModel](docs/LoLVector2fModel.md)
 - [LoLVector3fModel](docs/LoLVector3fModel.md)
 - [LoLVector4fModel](docs/LoLVector4fModel.md)


<a id="documentation-for-authorization"></a>
## Documentation For Authorization

Endpoints do not require authorization.

