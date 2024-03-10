use anchor_lang::prelude::*;
use std::mem::size_of;

declare_id!("7ZvpnBGWchEF3ReQDEvQ3koUeX8GMkYvR3Lh7gyu7tR7");

#[program]
pub mod day_28_batch {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    pub fn set(ctx: Context<Set>, new_val: u32) -> Result<()> {
        ctx.accounts.pda.value = new_val;
        //return err!(Error::AlwaysFails);
        Ok(()) // ERROR HAS BEEN REMOVED
    }
}

#[error_code]
pub enum Error {
    #[msg(always fails)]
    AlwaysFails,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = signer, space = size_of::<PDA>() + 8, seeds = [], bump)]
    pub pda: Account<'info, PDA>,

    #[account(mut)]
    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Set<'info> {
    #[account(mut)]
    pub pda: Account<'info, PDA>,
}

#[account]
pub struct PDA {
    pub value: u32,
}
