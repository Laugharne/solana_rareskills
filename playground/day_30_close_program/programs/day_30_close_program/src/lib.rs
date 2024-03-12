use anchor_lang::prelude::*;

declare_id!("E9hD5YJbEjaP2LGG9KRwXUdRvfYGc6LKxdM9goFDmhtd");

#[program]
pub mod day_30_close_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
