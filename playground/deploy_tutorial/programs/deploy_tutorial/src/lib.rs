use anchor_lang::prelude::*;

declare_id!("CDYnRYE3tbKwihoQ6MEqEU4oxsQERZg6eSBHcH1neWNU");

#[program]
pub mod deploy_tutorial {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
