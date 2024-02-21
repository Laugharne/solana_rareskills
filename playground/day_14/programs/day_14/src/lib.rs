use anchor_lang::prelude::*;

declare_id!("BWBtaUY6gZBZKEYvPF1vgnU5vM7DuCxCduAHnEUSuiqs");
// NOTE: Replace with your wallet's public key
const OWNER: &str = "2mcDUMsXbfzeiyr8cNd4XrTp2uwKySC6ujGmCVfBfQ3j";

#[program]
pub mod day_14 {
    use super::*;

    #[access_control(check(&ctx))]
    pub fn owner_only(ctx: Context<OnlyOwner>) -> Result<()> {
        msg!("I'm the Owner !");

        Ok(())
    }

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let the_signer1: &mut Signer = &mut ctx.accounts.signer1;
        let the_signer2: &mut Signer = &mut ctx.accounts.signer2;

        msg!("The signer1: {:?}", *the_signer1.key);
        msg!("The signer2: {:?}", *the_signer2.key);

        Ok(())
    }

    pub fn another_function(ctx: Context<Initialize>) -> Result<()> {
        let the_signer1: &mut Signer = &mut ctx.accounts.signer1;
        let the_signer2: &mut Signer = &mut ctx.accounts.signer2;
        let the_signer3: &mut Signer = &mut ctx.accounts.signer3;

        msg!("* The signer1: {:?}", *the_signer1.key);
        msg!("* The signer2: {:?}", *the_signer2.key);
        msg!("* The signer2: {:?}", *the_signer3.key);

        Ok(())
    }
}

fn check(ctx: &Context<OnlyOwner>) -> Result<()> {
    // Check if signer === owner
    require_keys_eq!(
        ctx.accounts.signer_account.key(),
        OWNER.parse::<Pubkey>().unwrap(),
        OnlyOwnerError::NotOwner
    );

    Ok(())
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    pub signer1: Signer<'info>,
    pub signer2: Signer<'info>,
    pub signer3: Signer<'info>,

}

#[derive(Accounts)]
pub struct OnlyOwner<'info> {
    signer_account: Signer<'info>,
}

// An enum for custom error codes
#[error_code]
pub enum OnlyOwnerError {
    #[msg("Only owner can call this function!")]
    NotOwner,
}