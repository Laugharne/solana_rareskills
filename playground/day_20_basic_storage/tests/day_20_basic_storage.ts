import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Day20BasicStorage } from "../target/types/day_20_basic_storage";

describe("day_20_basic_storage", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Day20BasicStorage as Program<Day20BasicStorage>;

  it("Is initialized!", async () => {
    const seeds = []
    const [myStorage, _bump] = anchor.web3.PublicKey.findProgramAddressSync(seeds, program.programId);

    console.log("the storage account address is", myStorage.toBase58());

    await program.methods.initialize().accounts({ myStorage: myStorage }).rpc();
    await program.methods.increaseAccountSize().accounts({ myStorage: myStorage }).rpc();
  });
});
