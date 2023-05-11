# RNG Cup Qualifier Scripts

## About

These are scripts for the RNG Cup Qualifier Google Sheet.

## Prequisites

- [Node.js](https://nodejs.org/en)
- [clasp](https://developers.google.com/apps-script/guides/clasp)

## Getting started

Clone the repository and install dependencies.

```console
git clone https://github.com/minidomo/rng-cup-qualifier-sheet-gzs.git
cd rng-cup-qualifier-sheet-gzs
npm install
```

Set up `.clasp.json` and provide your `scriptId`.

```console
cp .clasp.json.example .clasp.json
```

Push your code to Apps Script:

```console
clasp push
```

## Resources

- [osu! API documentation](https://github.com/ppy/osu-api/wiki)
- [Apps Script documentation](https://developers.google.com/apps-script/reference)
- [clasp documentation](https://github.com/google/clasp)
- [Using Typescript with clasp](https://github.com/google/clasp/blob/master/docs/typescript.md)