use anchor_lang::prelude::*;
use std::mem::size_of;

declare_id!("8H6Ag2w2ipTuNyUi4dvKk3zPd4MYg3HCiUiBgmaC5NA2");

#[program]
pub mod day_18_other_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    // pub fn set(ctx: Context<Set>, new_x: u64) -> Result<()> {
    //     ctx.accounts.my_storage.x = new_x;
    //     Ok(())
    // }

    pub fn setbool(ctx: Context<SetFlag>, flag: bool) -> Result<()> {
        ctx.accounts.true_or_false.flag = flag;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    signer: Signer<'info>,

    system_program: Program<'info, System>,

    #[account(init, payer = signer, space = size_of::<TrueOrFalse>() + 8, seeds=[], bump)]
    true_or_false: Account<'info, TrueOrFalse>,
}

#[derive(Accounts)]
pub struct SetFlag<'info> {
    #[account(mut)]
    true_or_false: Account<'info, TrueOrFalse>, 
}

#[account]
pub struct TrueOrFalse {
    flag: bool,
}
