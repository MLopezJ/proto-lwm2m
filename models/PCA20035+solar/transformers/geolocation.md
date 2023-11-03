---
type: shadow
---

# Geo Location

Creates the geo location data from the asset_tracker_v2 shadow document.

## Match Expression

```jsonata
$exists(state.reported.gnss.v.lat)
```

## Transform Expression

```jsonata
[
    {"bn": 14201, "n": 0,"v": state.reported.gnss.v.lat, "bt": state.reported.gnss.ts },
    {"n": 1, "v": state.reported.gnss.v.lng },
    {"n": 2, "v": state.reported.gnss.v.alt },
    {"n": 3, "v": state.reported.gnss.v.acc },
    {"n": 4, "v": state.reported.gnss.v.spd },
    {"n": 5, "v": state.reported.gnss.v.hdg }
]
```

## Input Example

```json
{
  "state": {
    "reported": {
      "gnss": {
        "v": {
          "lng": -84.506132079174634,
          "lat": 33.98755678796222,
          "acc": 17.74077033996582,
          "alt": 295.468994140625,
          "spd": 26.376304626464844,
          "hdg": 359.15457153320312
        },
        "ts": 1698155694999
      }
    }
  }
}
```

## Result Example

```json
[
  {
    "bn": 14201,
    "bt": 1698155694999,
    "n": 0,
    "v": 33.98755678796222
  },
  {
    "n": 1,
    "v": -84.506132079174634
  },
  {
    "n": 2,
    "v": 295.468994140625
  },
  {
    "n": 3,
    "v": 17.74077033996582
  },
  {
    "n": 4,
    "v": 26.376304626464844
  },
  {
    "n": 5,
    "v": 359.15457153320312
  }
]
```
