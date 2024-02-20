[Solana logs, “events,” and transaction history](https://www.rareskills.io/post/solana-logs-transaction-history)

# Solana logs, “events,” and transaction history

![](assets/2024-02-20-11-34-52.png)

Solana programs can emit events similar to how [**Ethereum emits events**](https://www.rareskills.io/post/ethereum-events), though there are some differences we will discuss.

Specifically, events in Solana are intended to pass information to the frontend rather than document past transactions. To get past history, Solana transactions can be queried by address.



## Solana Logs and Events

The program below has two events: `MyEvent` and `MySecondEvent`. Similar to how Ethereum events have **“arguments”**, Solana events have fields in the struct:

```rust
use anchor_lang::prelude::*;

declare_id!("FmyZrMmPvRzmJCG3p5R1AnbkPqSmzdJrcYzgnQiGKuBq");

#[program]
pub mod emit {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        emit!(MyEvent { value: 42 });
        emit!(MySecondEvent { value: 3, message: "hello world".to_string() });
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

#[event]
pub struct MyEvent {
    pub value: u64,
}

#[event]
pub struct MySecondEvent {
    pub value:   u64,
    pub message: String,
}
```



Events become part of the [**Solana program’s IDL**](https://www.rareskills.io/post/anchor-idl), similar to how events are part of a Solidity smart contract’s ABI. Below we screenshot the IDL of the program above while highlighting the relevant part:

![](assets/2024-02-20-11-36-44.png)

There is no such thing as “indexed” or “non-indexed” information in Solana like there is in Ethereum (even though there is an “index” field in the screenshot above, it has no use).

Unlike Ethereum:
- We cannot directly query for past events over a range of block numbers.
- We can only listen for events as they occur (*We will see later Solana’s method to audit past transactions*).

The code below shows how to listen for events in Solana:

```javascript
import * as anchor from "@coral-xyz/anchor";
import { BorshCoder, EventParser, Program } from "@coral-xyz/anchor";
import { Emit } from "../target/types/emit";

describe("emit", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Emit as Program<Emit>;

  it("Is initialized!", async () => {
    const listenerMyEvent = program.addEventListener('MyEvent', (event, slot) => {
      console.log(`slot ${slot} event value ${event.value}`);
    });

    const listenerMySecondEvent = program.addEventListener('MySecondEvent', (event, slot) => {
      console.log(`slot ${slot} event value ${event.value} event message ${event.message}`);
    });

    await program.methods.initialize().rpc();

		// This line is only for test purposes to ensure the event
		// listener has time to listen to event.
    await new Promise((resolve) => setTimeout(resolve, 5000));

    program.removeEventListener(listenerMyEvent);
    program.removeEventListener(listenerMySecondEvent);
  });
});
```

It is not possible to scan for past logs like it is in Ethereum, they must be watched for while the transaction is happening.

![](assets/2024-02-20-11-38-41.png)


## How logs work under the hood

- In the **EVM**, logs are emitted by running the `log0`, `log1`, `log2`, etc... **opcode**.
- In **Solana**, logs are run by calling the **system call** `sol_log_data`. As an argument, it is simply a sequence of bytes:

See : [**log.rs - source**](https://docs.rs/solana-program/latest/src/solana_program/log.rs.html#116-124)

Below is the function of the system call in the Solana client:

![](assets/2024-02-20-11-41-09.png)

The **“struct”** structure we are using to create an event is an abstraction on the byte sequence. Behind the scenes, Anchor turns the struct into a byte sequence to pass to this function.

> **The Solana system call only takes a byte sequence, not a struct**.


## Solana logs are not for historical querying

- **In Ethereum**, logs are used for auditing purposes.
- But **in Solana**, logs cannot be used in that manner since they can only be queried as they occur.
- Thefore, they are better suited for passing information to the frontend application.
- Solana functions cannot return data to the frontend the way that Solidity view functions can, so Solana logs are a lightweight way to accomplish this.

Events are preserved in the block explorer however. See the bottom of this transaction as an example:

[**Transaction | JgyHQPxL3cPLFtV4cx5i842ZgBx57R2fkNn2TZn1wsQZqVXKfijd43CEHo88C3ridK27Kw8KkMzfvDdqaS398SX | Solana**](https://explorer.solana.com/tx/JgyHQPxL3cPLFtV4cx5i842ZgBx57R2fkNn2TZn1wsQZqVXKfijd43CEHo88C3ridK27Kw8KkMzfvDdqaS398SX)


## Unlike Ethereum, Solana transactions can be queried by address

In Ethereum, there is no direct way to query the transactions either sent to a smart contract or from a particular wallet.

- We can count the number of transactions sent from an address using [**eth_getTransactionCount**](https://ethereum.org/developers/docs/apis/json-rpc#eth_gettransactioncount).
- We can get a specific transaction using the transaction hash with [**eth_getTransactionByHash**](https://ethereum.org/developers/docs/apis/json-rpc#eth_gettransactionbyhash).
- We can get the transactions in a specific block using [**eth_getBlockByNumber**](https://ethereum.org/developers/docs/apis/json-rpc#eth_getblockbynumber) or [**eth_getBlockByHash**](https://ethereum.org/developers/docs/apis/json-rpc#eth_getblockbyhash).

However, there it is not possible to get all transactions by address. This has to be done indirectly by parsing every block since the wallet became active or the smart contract was deployed.

To audit the transactions in a smart contract, developers add smart contract events to query transactions of interest.


## Getting the transaction history in Solana

On the other hand, Solana has an **RPC** function [**getSignaturesForAddress**](https://solana.com/docs/rpc/http/getsignaturesforaddress) which lists all the transactions an address has done.

> **The address can be a program or a wallet.**


The following is a script to list the transactions from an address:

```javascript
let web3 = require('@solana/web3.js');

const solanaConnection = new web3.Connection(web3.clusterApiUrl("mainnet-beta"));

const getTransactions = async(address,limit) => {
  const pubKey = new web3.PublicKey(address);
  let transactionList = await solanaConnection.getSignaturesForAddress(pubKey, {limit: limit});
  let signatureList = transactionList.map(transaction => transaction.signature);

  console.log(signatureList);

  for await (const sig of signatureList) {
    console.log(await solanaConnection.getParsedTransaction(sig, {maxSupportedTransactionVersion: 0}));
  }
}

let myAddress = "enter and address here";

getTransactions(myAddress, 3);
```

Note that the actual content of the transaction is retrieved using the `getParsedTransaction` **RPC** method.