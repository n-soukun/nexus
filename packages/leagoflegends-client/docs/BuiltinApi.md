# BuiltinApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**asyncDelete**](#asyncdelete) | **POST** /AsyncDelete | Cancels the asynchronous operation or removes its completion status.|
|[**asyncResult**](#asyncresult) | **POST** /AsyncResult | Retrieves the result of a completed asynchronous operation.|
|[**asyncStatus**](#asyncstatus) | **POST** /AsyncStatus | Retrieves details on the current state of an asynchronous operation.|
|[**cancel**](#cancel) | **POST** /Cancel | Attempts to cancel an asynchronous operation|
|[**exit**](#exit) | **POST** /Exit | Closes the connection.|
|[**help**](#help) | **POST** /Help | Returns information on available functions and types|
|[**httpApiDeclarationV1**](#httpapideclarationv1) | **GET** /swagger/v1/api-docs/{api} | Retrieves the API declaration for a supported API|
|[**httpApiDocsV1**](#httpapidocsv1) | **GET** /swagger/v1/api-docs | Retrieves the API documentation resource listing|
|[**httpApiDocsV2**](#httpapidocsv2) | **GET** /swagger/v2/swagger.json | Retrieves the API documentation|
|[**httpApiDocsV3**](#httpapidocsv3) | **GET** /swagger/v3/openapi.json | Retrieves the API documentation|
|[**httpAsyncDelete**](#httpasyncdelete) | **DELETE** /async/v1/status/{asyncToken} | Cancels the asynchronous operation or removes its completion status.|
|[**httpAsyncResult**](#httpasyncresult) | **GET** /async/v1/result/{asyncToken} | Retrieves the result of a completed asynchronous operation.|
|[**httpAsyncStatus**](#httpasyncstatus) | **GET** /async/v1/status/{asyncToken} | Retrieves details on the current state of an asynchronous operation.|
|[**subscribe**](#subscribe) | **POST** /Subscribe | Subscribes to a given event|
|[**unsubscribe**](#unsubscribe) | **POST** /Unsubscribe | Unsubscribes from a given event|

# **asyncDelete**
> { [key: string]: any | undefined; } asyncDelete(UNKNOWN_PARAMETER_NAME)


### Example

```typescript
import {
    BuiltinApi,
    Configuration
} from '@private/leagoflegends-client';

const configuration = new Configuration();
const apiInstance = new BuiltinApi(configuration);

let UNKNOWN_PARAMETER_NAME: ; //ID of the asynchronous operation to remove

const { status, data } = await apiInstance.asyncDelete(
    UNKNOWN_PARAMETER_NAME
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **UNKNOWN_PARAMETER_NAME** | ****| ID of the asynchronous operation to remove | |


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

# **asyncResult**
> { [key: string]: any | undefined; } asyncResult(UNKNOWN_PARAMETER_NAME)


### Example

```typescript
import {
    BuiltinApi,
    Configuration
} from '@private/leagoflegends-client';

const configuration = new Configuration();
const apiInstance = new BuiltinApi(configuration);

let UNKNOWN_PARAMETER_NAME: ; //ID of the asynchronous operation to check

const { status, data } = await apiInstance.asyncResult(
    UNKNOWN_PARAMETER_NAME
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **UNKNOWN_PARAMETER_NAME** | ****| ID of the asynchronous operation to check | |


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

# **asyncStatus**
> { [key: string]: any | undefined; } asyncStatus(UNKNOWN_PARAMETER_NAME)


### Example

```typescript
import {
    BuiltinApi,
    Configuration
} from '@private/leagoflegends-client';

const configuration = new Configuration();
const apiInstance = new BuiltinApi(configuration);

let UNKNOWN_PARAMETER_NAME: ; //ID of the asynchronous operation to check

const { status, data } = await apiInstance.asyncStatus(
    UNKNOWN_PARAMETER_NAME
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **UNKNOWN_PARAMETER_NAME** | ****| ID of the asynchronous operation to check | |


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

# **cancel**
> { [key: string]: any | undefined; } cancel(UNKNOWN_PARAMETER_NAME)


### Example

```typescript
import {
    BuiltinApi,
    Configuration
} from '@private/leagoflegends-client';

const configuration = new Configuration();
const apiInstance = new BuiltinApi(configuration);

let UNKNOWN_PARAMETER_NAME: ; //Operation to cancel

const { status, data } = await apiInstance.cancel(
    UNKNOWN_PARAMETER_NAME
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **UNKNOWN_PARAMETER_NAME** | ****| Operation to cancel | |


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

# **exit**
> { [key: string]: any | undefined; } exit()


### Example

```typescript
import {
    BuiltinApi,
    Configuration
} from '@private/leagoflegends-client';

const configuration = new Configuration();
const apiInstance = new BuiltinApi(configuration);

const { status, data } = await apiInstance.exit();
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

# **help**
> { [key: string]: any | undefined; } help()

With no arguments, returns a list of all available functions and types along with a short description. If a function or type is specified, returns detailed information about it.

### Example

```typescript
import {
    BuiltinApi,
    Configuration
} from '@private/leagoflegends-client';

const configuration = new Configuration();
const apiInstance = new BuiltinApi(configuration);

let UNKNOWN_PARAMETER_NAME: ; //Name of the function or type to describe (optional)
let UNKNOWN_PARAMETER_NAME2: ; //Format for returned information (optional)

const { status, data } = await apiInstance.help(
    UNKNOWN_PARAMETER_NAME,
    UNKNOWN_PARAMETER_NAME2
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **UNKNOWN_PARAMETER_NAME** | ****| Name of the function or type to describe | |
| **UNKNOWN_PARAMETER_NAME2** | ****| Format for returned information | |


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

# **httpApiDeclarationV1**
> { [key: string]: any | undefined; } httpApiDeclarationV1(UNKNOWN_PARAMETER_NAME)


### Example

```typescript
import {
    BuiltinApi,
    Configuration
} from '@private/leagoflegends-client';

const configuration = new Configuration();
const apiInstance = new BuiltinApi(configuration);

let UNKNOWN_PARAMETER_NAME: ; //API to get a declaration for

const { status, data } = await apiInstance.httpApiDeclarationV1(
    UNKNOWN_PARAMETER_NAME
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **UNKNOWN_PARAMETER_NAME** | ****| API to get a declaration for | |


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

# **httpApiDocsV1**
> { [key: string]: any | undefined; } httpApiDocsV1()


### Example

```typescript
import {
    BuiltinApi,
    Configuration
} from '@private/leagoflegends-client';

const configuration = new Configuration();
const apiInstance = new BuiltinApi(configuration);

const { status, data } = await apiInstance.httpApiDocsV1();
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

# **httpApiDocsV2**
> { [key: string]: any | undefined; } httpApiDocsV2()


### Example

```typescript
import {
    BuiltinApi,
    Configuration
} from '@private/leagoflegends-client';

const configuration = new Configuration();
const apiInstance = new BuiltinApi(configuration);

const { status, data } = await apiInstance.httpApiDocsV2();
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

# **httpApiDocsV3**
> { [key: string]: any | undefined; } httpApiDocsV3()


### Example

```typescript
import {
    BuiltinApi,
    Configuration
} from '@private/leagoflegends-client';

const configuration = new Configuration();
const apiInstance = new BuiltinApi(configuration);

const { status, data } = await apiInstance.httpApiDocsV3();
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

# **httpAsyncDelete**
> { [key: string]: any | undefined; } httpAsyncDelete(UNKNOWN_PARAMETER_NAME)


### Example

```typescript
import {
    BuiltinApi,
    Configuration
} from '@private/leagoflegends-client';

const configuration = new Configuration();
const apiInstance = new BuiltinApi(configuration);

let UNKNOWN_PARAMETER_NAME: ; //ID of the asynchronous operation to remove

const { status, data } = await apiInstance.httpAsyncDelete(
    UNKNOWN_PARAMETER_NAME
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **UNKNOWN_PARAMETER_NAME** | ****| ID of the asynchronous operation to remove | |


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

# **httpAsyncResult**
> { [key: string]: any | undefined; } httpAsyncResult(UNKNOWN_PARAMETER_NAME)


### Example

```typescript
import {
    BuiltinApi,
    Configuration
} from '@private/leagoflegends-client';

const configuration = new Configuration();
const apiInstance = new BuiltinApi(configuration);

let UNKNOWN_PARAMETER_NAME: ; //ID of the asynchronous operation to check

const { status, data } = await apiInstance.httpAsyncResult(
    UNKNOWN_PARAMETER_NAME
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **UNKNOWN_PARAMETER_NAME** | ****| ID of the asynchronous operation to check | |


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

# **httpAsyncStatus**
> { [key: string]: any | undefined; } httpAsyncStatus(UNKNOWN_PARAMETER_NAME)


### Example

```typescript
import {
    BuiltinApi,
    Configuration
} from '@private/leagoflegends-client';

const configuration = new Configuration();
const apiInstance = new BuiltinApi(configuration);

let UNKNOWN_PARAMETER_NAME: ; //ID of the asynchronous operation to check

const { status, data } = await apiInstance.httpAsyncStatus(
    UNKNOWN_PARAMETER_NAME
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **UNKNOWN_PARAMETER_NAME** | ****| ID of the asynchronous operation to check | |


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

# **subscribe**
> { [key: string]: any | undefined; } subscribe(UNKNOWN_PARAMETER_NAME)


### Example

```typescript
import {
    BuiltinApi,
    Configuration
} from '@private/leagoflegends-client';

const configuration = new Configuration();
const apiInstance = new BuiltinApi(configuration);

let UNKNOWN_PARAMETER_NAME: ; //Name of the event to subscribe to
let UNKNOWN_PARAMETER_NAME2: ; //Desired format to receive events in. If unspecified, events will be sent in the active result format at the time. (optional)

const { status, data } = await apiInstance.subscribe(
    UNKNOWN_PARAMETER_NAME,
    UNKNOWN_PARAMETER_NAME2
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **UNKNOWN_PARAMETER_NAME** | ****| Name of the event to subscribe to | |
| **UNKNOWN_PARAMETER_NAME2** | ****| Desired format to receive events in. If unspecified, events will be sent in the active result format at the time. | |


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

# **unsubscribe**
> { [key: string]: any | undefined; } unsubscribe(UNKNOWN_PARAMETER_NAME)


### Example

```typescript
import {
    BuiltinApi,
    Configuration
} from '@private/leagoflegends-client';

const configuration = new Configuration();
const apiInstance = new BuiltinApi(configuration);

let UNKNOWN_PARAMETER_NAME: ; //Name of the event to unsubscribe from

const { status, data } = await apiInstance.unsubscribe(
    UNKNOWN_PARAMETER_NAME
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **UNKNOWN_PARAMETER_NAME** | ****| Name of the event to unsubscribe from | |


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

