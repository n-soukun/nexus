# LoLBindingCallbackEventModel

Represents the parameters of a call to a provided callback.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** | ID of the callback being invoked | [optional] [default to undefined]
**parameters** | **Array&lt;{ [key: string]: any | undefined; }&gt;** | Callback parameters | [optional] [default to undefined]

## Example

```typescript
import { LoLBindingCallbackEventModel } from '@private/leagoflegends-client';

const instance: LoLBindingCallbackEventModel = {
    id,
    parameters,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
