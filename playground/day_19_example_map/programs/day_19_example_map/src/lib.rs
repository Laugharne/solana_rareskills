use anchor_lang::prelude::*;
use std::mem::size_of;

declare_id!("x5MkyBjzr9UynGFks6HmSQgWD4qAcsdmff8JTvgHyv5");

#[program]
pub mod day_19_example_map {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, key1: u64, key2: u64, key3: u64) -> Result<()> {
    //pub fn initialize(ctx: Context<Initialize>, key1: u64, key2: u64) -> Result<()> {
    //pub fn initialize(ctx: Context<Initialize>, key: u64) -> Result<()> {
        Ok(())
    }

    pub fn set(ctx: Context<Set>, key1: u64, key2: u64, key3: u64, val: u64) -> Result<()> {
    //pub fn set(ctx: Context<Set>, key1: u64, key2: u64, val: u64) -> Result<()> {
    //pub fn set(ctx: Context<Set>, key: u64, val: u64) -> Result<()> {
        ctx.accounts.val.value = val;
        Ok(())
    }
    
}

#[derive(Accounts)]
#[instruction(key1: u64, key2: u64, key3: u64)]    // new key args added
//#[instruction(key1: u64, key2: u64)]    // new key args added
//#[instruction(key: u64)]
pub struct Initialize<'info> {

    #[account(init,
              payer = signer,
              space = size_of::<Val>() + 8,
              seeds =[&key1.to_le_bytes().as_ref(), &key2.to_le_bytes().as_ref(), &key3.to_le_bytes().as_ref()], // 3 seeds
              //seeds =[&key1.to_le_bytes().as_ref(), &key2.to_le_bytes().as_ref()], // 2 seeds
              //seeds =[&key.to_le_bytes().as_ref()],
              bump)]
    val: Account<'info, Val>,
    
    #[account(mut)]
    signer: Signer<'info>,
    
    system_program: Program<'info, System>,
}

#[account]
pub struct Val {
    value: u64,
}


#[derive(Accounts)]
#[instruction(key1: u64, key2: u64, key3: u64)] // new key args added
//#[instruction(key1: u64, key2: u64)] // new key args added
//#[instruction(key: u64)]
pub struct Set<'info> {
    #[account(mut)]
    val: Account<'info, Val>,
}
