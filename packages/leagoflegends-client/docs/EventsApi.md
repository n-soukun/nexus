# EventsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getLiveclientdataEventdata**](#getliveclientdataeventdata) | **GET** /liveclientdata/eventdata | Get a list of events that have occurred in the game|

# **getLiveclientdataEventdata**
> { [key: string]: any | undefined; } getLiveclientdataEventdata()


### Example

```typescript
import {
    EventsApi,
    Configuration
} from '@private/leagoflegends-client';

const configuration = new Configuration();
const apiInstance = new EventsApi(configuration);

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

