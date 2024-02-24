use anchor_lang::prelude::*;
use std::mem::size_of;

declare_id!("6LM7aA3mYDD5kWrdrWh2pfBA4HFgkVTdkepnCqSmdMXA");

#[program]
pub mod basic_storage {
	use super::*;

	pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
		Ok(())
	}
}

#[derive(Accounts)]
pub struct Initialize<'info> {

	#[account(init,
			  payer = signer,
			  space=size_of::<MyStorage>() + 8,
			  seeds = [],
			  bump)]
	pub my_storage: Account<'info, MyStorage>,
	
	#[account(mut)]
	pub signer: Signer<'info>,

	pub system_program: Program<'info, System>,
}

#[account]
pub struct MyStorage {
	x: i64,
	y: i64,
}
