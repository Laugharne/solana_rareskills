import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Day26Owner } from "../target/types/day_26_owner";

async function airdropSol(publicKey, amount) {
  let airdropTx = await anchor.getProvider().connection.requestAirdrop(publicKey, amount * anchor.web3.LAMPORTS_PER_SOL);
  await confirmTransaction(airdropTx);
}

async function confirmTransaction(tx) {
  const latestBlockHash = await anchor.getProvider().connection.getLatestBlockhash();
  await anchor.getProvider().connection.confirmTransaction({
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature: tx,
  });
}

describe("day_26_owner", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Day26Owner as Program<Day26Owner>;

  it("Is initialized!", async () => {
    console.log("program address", program.programId.toBase58());    

    const seeds = []

    // init PDA account
    // ----------------
    const [pda, bump_] = anchor.web3.PublicKey.findProgramAddressSync(
      seeds,
      program.programId
    );

    console.log("owner of pda before initialize:",
        await anchor.getProvider().connection.getAccountInfo(pda));
    // null

    await program.methods.initializePda()
    .accounts({pda: pda}).rpc();
    // PDa account <-- CPYcaakSCpEzq42q2C6YJUCJX2FU1uDGLirsVFKkkC1r (program)

    console.log("owner of pda after initialize:",
        (await anchor.getProvider().connection.getAccountInfo(pda)).owner.toBase58());
    // CPYcaakSCpEzq42q2C6YJUCJX2FU1uDGLirsVFKkkC1r

    // init keypair account
    // --------------------
    let keypair = anchor.web3.Keypair.generate();

    // console log the keypair owner before the initialization transaction.
    // --------------------------------------------------------------------
    console.log("owner of keypair before airdrop:",
        await anchor.getProvider().connection.getAccountInfo(keypair.publicKey));
    // null

    await airdropSol(keypair.publicKey, 1); // 1 SOL
    //  Airdrops 1 SOL to the given public Key

    // console log the keypair owner after the initialization transaction.
    // -------------------------------------------------------------------
    console.log("owner of keypair after airdrop:",
        (await anchor.getProvider().connection.getAccountInfo(keypair.publicKey)).owner.toBase58());
    // 11111111111111111111111111111111
    // keypair account <-- 11111111111111111111111111111111 (system program)

    await program.methods.initializeKeypair()
      .accounts({keypair: keypair.publicKey})
      .signers([keypair]) // the signer must be the keypair
      .rpc();

    console.log("owner of keypair after initialize:",
        (await anchor.getProvider().connection.getAccountInfo(keypair.publicKey)).owner.toBase58());
    // CPYcaakSCpEzq42q2C6YJUCJX2FU1uDGLirsVFKkkC1r
    // keypair account <-- CPYcaakSCpEzq42q2C6YJUCJX2FU1uDGLirsVFKkkC1r (program)

  });
});
