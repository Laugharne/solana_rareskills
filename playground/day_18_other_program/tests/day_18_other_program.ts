import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Day18OtherProgram } from "../target/types/day_18_other_program";

describe("day_18_other_program", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Day18OtherProgram as Program<Day18OtherProgram>;

  it("Is initialized!", async () => {
    const seeds = []
    const [TrueOrFalse, _bump] = anchor.web3.PublicKey.findProgramAddressSync(seeds, program.programId);

    console.log("address: ", program.programId.toBase58());

    await program.methods.initialize().accounts({trueOrFalse: TrueOrFalse}).rpc();
    await program.methods.setbool(true).accounts({trueOrFalse: TrueOrFalse}).rpc();
  });
});
