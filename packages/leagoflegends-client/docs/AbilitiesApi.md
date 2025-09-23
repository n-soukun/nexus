# AbilitiesApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getLiveclientdataActiveplayerabilities**](#getliveclientdataactiveplayerabilities) | **GET** /liveclientdata/activeplayerabilities | Get Abilities for the active player|

# **getLiveclientdataActiveplayerabilities**
> { [key: string]: any | undefined; } getLiveclientdataActiveplayerabilities()


### Example

```typescript
import {
    AbilitiesApi,
    Configuration
} from '@private/leagoflegends-client';

const configuration = new Configuration();
const apiInstance = new AbilitiesApi(configuration);

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

