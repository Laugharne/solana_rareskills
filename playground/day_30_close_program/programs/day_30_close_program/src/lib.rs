use anchor_lang::prelude::*;
use std::mem::size_of;

declare_id!("E9hD5YJbEjaP2LGG9KRwXUdRvfYGc6LKxdM9goFDmhtd");

#[program]
pub mod day_30_close_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    pub fn delete(ctx: Context<Delete>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = signer, space = size_of::<ThePda>() + 8, seeds = [], bump)]
    pub the_pda: Account<'info, ThePda>,

    #[account(mut)]
    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Delete<'info> {
    #[account(mut, close = signer, )]
    pub the_pda: Account<'info, ThePda>,

    #[account(mut)]
    pub signer: Signer<'info>,
}

#[account]
pub struct ThePda {
    pub x: u32,
}
