use anchor_lang::prelude::*;

declare_id!("CH6XVmiuwgHHv1FbhyAojB9cGX7zTdsSmNys5menUvj1");

#[program]
pub mod day_01 {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Hello, world!");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
