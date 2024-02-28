use anchor_lang::prelude::*;
use anchor_lang::solana_program::rent as rent_module;

declare_id!("GHAEycdDsks4iWDLjJHVNu7uLtqdumonNR55LQbSanNQ");

#[program]
pub mod day_20_rent {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let cost_of_empty_acc = rent_module::ACCOUNT_STORAGE_OVERHEAD as f64 * 
                                rent_module::DEFAULT_LAMPORTS_PER_BYTE_YEAR as f64 *
                                rent_module::DEFAULT_EXEMPTION_THRESHOLD; 

        msg!("cost to create an empty account: {}", cost_of_empty_acc);
        // 890880

        let cost_for_32_bytes = cost_of_empty_acc + 
                                32 as f64 * 
                                rent_module::DEFAULT_LAMPORTS_PER_BYTE_YEAR as f64 *
                                rent_module::DEFAULT_EXEMPTION_THRESHOLD;

        msg!("cost to create a 32 byte account: {}", cost_for_32_bytes);
        // 1,113,600 lamports

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
