# SnapCRUD

> **DISCLAIMER**: This project is not production ready. All versions below 1.0.0 should be considered unstable

SnapCRUD is a simple tool that lets you manage your database directly in your web browser. It's great for projects that need a quick admin panel or a way for non-technical users to manage simple data.

To get started, you only need to specify what tables and columns should be displayed and edited.

Currently, it supports MySQL only.

## Installation

### npm

```bash
npm install snapcrud
```

or

```bash
npm install -g snapcrud
```

## Configuration

Environmental variables for credentials:

```properties
SNAPCRUD_DB_HOST=host
SNAPCRUD_DB_PORT=port
SNAPCRUD_DB_USER=user
SNAPCRUD_DB_PASSWORD=pass
SNAPCRUD_DB_NAME=database
SNAPCRUD_HOST=host
SNAPCRUD_PORT=port
```

JSON file for tables setup:

```json
{
  "displayAllTables": false,
  "tables": [
    {
      "name": "table1",
      "displayAllColumns": false,
      "visibleColumns": ["id"],
      "editableColumns": ["display_name"]
    },
    {
      "name": "table2",
      "displayAllColumns": true
    }
  ]
}
```

## Usage

As a standalone web-server:

> WARNING! It doesn't include any auth workflow, your data and the web-server are directly exposed to the Internet. Make sure you've done extra measures to protect the web-server.

```bash
npx snapcrud -c /path/to/config.json
```

## Contributing

Visit [`CONTRIBUTING.md`](CONTRIBUTING.md).

## License

Visit [`LICENSE`](LICENSE).

## Anca

This repository is a part of [Anca](https://github.com/cinnabar-forge/anca) standardization project. Parts of the files and code are generated by Anca.
