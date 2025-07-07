use anchor_lang::prelude::*;

declare_id!("4Bszjehy9avaKiJNPqBrqmskQAvaKjjQe7945xc8Dj9U");

#[program]
pub mod calculator {
    use super::*;

    pub fn init(ctx:Context<Initialize>, init_value:u32)->Result<()>{
        ctx.accounts.account.num = init_value;
        Ok(())
    }

    pub fn double(ctx:Context<Double>)->Result<()>{
        ctx.accounts.account.num *= 2;
        Ok(())
    }

    pub fn add(ctx:Context<Add>,num:u32)->Result<()>{
        ctx.accounts.account.num += num;
        Ok(())
    }
}

#[account]
#[derive(InitSpace)]
struct DataShape{
    pub num: u32,
}
const DISCRIMINATOR: usize = 8; 
#[derive(Accounts)]

// we are not using system program bcz we are creating cpi account
pub struct Initialize <'info> {
    #[account(init, payer = user, space = DISCRIMINATOR + DataShape::INIT_SPACE)]
    pub account: Account<'info, DataShape>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}
 
 #[derive(Accounts)]
pub struct Double <'info> {
    #[account(mut)]
    pub account: Account<'info, DataShape>,
    #[account(mut)]
    pub user: Signer<'info>,
}
 
 #[derive(Accounts)]
 pub struct Add <'info> {
    #[account(mut)]
    pub account: Account<'info, DataShape>,
    #[account(mut)]
    pub user: Signer<'info>,
}
 
