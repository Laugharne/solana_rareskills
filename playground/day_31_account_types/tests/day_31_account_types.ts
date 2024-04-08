import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Day31AccountTypes } from "../target/types/day_31_account_types";

describe("day_31_account_types", () => {
	const wallet = anchor.workspace.Day31AccountTypes.provider.wallet;

// Configure the client to use the local cluster.  
anchor.setProvider(anchor.AnchorProvider.env());  

const program = anchor.workspace.Day31AccountTypes as Program<Day31AccountTypes>;

  it("Wrong owner with Account", async () => {    
    await program.methods.hello().rpc();  
  });
});
