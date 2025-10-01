pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;

declare_id!("4ed6KQFodhNS4bQuKz37NeKpZ9bN4DsFwkEZfYCMCX3g");

#[program]
pub mod swap_escrew {
    use super::*;

    pub fn make_offer(
        context:Context<'_, '_, '_, '_, MakeOffer<'_>>,
        id:u64,
        token_a_offered_amount:u64,
        token_b_wanted_amount:u64
    )->Result<()>{
        instructions::make_offer::send_offered_tokens_to_vault(&context, token_a_offered_amount)?;
        instructions::make_offer::save_offer(context, id, token_b_wanted_amount)
    }

}
