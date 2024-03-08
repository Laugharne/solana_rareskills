import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Day27ReinitAttack } from "../target/types/day_27_reinit_attack";

describe("day_27_reinit_attack", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Day27ReinitAttack as Program<Day27ReinitAttack>;

  it("initialize after giving to system program or draining lamports", async () => {

    // 1 We initialize the PDA
    const [myPda, _bump] = anchor.web3.PublicKey.findProgramAddressSync([], program.programId);
    await program.methods.initialize().accounts({myPda: myPda}).rpc();
    // 2. We transfer ownership of the PDA to the system program
    await program.methods.giveToSystemProgram().accounts({myPda: myPda}).rpc();
    // 3. We call initialize again, and it succeeds
    await program.methods.initialize().accounts({myPda: myPda}).rpc();
    console.log("account initialized after giving to system program!")

    // 4. We empty the lamports from the my_pda account
    await program.methods.drainLamports().accounts({myPda: myPda}).rpc();
    // With zero lamport balance, the Solana runtime considers the
    // account non-existent as it will be scheduled for deletion as
    // it is no longer rent exempt.

    // 6. We call initialize again, and it succeeds. 
    await program.methods.initialize().accounts({myPda: myPda}).rpc();
    console.log("account initialized after draining lamports!")
    // We have successfully reinitialized the account after following this sequence.
  });

});
