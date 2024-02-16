use anchor_lang::prelude::*;

declare_id!("8PSAL9t1RMb7BcewhsSFrRQDq61Y7YXC5kHUxMk5b39Z");

#[program]
pub mod anchor_function_tutorial {
	use super::*;

	pub fn function_a(ctx: Context<NonEmptyAccountExample>) -> Result<()> {
		Ok(())
	}

	pub fn function_b(ctx: Context<Empty>, firstArg: u64) -> Result<()> {
		Ok(())
	}
}

#[derive(Accounts)]
pub struct NonEmptyAccountExample<'info> {
	signer: Signer<'info>,
	another_signer: Signer<'info>,
}

#[derive(Accounts)]
pub struct Empty {}
