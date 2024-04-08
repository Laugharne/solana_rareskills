use anchor_lang::prelude::*;

declare_id!("EbnHdCoS4bykPtbHeDCSztUyJzCUeQoRSQBsiBfGq9d3");

#[program]
pub mod day_31_account_types {
	use super::*;    
	pub fn hello(ctx: Context<Hello>) -> Result<()> {        
		let lamports = ctx.accounts.signer.lamports();        
		let address = &ctx.accounts
			.signer
			.signer_key().unwrap();        
		msg!(
			"hello {:?} you have {} lamports", 
			address, 
			lamports
		);        
		Ok(())    
}}

#[derive(Accounts)]
pub struct Hello<'info> {    
	pub signer: Signer<'info>,
}