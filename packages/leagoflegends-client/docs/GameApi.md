# GameApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getLiveclientdataGamestats**](#getliveclientdatagamestats) | **GET** /liveclientdata/gamestats | Basic data about the game|

# **getLiveclientdataGamestats**
> { [key: string]: any | undefined; } getLiveclientdataGamestats()


### Example

```typescript
import {
    GameApi,
    Configuration
} from '@private/leagoflegends-client';

const configuration = new Configuration();
const apiInstance = new GameApi(configuration);

const { status, data } = await apiInstance.getLiveclientdataGamestats();
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

