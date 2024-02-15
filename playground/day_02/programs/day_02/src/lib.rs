use anchor_lang::prelude::*;

declare_id!("6Q3jZR97LHruhME6ZLG2fyyxPf64hS2jcnZr5eCvt8iB");

#[program]
pub mod day_02 {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        a: u64,
        b: u64,
        message: String
    ) -> Result<()> {
        msg!("You said {:?}", message);
        msg!("You sent {} and {}", a, b);
        Ok(())
    }

    pub fn array(ctx: Context<Initialize>, arr: Vec<u64>) -> Result<()> {
        msg!("Your array {:?}", arr);
        Ok(())
    }

    pub fn exercises(ctx: Context<Initialize>, a: u64, b: u64) -> Result<()> {
        let result: u64 = a - b;
        //let result: u64 = a.checked_sub(b).unwrap();
        msg!("Your result, {} - {} {:?}", a, b, result);
        Ok(())
    }

    pub fn opplus(ctx: Context<Initialize>, a: f32, b: f32) -> Result<()> {
        let result:f32 = a + b;
        msg!("Your result, {} + {} = {:?}", a, b, result);
        Ok(())
    }

    pub fn opminus(ctx: Context<Initialize>, a: f32, b: f32) -> Result<()> {
        let result: f32 = a - b;
        msg!("Your result, {} - {} = {:?}", a, b, result);
        Ok(())
    }

    pub fn opdiv(ctx: Context<Initialize>, a: f32, b: f32) -> Result<()> {
        let result: f32 = a / b;
        msg!("Your result, {} / {} = {:?}", a, b, result);
        Ok(())
    }

    pub fn opsqrt(ctx: Context<Initialize>, a: f32) -> Result<()> {
        let result: f32 = a.sqrt();
        msg!("Your result, sqrt({}) = {:?}", a, result);
        Ok(())
    }

    pub fn oplog10(ctx: Context<Initialize>, a: f32) -> Result<()> {
        let result: f32 = a.log10();
        msg!("Your result, log10({}) = {:?}", a, result);
        Ok(())
    }



}

#[derive(Accounts)]
pub struct Initialize {}
