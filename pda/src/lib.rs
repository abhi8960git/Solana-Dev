use solana_program::{
    account_info::AccountInfo,
    entrypoint::ProgramResult,
    pubkey::Pubkey,
    system_instruction::create_account,
    program::invoke_signed,
}

entrypoint!(process_instruction);

fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
)-> ProgramResult {
   // create a pda on chain 
   // pda , userAcc, systemProgram

   let iter =  accounts.iter();
   let pda_account = next_account_info(&mut iter)?;
   let user_account = next_account_info(&mut iter)?;//who is paying for it 
   let system_program = next_account_info(&mut iter)?;
   let seeds = &[user_account.key.as_ref(),b"user"];
   let (bump) = Pubkey::find_program_address(
       seeds,
       program_id,
   );

   let ix = create_account(
     from_pubkey: user_account.key,
     to_pubkey: pda_account.key,
     lamports: 1_000_000, // Amount of lamports to transfer
     space: 8, // Space for the PDA account
     program_id: program_id,
   );

   invoke_signed(
    &ix,
    &[pda_account.clone(), user_account.clone(), system_program.clone()],
    &[&[seeds],&[bump]], // array of bytes for seeds for PDA
   )

    Ok(())

}