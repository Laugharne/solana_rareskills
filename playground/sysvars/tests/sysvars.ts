import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Sysvars } from "../target/types/sysvars";

describe("sysvars", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Sysvars as Program<Sysvars>;

  // Create a StakeHistory PublicKey object
  const StakeHistory_PublicKey = new anchor.web3.PublicKey(
    "SysvarStakeHistory1111111111111111111111111"
  );

  // Create a LastRestartSlot PublicKey object
  const LastRestartSlot_PublicKey = new anchor.web3.PublicKey(
    "SysvarLastRestartS1ot1111111111111111111111"
  );

  it("Is initialized!", async () => {
    // Add your test here.
    //const tx = await program.methods.initialize().rpc();

    const tx = await program.methods
      .initialize(3) // Call the initialze function with the number `3`
      .accounts({
        stakeHistory: StakeHistory_PublicKey, // pass the public key of StakeHistory sysvar to the list of accounts needed for the instruction
        recentBlockhashes: anchor.web3.SYSVAR_RECENT_BLOCKHASHES_PUBKEY, // pass the public key of RecentBlockhashes sysvar to the list of accounts needed for the instruction
        instructionSysvar: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY, // Pass the public key of the Instruction sysvar to the list of accounts needed for the instruction
        lastRestartSlot: LastRestartSlot_PublicKey, // pass the public key of LastRestartSlot sysvar to the list of accounts needed for the instruction
    })
    .rpc();




    console.log("Your transaction signature", tx);
  });



});
