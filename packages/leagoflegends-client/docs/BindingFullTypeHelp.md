# LoLBindingFullTypeHelpModel

Describes a struct or enum type.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**description** | **string** |  | [optional] [default to undefined]
**fields** | [**Array&lt;LoLBindingFullFieldHelpModel&gt;**](LoLBindingFullFieldHelpModel.md) |  | [optional] [default to undefined]
**name** | **string** |  | [optional] [default to undefined]
**nameSpace** | **string** |  | [optional] [default to undefined]
**size** | **number** |  | [optional] [default to undefined]
**tags** | **Array&lt;string&gt;** |  | [optional] [default to undefined]
**values** | [**Array&lt;LoLBindingFullEnumValueHelpModel&gt;**](LoLBindingFullEnumValueHelpModel.md) |  | [optional] [default to undefined]

## Example

```typescript
import { LoLBindingFullTypeHelpModel } from '@private/leagoflegends-client';

const instance: LoLBindingFullTypeHelpModel = {
    description,
    fields,
    name,
    nameSpace,
    size,
    tags,
    values,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
