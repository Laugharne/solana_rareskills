import * as anchor from "@coral-xyz/anchor";
//import { Program } from "@coral-xyz/anchor";
//import { Day18Read } from "../target/types/day_18_read";

describe("day_18_read", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Day18Read as Program<Day18Read>;

  it("Read other account", async () => {
    // the other program's programdId -- make sure the address is correct
    const otherProgramAddress = "8H6Ag2w2ipTuNyUi4dvKk3zPd4MYg3HCiUiBgmaC5NA2";
    const otherProgramId = new anchor.web3.PublicKey(otherProgramAddress);

    // load the other program's idl -- make sure the path is correct
    const otherIdl = JSON.parse(
        require("fs").readFileSync("../day_18_other_program/target/idl/day_18_other_program.json", "utf8")
    );
    
    const otherProgram = new anchor.Program(otherIdl, otherProgramId);

    const seeds = []
    const [trueOrFalseAcc, _bump] = 
	    anchor.web3.PublicKey.findProgramAddressSync(seeds, otherProgramId);
    let otherStorageStruct = await otherProgram.account.trueOrFalse.fetch(trueOrFalseAcc);

    console.log("The value of flag is:", otherStorageStruct.flag.toString());
  });

});
