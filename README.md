# `hello.nrfcloud.com` LwM2M Protocols [![npm version](https://img.shields.io/npm/v/@hello.nrfcloud.com/proto-lwm2m.svg)](https://www.npmjs.com/package/@hello.nrfcloud.com/proto-lwm2m)

[![GitHub Actions](https://github.com/hello-nrfcloud/proto-lwm2m/actions/workflows/build-and-publish.yaml/badge.svg)](https://github.com/hello-nrfcloud/proto-lwm2m/actions/workflows/build-and-publish.yaml)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Renovate](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com)
[![@commitlint/config-conventional](https://img.shields.io/badge/%40commitlint-config--conventional-brightgreen)](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier/)
[![ESLint: TypeScript](https://img.shields.io/badge/ESLint-TypeScript-blue.svg)](https://github.com/typescript-eslint/typescript-eslint)

Documents the LwM2M communication protocol between devices, the
`hello.nrfcloud.com` backend and the web application.

The [`lwm2m`](./lwm2m/) folder contains the LwM2M objects that devices publish.

## Usage

```bash
npm i --save-exact @hello.nrfcloud.com/proto-lwm2m
```

## Setup

Install the dependencies:

```bash
npm ci
```

## Run tests

```bash
npm test
```

## Update generated code

```bash
npx tsx generator/lwm2m.ts
npx tsx generator/models.ts
```

## Model protocols definitions

The [`models`](./models/) folder defines data models which allows anyone to
register a device model and then describe the data the model is publishing using
LwM2M object definitions ([example](./lwm2m/14201.xml)). This allows the
`hello.nrfcloud.com` web application to visualize this data in a meaningful way
to users without the need for custom implementation.

LwM2M object definitions are shared between models and can be re-used. Some
objects provide special behavior (for example object
[`14201` (Geolocation)](./lwm2m/14201.xml) will place the device's location on
the map).

Data from devices is received via nRF Cloud (using the Message Bridge), and
devices have to use the shadow update API or messaging API to publish their
data.

Devices can publish data using
[SenML](https://datatracker.ietf.org/doc/html/rfc8428) directly, which needs to
map to the defined LwM2M objects ([example](./senml/SenMLSchema.spec.ts)).

Optionally, a set of [JSONata](https://jsonata.org/) expression can be defined
per model which allow to convert from the JSON data format that is published by
the devices to the SenML data format required by the data store
([example mapping](./models/PCA20035+solar/transformers/geolocation.md).

The data store will [expand](./senml/senMLtoLwM2M.spec.ts the SenML payload) and
store it under the deviceID, and the respective object and resource ID, binned
to 10 minutes.

## Model definition rules

- **device models** are identified using a model name, for example
  `PCA20035+solar`
- a [`README.md`](./models/PCA20035+solar/README.md) must be provided that
  describes the model
- transforms may define transforms that convert the data sent by the device
  using JSONata in one or more Markdown files
  ([Example](./models/PCA20035+solar/transformers/geolocation.md)):
  - The `Match Expression` the must evaluate to `true` for the
    `Transform Expression` to be applied to the input message
  - an `Input Example` and a `Result Example` must be supplied to validate the
    expression
  - The result of the Transform Expression must be SenML according to the rules
    outlined below.

The conformity to the rules is checked using the script
[`./models/check-model-rules.ts`](./models/check-model-rules.ts).

## LwM2M rules

- LwM2M objects are defined in the ID range from `14200` to `15000`
  (non-inclusively).
- The URN must have the prefix `urn:oma:lwm2m:x:`.
- The object version must be appended if it is not `1.0`
- All objects must define one timestamp property.

The conformity to the rules is checked using the script
[`./lwm2m/check-lwm2m-rules.ts`](./lwm2m/check-lwm2m-rules.ts).

## SenML rules

- Use the object ID as the **base name** `bn`, `urn:oma:lwm2m:x:` must be
  omitted.
- `bn` and `n` are joined using `:`, therefore `bn` should only contain the
  object ID
- The LwM2M object ID in `bn` and the resource ID in `n` are expressed as a
  number.
- Use the custom property `blv` to specify the object version, `1.0` is the
  default and should not be specified.
- Timestamps are to be expressed in the **base time** property `bt` and are
  mapped to the LwM2M object's timestamp property and must not be send as a
  property.

## Data rules

- Published **device messages** must not be older than 7 days
- Device data will be removed after 30 days
- Devices must not send more than 200 messages per day (in average ~1 message
  every 10 minutes).
- Data history resolution will be 10 minutes, updates are not possible.
- Real-time interactivity is not supported.
