# ActivePlayerApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getLiveclientdataActiveplayer**](#getliveclientdataactiveplayer) | **GET** /liveclientdata/activeplayer | Get all data about the active player|
|[**getLiveclientdataActiveplayerabilities**](#getliveclientdataactiveplayerabilities) | **GET** /liveclientdata/activeplayerabilities | Get Abilities for the active player|
|[**getLiveclientdataActiveplayername**](#getliveclientdataactiveplayername) | **GET** /liveclientdata/activeplayername | Returns the player name|
|[**getLiveclientdataActiveplayerrunes**](#getliveclientdataactiveplayerrunes) | **GET** /liveclientdata/activeplayerrunes | Retrieve the full list of runes for the active player|

# **getLiveclientdataActiveplayer**
> { [key: string]: any | undefined; } getLiveclientdataActiveplayer()


### Example

```typescript
import {
    ActivePlayerApi,
    Configuration
} from '@private/leagoflegends-client';

const configuration = new Configuration();
const apiInstance = new ActivePlayerApi(configuration);

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
    ActivePlayerApi,
    Configuration
} from '@private/leagoflegends-client';

const configuration = new Configuration();
const apiInstance = new ActivePlayerApi(configuration);

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

# **getLiveclientdataActiveplayername**
> string getLiveclientdataActiveplayername()


### Example

```typescript
import {
    ActivePlayerApi,
    Configuration
} from '@private/leagoflegends-client';

const configuration = new Configuration();
const apiInstance = new ActivePlayerApi(configuration);

const { status, data } = await apiInstance.getLiveclientdataActiveplayername();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**string**

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

# **getLiveclientdataActiveplayerrunes**
> { [key: string]: any | undefined; } getLiveclientdataActiveplayerrunes()


### Example

```typescript
import {
    ActivePlayerApi,
    Configuration
} from '@private/leagoflegends-client';

const configuration = new Configuration();
const apiInstance = new ActivePlayerApi(configuration);

const { status, data } = await apiInstance.getLiveclientdataActiveplayerrunes();
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

