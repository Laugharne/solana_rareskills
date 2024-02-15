import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Day02 } from "../target/types/day_02";

describe("day_02", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Day02 as Program<Day02>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize(
      new anchor.BN(777),
      new anchor.BN(888),
      "hello"
    ).rpc();
    console.log("Your transaction signature", tx);
  });

  it("Array test", async () => {
    const tx = await program.methods.array([new anchor.BN(777), new anchor.BN(888)]).rpc();
    console.log("Your transaction signature", tx);
  });
  
  it("Exercise", async () => {
    const tx = await program.methods.exercises(
      new anchor.BN(0),
      new anchor.BN(1)).rpc();
    console.log("Your transaction signature", tx);
  });
  
  it("Plus", async () => {
    const tx = await program.methods.opplus(
      new anchor.BN(3),
      new anchor.BN(7)).rpc();
    console.log("Your transaction signature", tx);
  });
  
  it("Minus", async () => {
    const tx = await program.methods.opminus(
      new anchor.BN(13),
      new anchor.BN(3)).rpc();
    console.log("Your transaction signature", tx);
  });
  
  it("Division", async () => {
    const tx = await program.methods.opdiv(
      new anchor.BN(70),
      new anchor.BN(7)).rpc();
    console.log("Your transaction signature", tx);
  });
  
  it("Square root", async () => {
    const tx = await program.methods.opsqrt(
      new anchor.BN(100)
      ).rpc();
    console.log("Your transaction signature", tx);
  });
  
  it("Log 10", async () => {
    const tx = await program.methods.oplog10(
      new anchor.BN(10000)
      ).rpc();
    console.log("Your transaction signature", tx);
  });
  
});
