# LoLBindingGenericAsyncEventModel

Represents generic data for an asynchronous event.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**asyncToken** | **number** | Asynchronous operation token | [optional] [default to undefined]
**data** | **{ [key: string]: any | undefined; }** | Event data | [optional] [default to undefined]

## Example

```typescript
import { LoLBindingGenericAsyncEventModel } from '@private/leagoflegends-client';

const instance: LoLBindingGenericAsyncEventModel = {
    asyncToken,
    data,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
