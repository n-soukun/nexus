# AllPlayersApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getLiveclientdataPlayeritems**](#getliveclientdataplayeritems) | **GET** /liveclientdata/playeritems | Retrieve the list of items for the player|
|[**getLiveclientdataPlayerlist**](#getliveclientdataplayerlist) | **GET** /liveclientdata/playerlist | Retrieve the list of heroes in the game and their stats|
|[**getLiveclientdataPlayermainrunes**](#getliveclientdataplayermainrunes) | **GET** /liveclientdata/playermainrunes | Retrieve the basic runes of any player|
|[**getLiveclientdataPlayerscores**](#getliveclientdataplayerscores) | **GET** /liveclientdata/playerscores | Retrieve the list of the current scores for the player|
|[**getLiveclientdataPlayersummonerspells**](#getliveclientdataplayersummonerspells) | **GET** /liveclientdata/playersummonerspells | Retrieve the list of the summoner spells for the player|

# **getLiveclientdataPlayeritems**
> { [key: string]: any | undefined; } getLiveclientdataPlayeritems(UNKNOWN_PARAMETER_NAME)


### Example

```typescript
import {
    AllPlayersApi,
    Configuration
} from '@private/leagoflegends-client';

const configuration = new Configuration();
const apiInstance = new AllPlayersApi(configuration);

let UNKNOWN_PARAMETER_NAME: ; //RiotID GameName (with tag) of the player in the format Name#TAG

const { status, data } = await apiInstance.getLiveclientdataPlayeritems(
    UNKNOWN_PARAMETER_NAME
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **UNKNOWN_PARAMETER_NAME** | ****| RiotID GameName (with tag) of the player in the format Name#TAG | |


### Return type

**{ [key: string]: any | undefined; }**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getLiveclientdataPlayerlist**
> { [key: string]: any | undefined; } getLiveclientdataPlayerlist()


### Example

```typescript
import {
    AllPlayersApi,
    Configuration
} from '@private/leagoflegends-client';

const configuration = new Configuration();
const apiInstance = new AllPlayersApi(configuration);

let UNKNOWN_PARAMETER_NAME: ; //Heroes team ID. Optional, returns all players on all teams if null.  (optional)

const { status, data } = await apiInstance.getLiveclientdataPlayerlist(
    UNKNOWN_PARAMETER_NAME
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **UNKNOWN_PARAMETER_NAME** | ****| Heroes team ID. Optional, returns all players on all teams if null.  | |


### Return type

**{ [key: string]: any | undefined; }**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getLiveclientdataPlayermainrunes**
> { [key: string]: any | undefined; } getLiveclientdataPlayermainrunes(UNKNOWN_PARAMETER_NAME)


### Example

```typescript
import {
    AllPlayersApi,
    Configuration
} from '@private/leagoflegends-client';

const configuration = new Configuration();
const apiInstance = new AllPlayersApi(configuration);

let UNKNOWN_PARAMETER_NAME: ; //RiotID GameName (with tag) of the player in the format Name#TAG

const { status, data } = await apiInstance.getLiveclientdataPlayermainrunes(
    UNKNOWN_PARAMETER_NAME
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **UNKNOWN_PARAMETER_NAME** | ****| RiotID GameName (with tag) of the player in the format Name#TAG | |


### Return type

**{ [key: string]: any | undefined; }**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getLiveclientdataPlayerscores**
> { [key: string]: any | undefined; } getLiveclientdataPlayerscores(UNKNOWN_PARAMETER_NAME)


### Example

```typescript
import {
    AllPlayersApi,
    Configuration
} from '@private/leagoflegends-client';

const configuration = new Configuration();
const apiInstance = new AllPlayersApi(configuration);

let UNKNOWN_PARAMETER_NAME: ; //RiotID GameName (with tag) of the player in the format Name#TAG

const { status, data } = await apiInstance.getLiveclientdataPlayerscores(
    UNKNOWN_PARAMETER_NAME
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **UNKNOWN_PARAMETER_NAME** | ****| RiotID GameName (with tag) of the player in the format Name#TAG | |


### Return type

**{ [key: string]: any | undefined; }**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getLiveclientdataPlayersummonerspells**
> { [key: string]: any | undefined; } getLiveclientdataPlayersummonerspells(UNKNOWN_PARAMETER_NAME)


### Example

```typescript
import {
    AllPlayersApi,
    Configuration
} from '@private/leagoflegends-client';

const configuration = new Configuration();
const apiInstance = new AllPlayersApi(configuration);

let UNKNOWN_PARAMETER_NAME: ; //RiotID GameName (with tag) of the player in the format Name#TAG

const { status, data } = await apiInstance.getLiveclientdataPlayersummonerspells(
    UNKNOWN_PARAMETER_NAME
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **UNKNOWN_PARAMETER_NAME** | ****| RiotID GameName (with tag) of the player in the format Name#TAG | |


### Return type

**{ [key: string]: any | undefined; }**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

