# ItemsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getLiveclientdataPlayeritems**](#getliveclientdataplayeritems) | **GET** /liveclientdata/playeritems | Retrieve the list of items for the player|

# **getLiveclientdataPlayeritems**
> { [key: string]: any | undefined; } getLiveclientdataPlayeritems(UNKNOWN_PARAMETER_NAME)


### Example

```typescript
import {
    ItemsApi,
    Configuration
} from '@private/leagoflegends-client';

const configuration = new Configuration();
const apiInstance = new ItemsApi(configuration);

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

