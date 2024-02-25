import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { ReadWriteStorage } from "../target/types/read_write_storage";

describe("read_write_storage", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.ReadWriteStorage as Program<ReadWriteStorage>;

  it("Is initialized!", async () => {
    const seeds = []
    const [myStorage, _bump] = anchor.web3.PublicKey.findProgramAddressSync(seeds, program.programId);

    console.log("the storage account address is", myStorage.toBase58());

    await program.methods.initialize().accounts({ myStorage: myStorage }).rpc();
    //await program.methods.initialize().accounts({ myStorage: myStorage }).rpc();
    await program.methods.set(
      new anchor.BN(777)
    ).accounts({ myStorage: myStorage }).rpc();

    await program.methods.incX().accounts({myStorage: myStorage}).rpc();
    await program.methods.printX().accounts({myStorage: myStorage}).rpc();

  });
});
