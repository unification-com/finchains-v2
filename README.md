# Finchains

## Oracles

### admin

Need to authorise each exchange oracle. Set up .env with wallet and pkey for contract 
owner, then run:

```bash
node ./oracle-service/index.js add-oracle digifinex 0xd03ea8624C8C5987235048901fB614fDcA89b117
```

Thresholds can be set for each pair:

```bash
node ./oracle-service/index.js set-threshold LINK/BTC 0.01
```

### Run an oracle

Each oracle requires its own .env, with values set for:

```dotenv
EXCHANGE=
WALLET_ADDRESS=
WALLET_PKEY=
```

Once configured, run via cron etc.:

```
node ./oracle-service/index.js run-oracle
```

## Backend

### init db

Set up the DB to gather data from contract. Edit `common/db/config/config.json` and run:

```bash
cd common/db
npx sequelize-cli db:migrate
```

### run watchers

Run via `pm2`

For currency updates:

```bash
node backend/index.js --run=watch-event --event=CurrencyUpdate
```

For discrepancies:

```bash
node backend/index.js --run=watch-event --event=Discrepancy
```

For WRKCHain block hash submission:

```bash
node backend/index.js wrkchain
```

## Smart contract

### Deploying with `ganache-cli`

If `ganache-cli` is not installed, install with:

```bash
npm install -i ganache-cli
```

Run `ganache-cli` with:

```bash
npx ganache-cli --deterministic --accounts=20 --blockTime=15
```

The `--deterministic` flag will ensure the same keys and accounts are generated
each time

Deploy with:

```bash
npx oz deploy
```
