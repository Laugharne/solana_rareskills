import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Day14 } from "../target/types/day_14";

describe("day_14", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Day14 as Program<Day14>;

  // generate a signer to call our function
  let myKeypair  = anchor.web3.Keypair.generate();
  let myKeypair2 = anchor.web3.Keypair.generate();
  let notOwner   = anchor.web3.Keypair.generate();

  it("Is signed by multiple signers", async () => {
    // Add your test here.
    const tx = await program.methods
      .initialize()
      .accounts({
        signer1: program.provider.publicKey,
        signer2: myKeypair.publicKey,
      })
      .signers([myKeypair])
      .rpc();

    console.log("The signer1: ", program.provider.publicKey.toBase58());
    console.log("The signer2: ", myKeypair.publicKey.toBase58());
  });

  it("Another function", async () => {
    // Add your test here.
    const tx = await program.methods
      .anotherFunction()
      .accounts({
        signer1: program.provider.publicKey,
        signer2: myKeypair.publicKey,
        signer3: myKeypair2.publicKey,
      })
      .signers([myKeypair, myKeypair2])
      .rpc();

    console.log("The signer1: ", program.provider.publicKey.toBase58());
    console.log("The signer2: ", myKeypair.publicKey.toBase58());
    console.log("The signer3: ", myKeypair2.publicKey.toBase58());
  });

  it("Is called by the owner", async () => {
    // Add your test here.
    const tx = await program.methods
      .ownerOnly()
      .accounts({
        signerAccount: program.provider.publicKey,
      })
      .rpc();

    console.log("Transaction hash:", tx);
  });

  it("Is NOT called by the owner", async () => {
    // Add your test here.
    const tx = await program.methods
      .ownerOnly()
      .accounts({
        signerAccount: notOwner.publicKey,
      })
      .signers([notOwner])
      .rpc();

    console.log("Transaction hash:", tx);
  });

});
