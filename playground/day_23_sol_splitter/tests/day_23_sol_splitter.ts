import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Day23SolSplitter } from "../target/types/day_23_sol_splitter";

describe("day_23_sol_splitter", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Day23SolSplitter as Program<Day23SolSplitter>;

  async function printAccountBalance(account) {
    const balance = await anchor.getProvider().connection.getBalance(account);
    console.log(`${account} has ${balance / anchor.web3.LAMPORTS_PER_SOL} SOL`);
  }

  it("Transmit SOL", async () => {
    // generate a new wallet
    const recipient1 = anchor.web3.Keypair.generate();
    await printAccountBalance(recipient1.publicKey);

    // generate a new wallet
    const recipient2 = anchor.web3.Keypair.generate();
    await printAccountBalance(recipient2.publicKey);

    // send the account 0.5 SOL via the program
    let amount = new anchor.BN(0.5 * anchor.web3.LAMPORTS_PER_SOL);
    await program.methods.sendSol(amount)
      .accounts({recipient: recipient1.publicKey})
      .rpc();

      await program.methods.sendSol(amount)
      .accounts({recipient: recipient2.publicKey})
      .rpc();

    console.log('');
    await printAccountBalance(recipient1.publicKey);
    await printAccountBalance(recipient2.publicKey);
  });


  // it("Is initialized!", async () => {
  //   // Add your test here.
  //   const tx = await program.methods.initialize().rpc();
  //   console.log("Your transaction signature", tx);
  // });

});
