import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Day25KeypairVsPda } from "../target/types/day_25_keypair_vs_pda";

// Change this to your path
import privateKey from '/home/franck/.config/solana/id.json';
//import { fs } from fs;

// this airdrops sol to an address
async function airdropSol(publicKey, amount) {
  let airdropTx = await anchor.getProvider().connection.requestAirdrop(publicKey, amount * anchor.web3.LAMPORTS_PER_SOL);
  await confirmTransaction(airdropTx);
}

async function confirmTransaction(tx) {
  const latestBlockHash = await anchor.getProvider().connection.getLatestBlockhash();
  await anchor.getProvider().connection.confirmTransaction({
    blockhash           : latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature           : tx,
  });
}


describe("day_25_keypair_vs_pda", () => {
  const deployer = anchor.web3.Keypair.fromSecretKey(Uint8Array.from(privateKey));

  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Day25KeypairVsPda as Program<Day25KeypairVsPda>;
  it("Console log account owner", async () => {

    console.log(`The program address is ${program.programId}`) 
    const newKeypair = anchor.web3.Keypair.generate();
    var recieverWallet = anchor.web3.Keypair.generate();

    // get account owner before initialization
    await airdropSol(newKeypair.publicKey, 10);
        const accountInfoBefore = await anchor.getProvider().connection.getAccountInfo(newKeypair.publicKey);
        console.log(`initial keypair account owner is ${accountInfoBefore.owner}`);

    await program.methods.initializeKeypairAccount()
      .accounts({myKeypairAccount: newKeypair.publicKey})
      .signers([newKeypair]) // the signer must be the keypair
      .rpc();

        // get account owner after initialization
        const accountInfoAfter = await anchor.getProvider().connection.getAccountInfo(newKeypair.publicKey);
        console.log(`initial keypair account owner is ${accountInfoAfter.owner}`);
  });


  // it("Is initialized -- keypair version", async () => {
        
  //   const newKeypair = anchor.web3.Keypair.generate();
  //   await airdropSol(newKeypair.publicKey, 1e9); // 1 SOL

  //   const secondKeypair = anchor.web3.Keypair.generate();
  //   await airdropSol(secondKeypair.publicKey, 1e9); // 1 SOL

  //   const seeds = []
  //   const [pda, _bump] = anchor
  //                   .web3
  //                   .PublicKey
  //                   .findProgramAddressSync(
  //                       seeds,
  //                       program.programId);

  //   console.log("the keypair account address is", newKeypair.publicKey.toBase58());

  //   await program.methods.initializeKeypairAccount()
  //   .accounts({myKeypairAccount: pda})
  //   //.accounts({myKeypairAccount: secondKeypair.publicKey})
  //   //.accounts({myKeypairAccount: newKeypair.publicKey})
  //   .signers([newKeypair]) // the signer must be the keypair
  //     .rpc();
  // });

});
