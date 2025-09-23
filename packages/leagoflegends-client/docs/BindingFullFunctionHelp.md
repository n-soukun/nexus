# LoLBindingFullFunctionHelpModel

Describes a function.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**arguments** | [**Array&lt;LoLBindingFullArgumentHelpModel&gt;**](LoLBindingFullArgumentHelpModel.md) |  | [optional] [default to undefined]
**async** | **string** |  | [optional] [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**help** | **string** |  | [optional] [default to undefined]
**name** | **string** |  | [optional] [default to undefined]
**nameSpace** | **string** |  | [optional] [default to undefined]
**returns** | [**LoLBindingFullTypeIdentifierModel**](LoLBindingFullTypeIdentifierModel.md) |  | [optional] [default to undefined]
**tags** | **Array&lt;string&gt;** |  | [optional] [default to undefined]
**threadSafe** | **boolean** |  | [optional] [default to undefined]

## Example

```typescript
import { LoLBindingFullFunctionHelpModel } from '@private/leagoflegends-client';

const instance: LoLBindingFullFunctionHelpModel = {
    arguments,
    async,
    description,
    help,
    name,
    nameSpace,
    returns,
    tags,
    threadSafe,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
