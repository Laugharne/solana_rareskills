import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Day21Balance } from "../target/types/day_21_balance";

describe("day_21_balance", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Day21Balance as Program<Day21Balance>;

  // the following is the Solana wallet we are using
  let pubkey = new anchor.web3.PublicKey("2mcDUMsXbfzeiyr8cNd4XrTp2uwKySC6ujGmCVfBfQ3j");


  it("Tests the balance", async () => {
    const tx = await program.methods.readBalance().accounts({ acct: pubkey }).rpc();
  });
});
