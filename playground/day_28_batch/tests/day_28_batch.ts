import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Day28Batch } from "../target/types/day_28_batch";

describe("day_28_batch", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Day28Batch as Program<Day28Batch>;

  // it("Is initialized!", async () => {
  //   const wallet = anchor.workspace.Day28Batch.provider.wallet.payer;
  //   const [pda, _bump] = anchor.web3.PublicKey.findProgramAddressSync([], program.programId);

  //   const initTx = await program.methods.initialize()
  //               .accounts({pda: pda})
  //                   .transaction();

  //   // for u32, we don't need to use big numbers
  //   const setTx = await program.methods.set(5)
  //               .accounts({pda: pda})
  //                   .transaction();

  //   let transaction = new anchor.web3.Transaction();
  //   transaction.add(initTx);
  //   transaction.add(setTx);

  //   await anchor.web3.sendAndConfirmTransaction(anchor.getProvider().connection, transaction, [wallet]);

  //   const pdaAcc = await program.account.pda.fetch(pda);
  //   console.log(pdaAcc.value); // prints 5
  // });

  // it("Set the number to 5, initializing if necessary", async () => {
  //   const wallet = anchor.workspace.Day28Batch.provider.wallet.payer;
  //   const [pda, _bump] = anchor.web3.PublicKey.findProgramAddressSync([], program.programId);

  //   // console.log the address of the pda
  //   console.log(pda.toBase58());

  //   let transaction = new anchor.web3.Transaction();
  //   transaction.add(await program.methods.initialize().accounts({pda: pda}).transaction());
  //   transaction.add(await program.methods.set(5).accounts({pda: pda}).transaction());

  //   await anchor.web3.sendAndConfirmTransaction(anchor.getProvider().connection, transaction, [wallet]);
  // });

  it("Set the number to 5, initializing if necessary", async () => {
    const wallet = anchor.workspace.Day28Batch.provider.wallet.payer;
    const [pda, _bump] = anchor.web3.PublicKey.findProgramAddressSync([], program.programId);

    let accountInfo = await anchor.getProvider().connection.getAccountInfo(pda);

    let transaction = new anchor.web3.Transaction();
    if (accountInfo == null || accountInfo.lamports == 0 || accountInfo.owner == anchor.web3.SystemProgram.programId) {
      console.log("need to initialize");
      const initTx = await program.methods.initialize().accounts({pda: pda}).transaction();
      transaction.add(initTx);
    }
    else {
      console.log("no need to initialize");
    }

    // we're going to set the number anyway
    const setTx = await program.methods.set(5).accounts({pda: pda}).transaction();
    transaction.add(setTx);

    await anchor.web3.sendAndConfirmTransaction(anchor.getProvider().connection, transaction, [wallet]);

    const pdaAcc = await program.account.pda.fetch(pda);
    console.log(pdaAcc.value);
  });

});
