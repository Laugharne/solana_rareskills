use anchor_lang::prelude::*;

declare_id!("2XSRcHuq3HZR5tPyrxzqcn6W4paK99271ZnstnYVR3ei");

#[program]
pub mod day_04 {
	use super::*;

	pub fn limit_range(ctx: Context<LimitRange>, a: u64) -> Result<()> {
		// require!(a >= 10, MyError::AisTooSmall);
		// require!(a <= 100, MyError::AisTooBig);
		require!(a >= 10, Day04Error::AisTooSmall);
		require!(a <= 100, Day04Error::AisTooBig);

		msg!("Result = {}", a);
		Ok(())
	}

	pub fn func(ctx: Context<ReturnError>) -> Result<()> {
		msg!("Will this print?");
		//return err!(MyError::AlwaysErrors);
		return err!(Day04Error::AlwaysErrors);
	}
}

#[derive(Accounts)]
pub struct LimitRange {}

#[derive(Accounts)]
pub struct ReturnError {}

#[error_code]
//pub enum MyError {
pub enum Day04Error {
	#[msg("a is too small")]
	AisTooSmall,
	#[msg("a is too big")]
	AisTooBig,
	#[msg("Always errors")]  // NEW ERROR, what do you think the error code will be?
	AlwaysErrors,
}
