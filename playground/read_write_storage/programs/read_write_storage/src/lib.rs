use anchor_lang::prelude::*;
use std::mem::size_of;

declare_id!("6AHTMuew9aNk4RWEaYNJ18mBEeVrrDaiwwpcGgLqui3o");

#[program]
pub mod read_write_storage {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    // pub fn set(ctx: Context<Set>, new_x: u64) -> Result<()> {
    //     ctx.accounts.my_storage.x = new_x;
    //     Ok(())
    // }

    pub fn set(ctx: Context<Set>, new_x: u64) -> Result<()> {
        let my_storage = &mut ctx.accounts.my_storage;
        my_storage.x = new_x;
    
        Ok(())
    }

    pub fn inc_x(ctx: Context<IncX>) -> Result<()> {
        let my_storage = &mut ctx.accounts.my_storage;
        my_storage.x = my_storage.x + 1;
        msg!("The value of x+1 is {}", my_storage.x);
        Ok(())
    }

    pub fn print_x(ctx: Context<PrintX>) -> Result<()> {
        let x = ctx.accounts.my_storage.x;
        msg!("The value of x is {}", x);
        Ok(())
    }

}

#[derive(Accounts)]
pub struct Set<'info> {
    #[account(mut, seeds = [], bump)]
    pub my_storage: Account<'info, MyStorage>,
}

#[derive(Accounts)]
pub struct IncX<'info> {
    #[account(mut, seeds = [], bump)]
    pub my_storage: Account<'info, MyStorage>,
}

#[derive(Accounts)]
pub struct PrintX<'info> {
    pub my_storage: Account<'info, MyStorage>,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init,
              payer = signer,
              space=size_of::<MyStorage>() + 8,
              seeds = [],
              bump)]
    pub my_storage: Account<'info, MyStorage>,

    #[account(mut)]
    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[account]
pub struct MyStorage {
    x: u64,
}
