# RunesApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getLiveclientdataActiveplayerrunes**](#getliveclientdataactiveplayerrunes) | **GET** /liveclientdata/activeplayerrunes | Retrieve the full list of runes for the active player|
|[**getLiveclientdataPlayermainrunes**](#getliveclientdataplayermainrunes) | **GET** /liveclientdata/playermainrunes | Retrieve the basic runes of any player|

# **getLiveclientdataActiveplayerrunes**
> { [key: string]: any | undefined; } getLiveclientdataActiveplayerrunes()


### Example

```typescript
import {
    RunesApi,
    Configuration
} from '@private/leagoflegends-client';

const configuration = new Configuration();
const apiInstance = new RunesApi(configuration);

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

# **getLiveclientdataPlayermainrunes**
> { [key: string]: any | undefined; } getLiveclientdataPlayermainrunes(UNKNOWN_PARAMETER_NAME)


### Example

```typescript
import {
    RunesApi,
    Configuration
} from '@private/leagoflegends-client';

const configuration = new Configuration();
const apiInstance = new RunesApi(configuration);

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

