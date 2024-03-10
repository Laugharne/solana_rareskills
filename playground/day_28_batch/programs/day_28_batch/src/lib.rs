use anchor_lang::prelude::*;

declare_id!("7ZvpnBGWchEF3ReQDEvQ3koUeX8GMkYvR3Lh7gyu7tR7");

#[program]
pub mod day_28_batch {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
