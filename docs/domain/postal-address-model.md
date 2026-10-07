# Postal address model

Postal address is the first deeply implemented domain. The canonical fields are a comparison vocabulary; not every source format or profile exposes all of them.

```text
careOf                 department             subDepartment
streetName             buildingNumber         buildingName
floor                  unitNumber             postBox
room                   postCode               townName
townLocationName       districtName           countrySubdivision
country                addressLines[]
```

Each element retains original representation, semantic path, locator, interpretation method, and confidence. Keep address lines ordered and individually locatable. Do not coerce postal codes or building numbers to numbers and thereby lose meaningful characters.

## Representation metadata

| Mode | Intended description |
| --- | --- |
| STRUCTURED | Discrete address components, without free-text address lines |
| HYBRID | Structured components and address lines coexist |
| UNSTRUCTURED | Address lines without discrete components |
| EMPTY | No populated address information |

Representation mode describes an artifact's representation; it is not the address itself. **STATUS: OPEN (O-08):** exact classification of country-only content, whitespace, empty elements, and partial parser coverage. Do not equate STRUCTURED with policy conformance or infer structure from words without evidence.

## Fidelity example

Fictional canonical source: `buildingNumber=1200`, `streetName=BRICKELL AVE`, `room=STE 900`, `townName=MIAMI`, `country=US`. Fictional target: `streetName="1200 BRICKELL AVE STE 900"`, same town and country.

Building number and room are preserved, collapsed, and misplaced. Street name is preserved and collapsed. Town and country are preserved. This requires source knowledge of discrete components. A free-text source containing the same characters requires a different interpretation and provenance account.

Deterministic structuring of synthetic composite examples is in scope; a general address parser and AI/LLM inference are not. Ambiguous segmentation must remain visible rather than being silently resolved.
