# ChampionsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getLiveclientdataActiveplayer**](#getliveclientdataactiveplayer) | **GET** /liveclientdata/activeplayer | Get all data about the active player|
|[**getLiveclientdataActiveplayerabilities**](#getliveclientdataactiveplayerabilities) | **GET** /liveclientdata/activeplayerabilities | Get Abilities for the active player|
|[**getLiveclientdataEventdata**](#getliveclientdataeventdata) | **GET** /liveclientdata/eventdata | Get a list of events that have occurred in the game|
|[**getLiveclientdataPlayerlist**](#getliveclientdataplayerlist) | **GET** /liveclientdata/playerlist | Retrieve the list of heroes in the game and their stats|

# **getLiveclientdataActiveplayer**
> { [key: string]: any | undefined; } getLiveclientdataActiveplayer()


### Example

```typescript
import {
    ChampionsApi,
    Configuration
} from '@private/leagoflegends-client';

const configuration = new Configuration();
const apiInstance = new ChampionsApi(configuration);

const { status, data } = await apiInstance.getLiveclientdataActiveplayer();
```

### Parameters
This endpoint does not have any parameters.


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

# **getLiveclientdataActiveplayerabilities**
> { [key: string]: any | undefined; } getLiveclientdataActiveplayerabilities()


### Example

```typescript
import {
    ChampionsApi,
    Configuration
} from '@private/leagoflegends-client';

const configuration = new Configuration();
const apiInstance = new ChampionsApi(configuration);

const { status, data } = await apiInstance.getLiveclientdataActiveplayerabilities();
```

### Parameters
This endpoint does not have any parameters.


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

# **getLiveclientdataEventdata**
> { [key: string]: any | undefined; } getLiveclientdataEventdata()


### Example

```typescript
import {
    ChampionsApi,
    Configuration
} from '@private/leagoflegends-client';

const configuration = new Configuration();
const apiInstance = new ChampionsApi(configuration);

let UNKNOWN_PARAMETER_NAME: ; //ID of the next event you expect to see (optional)

const { status, data } = await apiInstance.getLiveclientdataEventdata(
    UNKNOWN_PARAMETER_NAME
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **UNKNOWN_PARAMETER_NAME** | ****| ID of the next event you expect to see | |


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
    ChampionsApi,
    Configuration
} from '@private/leagoflegends-client';

const configuration = new Configuration();
const apiInstance = new ChampionsApi(configuration);

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

