#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("FqzkXZdwYjurnUKetJCAvaUw5WAqbwzU6gZEwydeEfqS");

#[program]
pub mod crudapp {
   use super::*;

   pub fn create_journel_entry(ctx:Context<CreateJournelEntry>,title:String,message:String)->Result<()> {
    let journel_entry = &mut ctx.accounts.journel_entry;
    journel_entry.owner = ctx.accounts.owner.key();
    journel_entry.title = title;
    journel_entry.message = message;
    Ok(())
   }

   pub fn update_journel_entry(ctx:Context<UpdateJournelEntry>,_title:String,message:String)->Result<()> {
    let journel_entry = &mut ctx.accounts.journel_entry;
    journel_entry.message = message;
    Ok(())
   }

   pub fn delete_journel_entry(_ctx:Context<DeleteJournelEntry>,_title:String)->Result<()> {
    Ok(())
   }


}

#[derive(Accounts)]
#[instruction(title:String)]
pub struct DeleteJournelEntry<'info>{
    #[account(mut,
        seeds = [title.as_bytes(), owner.key().as_ref()],
        bump,
        close = owner,
    )]
    pub journel_entry : Account<'info,JournalEntryState>,
    #[account(mut)]
    owner : Signer<'info>,
    pub system_program:Program<'info,System>
}

#[derive(Accounts)]
#[instruction(title:String)]
pub struct UpdateJournelEntry<'info>{
    #[account(mut,
        seeds = [title.as_bytes(), owner.key().as_ref()],
        bump,
        realloc= 8 + JournalEntryState::INIT_SPACE,
        realloc::payer = owner,
        realloc::zero = true, 
    )]
    pub journel_entry : Account<'info,JournalEntryState>,
    #[account(mut)]
    pub owner:Signer<'info>,
    pub system_program:Program<'info,System>
}

#[derive(Accounts)]
#[instruction(title:String)]
pub struct CreateJournelEntry<'info>{
    #[account(
        init,
        seeds = [title.as_bytes(), owner.key().as_ref()],
        space = 8 + JournalEntryState::INIT_SPACE,
        payer = owner,
        bump
    )]
    pub journel_entry : Account<'info,JournalEntryState>,
    #[account(mut)]
    pub owner:Signer<'info>,
    pub system_program:Program<'info,System>

}

#[account]
#[derive(InitSpace)]
pub struct JournalEntryState{
    pub owner:Pubkey,
    #[max_len(50)]
    pub title:String,
    #[max_len(200)]
    pub message:String,
}

