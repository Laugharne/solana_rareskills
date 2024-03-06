use anchor_lang::prelude::*;
use std::mem::size_of;

declare_id!("3Z4ZkhHK21tojJB1N8eF8Q944iFQRVLaDryDvnsnQN7R");

#[program]
pub mod day_24_other_write {
	use super::*;

	pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
		Ok(())
	}

	pub fn update_value(ctx: Context<UpdateValue>, new_value: u64) -> Result<()> {
		ctx.accounts.my_storage.x = new_value;
		Ok(())
	}

}

#[derive(Accounts)]
pub struct Initialize<'info> {
	#[account(init,
			  payer = fren,
			  space=size_of::<MyStorage>() + 8,
			  seeds = [],
			  bump)]
	pub my_storage: Account<'info, MyStorage>,

	#[account(mut)]
	pub fren: Signer<'info>, // A public key is passed here

	pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateValue<'info> {
	#[account(mut, seeds = [], bump)]
	pub my_storage: Account<'info, MyStorage>,

	// THIS FIELD MUST BE INCLUDED
	#[account(mut)]
	pub fren: Signer<'info>,
}

#[account]
pub struct MyStorage {
	x: u64,
}
