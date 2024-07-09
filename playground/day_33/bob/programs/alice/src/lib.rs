use anchor_lang::prelude::*;
// account struct for add_and_store use bob::cpi::accounts::BobAddOp;

// The program definition for Bob
use bob::program::Bob;

// the account where Bob is storing the sum
use bob::BobData;

use bob::cpi::accounts::BobAddOp;

declare_id!("FLuUHoSt8DqMW4JVnWRjSbz6JtZq6xxqMc6A3PWehP6q");

#[program]
pub mod alice {
	use super::*;

	pub fn ask_bob_to_add(ctx: Context<AliceOp>, a: u64, b: u64) -> Result<()> {
		let cpi_ctx = CpiContext::new(
			ctx.accounts.bob_program.to_account_info(),
			BobAddOp {
				bob_data_account: ctx.accounts.bob_data_account.to_account_info(),
			}
		);

		let res = bob::cpi::add_and_store(cpi_ctx, a, b);

		// return an error if the CPI failed
		if res.is_ok() {
			return Ok(());
		} else {
			return err!(Errors::CPIToBobFailed);
		}
	}
}

#[error_code]
pub enum Errors {
	#[msg("cpi to bob failed")]
	CPIToBobFailed,
}

#[derive(Accounts)]
pub struct AliceOp<'info> {
	#[account(mut)]
	pub bob_data_account: Account<'info, BobData>,

	pub bob_program: Program<'info, Bob>,
}
