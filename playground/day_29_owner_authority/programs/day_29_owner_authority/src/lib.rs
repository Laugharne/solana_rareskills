use anchor_lang::prelude::*;

declare_id!("EWLtK97QB7ipGWrUynMJE4J4Q6jf486MsA9yVtFg6MEY");

#[program]
pub mod day_29_owner_authority {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
