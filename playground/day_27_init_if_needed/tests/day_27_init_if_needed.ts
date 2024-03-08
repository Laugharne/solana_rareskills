import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Day27InitIfNeeded } from "../target/types/day_27_init_if_needed";

describe("day_27_init_if_needed", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Day27InitIfNeeded as Program<Day27InitIfNeeded>;

  it("Is initialized!", async () => {
    const [myPda, _bump] = anchor.web3.PublicKey.findProgramAddressSync([], program.programId);
    await program.methods.increment().accounts({myPda: myPda}).rpc();
    await program.methods.increment().accounts({myPda: myPda}).rpc();
    await program.methods.increment().accounts({myPda: myPda}).rpc();

    let result = await program.account.myPda.fetch(myPda);
    console.log(`counter is ${result.counter}`);
  });


});
