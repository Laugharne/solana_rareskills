use anchor_lang::prelude::*;
use std::mem::size_of;
use anchor_lang::system_program;

declare_id!("C3MYbqkJmgpu2t5u9FNV8K55TKmqpbTGLK2kYeGGJYvM");

#[program]
pub mod day_27_reinit_attack {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    pub fn erase(ctx: Context<Erase>) -> Result<()> {
        ctx.accounts.my_pda.realloc(0, false)?;
        Ok(())
    }

    // pub fn drain_lamports(ctx: Context<DrainLamports>) -> Result<()> {
    //     let lamports = ctx.accounts.my_pda.to_account_info().lamports();
    //     ctx.accounts.my_pda.sub_lamports(lamports)?;
    //     ctx.accounts.signer.add_lamports(lamports)?;
    //     Ok(())
    // }

    // pub fn give_to_system_program(ctx: Context<GiveToSystemProgram>) -> Result<()> {
    //     let account_info = &mut ctx.accounts.my_pda.to_account_info();
    //     // the assign method changes the owner
    //     account_info.assign(&system_program::ID);
    //     account_info.realloc(0, false)?;

    //     Ok(())
    // }
}

#[derive(Accounts)]
pub struct Erase<'info> {
		/// CHECK: We are going to erase the account
    #[account(mut)]
    pub my_pda: UncheckedAccount<'info>,
}

// #[derive(Accounts)]
// pub struct DrainLamports<'info> {
//     #[account(mut)]
//     pub my_pda: Account<'info, MyPDA>,
//     #[account(mut)]
//     pub signer: Signer<'info>,
// }

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = signer, space = 8, seeds = [], bump)]
    pub my_pda: Account<'info, MyPDA>,

    #[account(mut)]
    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

// #[derive(Accounts)]
// pub struct GiveToSystemProgram<'info> {
//     #[account(mut)]
//     pub my_pda: Account<'info, MyPDA>,
// }

#[account]
pub struct MyPDA {}
