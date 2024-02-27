import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Day19ExampleMap } from "../target/types/day_19_example_map";

describe("day_19_example_map", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Day19ExampleMap as Program<Day19ExampleMap>;

  // it("Initialize mapping storage", async () => {
  //   const key = new anchor.BN(42);

  //   //const seeds = []
  //   const seeds = [key.toArrayLike(Buffer, "le", 8)];
  //   //const [seeds, _bump] = [key.toArrayLike(Buffer, "le", 8)];
  //   let valueAccount = anchor.web3.PublicKey.findProgramAddressSync(
  //     seeds,
  //     program.programId,
  //   )[0];
  //   //console.log(valueAccount);
  //   await program.methods.initialize(key).accounts({val: valueAccount}).rpc();
  // });

  it("Initialize and set value", async () => {
    // const key   = new anchor.BN(42);
    // const value = new anchor.BN(1337);

    // we now have two keys
    const key1 = new anchor.BN(42);
    const key2 = new anchor.BN(43);
    const key3 = new anchor.BN(44); //+ 3 keys
    const value = new anchor.BN(1337);

    //const seeds = [key.toArrayLike(Buffer, "le", 8)];

    // seeds has two values
    const seeds = [
      key1.toArrayLike(Buffer, "le", 8),
      key2.toArrayLike(Buffer, "le", 8),
      key3.toArrayLike(Buffer, "le", 8) //+
    ];

    let valueAccount = anchor.web3.PublicKey.findProgramAddressSync(
      seeds,
      program.programId,
    )[0];

    // functions now take two keys
    // functions now take three keys
    await program.methods.initialize(key1, key2, key3).accounts({val: valueAccount}).rpc();
    //await program.methods.initialize(key1, key2).accounts({val: valueAccount}).rpc();
    await program.methods.set(key1, key2, key3, value).accounts({val: valueAccount}).rpc();
    //await program.methods.set(key1, key2, value).accounts({val: valueAccount}).rpc();
    // await program.methods.initialize(key).accounts({val: valueAccount}).rpc();
    // await program.methods.set(key, value).accounts({val: valueAccount}).rpc();


    // read the account back
    let result = await program.account.val.fetch(valueAccount);
    // let result = await program.account.val.fetch(valueAccount);
    console.log(`the value ${result.value} was stored in ${valueAccount.toBase58()}`);
    //console.log(`key is ${key}`);
    //console.log(`keys are ${key1},${key2}`);
    console.log(`keys are ${key1},${key2},${key3}`);

  });

});
