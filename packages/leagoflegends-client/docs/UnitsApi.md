# UnitsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getLiveclientdataPlayerlist**](#getliveclientdataplayerlist) | **GET** /liveclientdata/playerlist | Retrieve the list of heroes in the game and their stats|

# **getLiveclientdataPlayerlist**
> { [key: string]: any | undefined; } getLiveclientdataPlayerlist()


### Example

```typescript
import {
    UnitsApi,
    Configuration
} from '@private/leagoflegends-client';

const configuration = new Configuration();
const apiInstance = new UnitsApi(configuration);

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

