import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Day30CloseProgram } from "../target/types/day_30_close_program";
import { assert } from "chai";

describe("day_30_close_program", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Day30CloseProgram as Program<Day30CloseProgram>;

  it("Is initialized!", async () => {
    let [thePda, _bump] = anchor.web3.PublicKey.findProgramAddressSync([], program.programId);
     await program.methods.initialize().accounts({thePda: thePda}).rpc();
     await program.methods.delete().accounts({thePda: thePda}).rpc();
 
     let account = await program.account.thePda.fetchNullable(thePda);
     console.log(account)
   });

});
