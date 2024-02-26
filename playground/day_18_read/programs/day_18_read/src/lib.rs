use anchor_lang::prelude::*;

declare_id!("2P5tskZaSEagMX5AV7ahPyKkbzgG5SzSsEC5JVdgmNq9");

#[program]
pub mod day_18_read {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
